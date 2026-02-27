/**
 * Content Sync Script
 *
 * This script reads raw content files and generates clean .en.md and .zh.md files.
 *
 * Rules:
 * 1. Raw files may contain mixed English/Chinese, dirty format, incomplete translations
 * 2. Generate .en.md with clean English-only content
 * 3. Generate .zh.md with clean Chinese-only content
 * 4. Preserve exact wording when content exists for that language
 * 5. Clean up markdown formatting
 */

import fs from 'fs';
import path from 'path';

interface ParsedContent {
  english: Record<string, string>;
  chinese: Record<string, string>;
}

/**
 * Detect if text is Chinese (contains Chinese characters)
 */
function isChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

/**
 * Detect if text is English (mostly Latin characters)
 */
function isEnglish(text: string): boolean {
  return !isChinese(text) && /[a-zA-Z]/.test(text);
}

/**
 * Section and subsection header names for zh output (quality checklist: .zh.md Chinese-only)
 * Raw file keeps English; generated .zh.md uses Chinese headers.
 */
const HOMEPAGE_ZH_SECTIONS: Record<string, string> = {
  'Hero Section': '英雄区',
  'Featured Arenas Section': '精选实践区',
  'Industries Section': '行业区',
  'Real-World Testing Section': '实战验证区',
  'Approach Section': '方法区',
  'Practice Includes Section': '实践包含区',
  'Case Studies Section': '案例研究区',
  'Trust Section': '信任区',
  'Final CTA Section': '最终行动区',
};
const HOMEPAGE_ZH_SUBSECTIONS: Record<string, string> = {
  Badges: '徽章',
  'Main Content': '主要内容',
  'CTA Buttons': '行动按钮',
  Content: '内容',
  Header: '标题区',
  'Step 1': '步骤 1',
  'Step 2': '步骤 2',
  'Step 3': '步骤 3',
  'Feature 1': '特点 1',
  'Feature 2': '特点 2',
  'Feature 3': '特点 3',
  'Feature 4': '特点 4',
  'Case Study 1': '案例 1',
  'Trust Point 1': '信任点 1',
  'Trust Point 2': '信任点 2',
  'Trust Point 3': '信任点 3',
  'Value Point 1': '价值点 1',
  'Value Point 2': '价值点 2',
  'Value Point 3': '价值点 3',
  'Value Point 4': '价值点 4',
};

/**
 * Parse homepage.raw.md content
 * Format: ## Section Name -> ### Content -> - **Key (EN)**: value / - **Key (ZH)**: value
 * .en.md keeps English headers; .zh.md uses Chinese headers (quality checklist)
 */
function parseHomepageContent(content: string): { en: string; zh: string } {
  const lines = content.split('\n');
  const sectionsEn: string[] = [];
  const sectionsZh: string[] = [];

  let currentSection = '';
  let currentSectionEn: string[] = [];
  let currentSectionZh: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Top level section (##)
    if (line.match(/^##\s+/)) {
      // Save previous section
      if (currentSection && currentSectionEn.length > 0) {
        sectionsEn.push(`## ${currentSection}\n${currentSectionEn.join('\n')}`);
      }
      if (currentSection && currentSectionZh.length > 0) {
        const zhSection = HOMEPAGE_ZH_SECTIONS[currentSection] ?? currentSection;
        sectionsZh.push(`## ${zhSection}\n${currentSectionZh.join('\n')}`);
      }

      currentSection = line.replace(/^##\s+/, '').trim();
      currentSectionEn = [];
      currentSectionZh = [];
      continue;
    }

    // Sub section (###) - English for .en, Chinese for .zh
    if (line.match(/^###\s+/)) {
      const subsection = line.replace(/^###\s+/, '').trim();
      const zhSubsection = HOMEPAGE_ZH_SUBSECTIONS[subsection] ?? subsection;
      currentSectionEn.push(`\n### ${subsection}`);
      currentSectionZh.push(`\n### ${zhSubsection}`);
      continue;
    }

    // Key-value pairs with language markers
    if (line.trim().startsWith('- **')) {
      const match = line.match(/-\s*\*\*([^*]+)\*\*\s*[:：]\s*(.+)/);
      if (match) {
        const key = match[1];
        const value = match[2].trim();

        // Determine which language this is for
        if (key.endsWith('(EN)')) {
          const cleanKey = key.replace(/\s*\(EN\)$/, '');
          currentSectionEn.push(`- **${cleanKey}**: ${value}`);
        } else if (key.endsWith('(ZH)')) {
          const cleanKey = key.replace(/\s*\(ZH\)$/, '');
          currentSectionZh.push(`- **${cleanKey}**: ${value}`);
        } else {
          // No language specified, use for both
          currentSectionEn.push(`- **${key}**: ${value}`);
          currentSectionZh.push(`- **${key}**: ${value}`);
        }
      }
    }
  }

  // Don't forget the last section
  if (currentSection && currentSectionEn.length > 0) {
    sectionsEn.push(`## ${currentSection}\n${currentSectionEn.join('\n')}`);
  }
  if (currentSection && currentSectionZh.length > 0) {
    const zhSection = HOMEPAGE_ZH_SECTIONS[currentSection] ?? currentSection;
    sectionsZh.push(`## ${zhSection}\n${currentSectionZh.join('\n')}`);
  }

  return {
    en: sectionsEn.join('\n\n'),
    zh: sectionsZh.join('\n\n')
  };
}

/**
 * Parse Framework page specifically - it has a unique format with ### English/Chinese Content subsections
 */
function parseFrameworkPage(content: string, locale: 'en' | 'zh'): string {
  // Remove the first line if it's the title (we'll add it back)
  const lines = content.split('\n');
  const firstLine = lines[0];
  const hasTitle = firstLine.startsWith('#');
  const contentToProcess = hasTitle ? lines.slice(1).join('\n') : content;

  const sections = contentToProcess.split(/^## /m).filter(s => s.trim());
  const result: string[] = [];

  // Add title back if it existed
  if (hasTitle && firstLine.trim()) {
    result.push(firstLine.trim());
  }

  for (const section of sections) {
    const sectionLines = section.split('\n');
    const sectionTitle = sectionLines[0]?.trim();
    if (!sectionTitle) continue;

    // Skip team notes
    if (sectionTitle.includes('Team') || sectionTitle.includes('Notes')) {
      continue;
    }

    result.push(`## ${sectionTitle}`);

    let currentContentLang: 'en' | 'zh' | null = null;
    let inContentBlock = false;

    for (let i = 1; i < sectionLines.length; i++) {
      const line = sectionLines[i];

      // Check for content language markers
      if (line.trim() === '### English Content') {
        currentContentLang = 'en';
        continue;
      }
      if (line.trim() === '### Chinese Content') {
        currentContentLang = 'zh';
        continue;
      }

      // Check for inline language markers in format "**English**: text"
      if (line.match(/^\*\*English\*\*[:：]/)) {
        const content = line.replace(/^\*\*English\*\*[:：]\s*/, '');
        if (locale === 'en') {
          result.push(content);
        }
        continue;
      }
      if (line.match(/^\*\*(Chinese|中文)\*\*[:：]/)) {
        const content = line.replace(/^\*\*(Chinese|中文)\*\*[:：]\s*/, '');
        if (locale === 'zh') {
          result.push(content);
        }
        continue;
      }

      // Handle subsection headers
      if (line.match(/^###\s+/) && !line.includes('Content')) {
        const headerMatch = line.match(/^###\s+(.+)/);
        if (headerMatch) {
          const text = headerMatch[1].trim();
          // Include subsection headers (they're usually neutral or have both languages)
          result.push(line);
        }
        currentContentLang = null; // Reset after subsection
        continue;
      }

      // Handle content based on language
      if (locale === 'en') {
        // English: include when currentContentLang is 'en' or 'null' (both)
        if (currentContentLang === 'zh') continue;
        if (line.includes('**Chinese**') || line.includes('**中文**')) continue;
        // Remove Chinese annotations
        let cleaned = line.replace(/（[^）]*中文[^）]*）/g, '').trim();
        cleaned = cleaned.replace(/（.*?）/g, '').trim();
        // Remove pure Chinese parts
        cleaned = cleaned.replace(/[\u4e00-\u9fa5]+/g, ' ').trim();
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        if (cleaned || line.trim() === '') {
          result.push(cleaned);
        }
      } else {
        // Chinese: include when currentContentLang is 'zh' or 'null' (both)
        if (currentContentLang === 'en') continue;
        if (line.includes('**English**')) continue;
        // Extract Chinese content from annotations
        if (line.includes('（中文：')) {
          const match = line.match(/（中文：([^）]+)）/);
          if (match) {
            result.push(match[1]);
          }
        } else if (isChinese(line) || line.trim() === '') {
          result.push(line);
        }
      }
    }
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n');
}

/**
 * Parse FAQ page specifically - handles Q&A format with bilingual answers
 */
function parseFAQPage(content: string, locale: 'en' | 'zh'): string {
  const lines = content.split('\n');
  const result: string[] = [];

  // Add the title
  result.push(locale === 'en' ? '# FAQ - Frequently Asked Questions' : '# FAQ - 常见问题');

  let currentAnswer: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop at notes section
    if (line.includes('## Notes for Content Team') || line.includes('## Notes')) {
      break;
    }

    // Skip team content section
    if (line.includes('## Team Maintained Original Content') || line.includes('### Page Header') || line.includes('## FAQ Categories')) {
      continue;
    }

    // Contact Section header - skip it, we'll use the subsections
    if (line.includes('## Contact Section')) {
      if (currentAnswer.length > 0) {
        result.push(currentAnswer.join(' ').trim());
        currentAnswer = [];
      }
      result.push('');
      continue;
    }

    // Category headers (### Category X: Name（中文名）)
    if (line.match(/^###\s+Category/)) {
      if (currentAnswer.length > 0) {
        result.push(currentAnswer.join(' ').trim());
        result.push('');
        currentAnswer = [];
      }

      if (locale === 'en') {
        // Extract "About RWAI Arena" from "Category 1: About RWAI Arena（关于RWAI Arena）"
        const enMatch = line.match(/Category\s+\d+:\s*([^（]+)(?:\s*[（\(]|$)/);
        if (enMatch && enMatch[1]) {
          result.push(`### ${enMatch[1].trim()}`);
        }
      } else {
        // Extract "关于RWAI Arena" from "Category 1: About RWAI Arena（关于RWAI Arena）"
        const zhMatch = line.match(/[（\(]([^）)]+)[）)]/);
        if (zhMatch && zhMatch[1]) {
          result.push(`### ${zhMatch[1].trim()}`);
        }
      }
      result.push('');
      continue;
    }

    // Question headers (#### Q1: Question?)
    if (line.match(/^####\s+[A-Z]\d+:/)) {
      if (currentAnswer.length > 0) {
        result.push(currentAnswer.join(' ').trim());
        result.push('');
        currentAnswer = [];
      }

      if (locale === 'en') {
        const enMatch = line.match(/[A-Z]\d+:\s*(.+)/);
        if (enMatch && enMatch[1]) {
          result.push(`#### ${enMatch[1].trim()}`);
        }
      }
      // For Chinese, wait for the next line with **中文**:
      continue;
    }

    // Chinese question marker line (after #### Qx:)
    if (line.match(/^\*\*中文\*\*[:：]/)) {
      if (locale === 'zh') {
        const zhQuestion = line.replace(/^\*\*中文\*\*[:：]\s*/, '').trim();
        result.push(`#### ${zhQuestion}`);
      }
      continue;
    }

    // Answer markers
    if (line.match(/^\*\*English Answer\*\*[:：]/)) {
      if (locale === 'en') {
        const answer = line.replace(/^\*\*English Answer\*\*[:：]\s*/, '').trim();
        currentAnswer = [answer];
      }
      continue;
    }

    if (line.match(/^\*\*中文回答\*\*[:：]/)) {
      if (locale === 'zh') {
        const answer = line.replace(/^\*\*中文回答\*\*[:：]\s*/, '').trim();
        currentAnswer = [answer];
      }
      continue;
    }

    // Subsection headers (###) - for contact section
    if (line.match(/^###\s+/) && !line.includes('Category')) {
      const headerText = line.replace(/^###\s+/, '').trim();

      if (headerText === 'Still Have Questions?') {
        result.push('### ' + (locale === 'en' ? 'Still Have Questions?' : '仍有疑问？'));
        // Look ahead for the description lines (format: **English**: text then **Chinese**: text)
        // We need to find the appropriate line based on locale
        for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
          const lookAheadLine = lines[j];
          if (locale === 'en' && lookAheadLine.includes('**English**')) {
            const enMatch = lookAheadLine.match(/\*\*English\*\*[:：]\s*(.+)/);
            if (enMatch && enMatch[1]) {
              result.push(enMatch[1].trim());
            }
            i = j; // Skip to this line
            break;
          } else if (locale === 'zh' && lookAheadLine.includes('**Chinese**')) {
            const zhMatch = lookAheadLine.match(/\*\*Chinese\*\*[:：]\s*(.+)/);
            if (zhMatch && zhMatch[1]) {
              result.push(zhMatch[1].trim());
            }
            i = j; // Skip to this line
            break;
          }
        }
        result.push('');
        continue;
      }

      if (headerText === 'Contact Methods') {
        result.push('### ' + (locale === 'en' ? 'Contact Methods' : '联系方式'));
        result.push('');
        continue;
      }
    }

    // Contact lines
    if (line.startsWith('- **GitHub**') || line.startsWith('- **Email**')) {
      result.push(line);
      continue;
    }

    // Divider - finalize answer
    if (line.trim() === '---' && currentAnswer.length > 0) {
      result.push(currentAnswer.join(' ').trim());
      result.push('');
      currentAnswer = [];
      continue;
    }

    // Empty line - finalize answer
    if (line.trim() === '' && currentAnswer.length > 0) {
      result.push(currentAnswer.join(' ').trim());
      result.push('');
      currentAnswer = [];
    }
  }

  // Don't forget the last answer
  if (currentAnswer.length > 0) {
    result.push(currentAnswer.join(' ').trim());
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n');
}

/**
 * Parse About page specifically - handles sections with bilingual content
 */
function parseAboutPage(content: string, locale: 'en' | 'zh'): string {
  const lines = content.split('\n');
  const result: string[] = [];

  let currentSection = '';
  let inItemsSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Stop at notes section
    if (line.includes('## Notes') || line.includes('## Notes for Content Team')) {
      break;
    }

    // Skip team content section header
    if (line.includes('## Team Maintained Original Content') || line.includes('## Main Content')) {
      continue;
    }

    // Section headers (###)
    if (line.match(/^###\s+/)) {
      const sectionText = line.replace(/^###\s+/, '').trim();
      inItemsSection = false;

      // Extract Chinese from parentheses for zh locale
      if (locale === 'zh') {
        const zhMatch = sectionText.match(/[（\(]([^\）)]+)[）)]/);
        if (zhMatch) {
          result.push(`## ${zhMatch[1]}`);
        } else {
          const chineseChars = sectionText.match(/[\u4e00-\u9fa5]+/g);
          if (chineseChars && chineseChars.length > 0) {
            result.push(`## ${sectionText.trim()}`);
          }
        }
      } else {
        // Extract English part (before Chinese)
        const enMatch = sectionText.match(/^([A-Za-z0-9\s\?\-]+)/);
        if (enMatch) {
          result.push(`## ${enMatch[1].trim()}`);
        }
      }
      continue;
    }

    // Sub-subsection headers (####)
    if (line.match(/^####\s+/)) {
      const subsectionText = line.replace(/^####\s+/, '').trim();

      if (locale === 'en') {
        // Extract English part
        const enMatch = subsectionText.match(/^([A-Za-z0-9\s\?\-]+)/);
        if (enMatch) {
          result.push(`### ${enMatch[1].trim()}`);
        }
      } else {
        // Extract Chinese part
        const zhMatch = subsectionText.match(/[（\(]([^\）)]+)[）)]/);
        if (zhMatch) {
          result.push(`### ${zhMatch[1]}`);
        }
      }
      continue;
    }

    // Items section
    if (line.trim() === '**Items**:') {
      inItemsSection = true;
      continue;
    }

    // Item entries with Icon
    if (inItemsSection && line.trim().startsWith('- **Item')) {
      const itemMatch = line.match(/-\s*\*\*Item\s+\d+:\*\*/);
      if (itemMatch) {
        // Read next few lines for Icon, Title, Description
        let itemTitle = '';
        let itemDesc = '';

        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const itemLine = lines[j];

          if (itemLine.includes('**Icon**:')) {
            continue; // Skip icon line
          }

          if (itemLine.includes('**Title (EN)**')) {
            if (locale === 'en') {
              const titleMatch = itemLine.match(/\*\*Title\s*\(EN\)\*\*[:：]\s*(.+)/);
              if (titleMatch) itemTitle = titleMatch[1].trim();
            }
            continue;
          }

          if (itemLine.includes('**Title (ZH)**')) {
            if (locale === 'zh') {
              const titleMatch = itemLine.match(/\*\*Title\s*\(ZH\)\*\*[:：]\s*(.+)/);
              if (titleMatch) itemTitle = titleMatch[1].trim();
            }
            continue;
          }

          if (itemLine.includes('**Description (EN)**')) {
            if (locale === 'en') {
              const descMatch = itemLine.match(/\*\*Description\s*\(EN\)\*\*[:：]\s*(.+)/);
              if (descMatch) itemDesc = descMatch[1].trim();
            }
            continue;
          }

          if (itemLine.includes('**Description (ZH)**')) {
            if (locale === 'zh') {
              const descMatch = itemLine.match(/\*\*Description\s*\(ZH\)\*\*[:：]\s*(.+)/);
              if (descMatch) itemDesc = descMatch[1].trim();
            }
            continue;
          }

          // Break at next item or empty line
          if (itemLine.trim().startsWith('- **Item') || itemLine.trim() === '' || itemLine.includes('---')) {
            break;
          }
        }

        if (itemTitle) {
          result.push(`- ${itemTitle}`);
          if (itemDesc) {
            result.push(itemDesc);
          }
        }
      }
      continue;
    }

    // Key-value pairs
    if (line.trim().startsWith('**') && line.includes('**:')) {
      const match = line.match(/\*\*([^*]+)\*\*\s*[:：]\s*(.+)/);
      if (match) {
        const key = match[1];
        const value = match[2].trim();

        // Skip keys that don't match current locale
        if (key.includes('(EN)') && locale !== 'en') continue;
        if (key.includes('(ZH)') && locale !== 'zh') continue;

        const cleanKey = key.replace(/\s*\(EN\)|\(ZH\)/g, '').trim();
        result.push(`**${cleanKey}**: ${value}`);
      }
      continue;
    }

    // Lines with **English** and **Chinese** markers
    if (line.includes('**English**') || line.includes('**Chinese**') || line.includes('**中文**')) {
      if (locale === 'en') {
        const enMatch = line.match(/\*\*English\*\*[:：]\s*(.+)/);
        if (enMatch && enMatch[1].trim()) {
          result.push(enMatch[1].trim());
        }
      } else {
        const zhMatch = line.match(/\*\*(?:Chinese|中文)\*\*[:：]\s*(.+)/);
        if (zhMatch && zhMatch[1].trim()) {
          result.push(zhMatch[1].trim());
        }
      }
      continue;
    }

    // Partner List section
    if (line.includes('**Partner List**')) {
      result.push(locale === 'en' ? 'We welcome more enterprises, universities, and organizations to join us. Please contact us for cooperation.' : '我们欢迎更多企业、高校和组织加入。欢迎联系我们进行合作。');
      continue;
    }

    // Dividers
    if (line.trim() === '---') {
      result.push('---');
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      result.push('');
    }
  }

  return result.filter((line, index, arr) => {
    if (line === '' && arr[index - 1] === '') return false;
    return true;
  }).join('\n');
}

/**
 * Parse simple page content (Arena page, etc.)
 */
function parseSimplePage(content: string, locale: 'en' | 'zh'): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let currentLangSection: 'en' | 'zh' | 'both' = 'both';
  let skipNextLine = false;
  let titleProcessed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : '';

    // Handle double title at the beginning (e.g., "# 中文标题" then "# English Title")
    if (!titleProcessed && line.match(/^#\s+/)) {
      // Check if the next line is also a title
      if (i + 1 < lines.length && lines[i + 1].match(/^#\s+/)) {
        // Two consecutive title lines - pick the appropriate one
        if (locale === 'en') {
          // Check which line has more English content
          const currentIsEn = isEnglish(line) || !isChinese(line);
          const nextIsEn = isEnglish(lines[i + 1]) || !isChinese(lines[i + 1]);
          if (nextIsEn) {
            result.push(lines[i + 1]);
            i++; // Skip the next line
          } else if (currentIsEn) {
            result.push(line);
          }
        } else {
          // For Chinese, pick the line with Chinese content
          const currentHasZh = isChinese(line);
          const nextHasZh = isChinese(lines[i + 1]);
          if (nextHasZh) {
            result.push(lines[i + 1]);
            i++; // Skip the next line
          } else if (currentHasZh) {
            result.push(line);
          }
        }
        titleProcessed = true;
        continue;
      } else {
        // Single title line, process it normally below
      }
    }

    // Skip team notes
    if (line.includes('## Team') || line.includes('## Notes') || line.includes('## Notes for Content Team')) {
      break;
    }

    // Check for language section markers (support both ### and #### levels)
    if (line.trim() === '#### English' || line.trim() === '### English Content') {
      currentLangSection = 'en';
      continue;
    }
    if (line.trim() === '#### 中文' || line.trim() === '### Chinese Content') {
      currentLangSection = 'zh';
      continue;
    }

    // Handle section headers (## level) - reset language section and extract language-specific title
    if (line.match(/^##\s+/)) {
      currentLangSection = 'both';
      // Extract language-specific title from bilingual headers
      const headerMatch = line.match(/^##\s+(.+)/);
      if (headerMatch) {
        const text = headerMatch[1];
        if (locale === 'en') {
          // Extract English part from bilingual headers like "## 1. 业务亮点 Business Highlights"
          const englishPart = text.match(/([a-zA-Z0-9\s\.\-]+)$/);
          if (englishPart) {
            // Also check if there's a number prefix
            const numberPrefix = text.match(/^(\d+\.\s+)/);
            if (numberPrefix) {
              result.push(`## ${numberPrefix[1]}${englishPart[1].trim()}`);
            } else {
              result.push(`## ${englishPart[1].trim()}`);
            }
          } else {
            result.push(line);
          }
        } else {
          // Extract Chinese part from bilingual headers
          const chinesePart = text.match(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+/g);
          if (chinesePart && chinesePart.length > 0) {
            // Also check if there's a number prefix
            const numberPrefix = text.match(/^(\d+\.\s+)/);
            if (numberPrefix) {
              result.push(`## ${numberPrefix[1]}${chinesePart.join('')}`);
            } else {
              result.push(`## ${chinesePart.join('')}`);
            }
          } else {
            result.push(line);
          }
        }
      }
      continue;
    }

    // Skip empty lines
    if (line.trim() === '') {
      result.push('');
      continue;
    }

    // Handle sub-subsection headers (#### level)
    if (line.match(/^####\s+/)) {
      const headerMatch = line.match(/^(####\s+)(.+)/);
      if (headerMatch) {
        const level = headerMatch[1];
        const text = headerMatch[2];

        // Skip language markers like "#### English" and "#### 中文"
        if (text === 'English' || text === '中文' || text === 'English Content' || text === 'Chinese Content') {
          continue;
        }

        // Extract language-appropriate header text
        if (locale === 'en') {
          // For English: extract English part from bilingual headers
          const englishPart = text.match(/([a-zA-Z0-9\s\.\-]+)$/);
          if (englishPart) {
            // Check if there's a number prefix
            const numberPrefix = text.match(/^(\d+\.\d+\.\d+\s+)/);
            if (numberPrefix) {
              result.push(`${level}${numberPrefix[1]}${englishPart[1].trim()}`);
            } else {
              result.push(`${level}${englishPart[1].trim()}`);
            }
          } else if (!isChinese(text)) {
            result.push(line);
          }
        } else {
          // For Chinese: extract Chinese part from bilingual headers
          const chinesePart = text.match(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+/g);
          if (chinesePart && chinesePart.length > 0) {
            // Check if there's a number prefix
            const numberPrefix = text.match(/^(\d+\.\d+\.\d+\s+)/);
            if (numberPrefix) {
              result.push(`${level}${numberPrefix[1]}${chinesePart.join('')}`);
            } else {
              result.push(`${level}${chinesePart.join('')}`);
            }
          } else if (isEnglish(text) && !text.includes(':')) {
            // Pure English header, include it
            result.push(line);
          }
        }
      }
      continue;
    }

    // Handle subsection headers (### level)
    if (line.match(/^###\s+/)) {
      const headerMatch = line.match(/^(###\s+)(.+)/);
      if (headerMatch) {
        const level = headerMatch[1];
        const text = headerMatch[2];

        // Skip content markers like "### English Content" and "### Chinese Content"
        if (text === 'English Content' || text === 'Chinese Content') {
          continue;
        }

        // Check if next line has translation
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          // If next line is "#### English" or "#### 中文", use it to determine which header to keep
          if (nextLine.trim() === '#### English') {
            if (locale === 'en') {
              // Extract English part from header like "### 2.1 概况 Overview"
              const englishPart = text.match(/([a-zA-Z0-9\s\.\-]+)$/);
              if (englishPart) {
                result.push(`${level}${englishPart[1].trim()}`);
              } else {
                result.push(line);
              }
            }
            i++; // Skip the language marker line
            continue;
          }
          if (nextLine.trim() === '#### 中文') {
            if (locale === 'zh') {
              // Extract Chinese part from header like "### 2.1 概况 Overview"
              const chinesePart = text.match(/[\u4e00-\u9fa5]+/);
              if (chinesePart) {
                result.push(`${level}${chinesePart[0]}`);
              } else {
                result.push(line);
              }
            }
            i++; // Skip the language marker line
            continue;
          }
        }

        // Extract language-appropriate header text
        if (locale === 'en') {
          // For English: extract English part from bilingual headers
          const englishPart = text.match(/([a-zA-Z0-9\s\.\-]+)$/);
          if (englishPart) {
            result.push(`${level}${englishPart[1].trim()}`);
          } else if (!isChinese(text)) {
            result.push(line);
          }
        } else {
          // For Chinese: extract Chinese part from bilingual headers
          const chinesePart = text.match(/[\u4e00-\u9fa5]+/);
          if (chinesePart) {
            result.push(`${level}${chinesePart[0]}`);
          } else if (isEnglish(text) && !text.includes(':')) {
            // Pure English header, include it
            result.push(line);
          }
        }
      }
      continue;
    }

    // Handle inline language markers like "**English**: text" or "**Chinese**: text"
    if (line.match(/^\*\*English\*\*[:：]/)) {
      const content = line.replace(/^\*\*English\*\*[:：]\s*/, '');
      if (locale === 'en') {
        result.push(content);
      }
      continue;
    }
    if (line.match(/^\*\*Chinese\*\*[:：]/) || line.match(/^\*\*中文\*\*[:：]/)) {
      const content = line.replace(/^\*\*(Chinese|中文)\*\*[:：]\s*/, '');
      if (locale === 'zh') {
        result.push(content);
      }
      continue;
    }

    // Handle content based on current language section
    if (locale === 'en') {
      if (currentLangSection === 'zh') {
        // Skip Chinese-only sections
        continue;
      }
      // Include English content or content in 'both' sections
      if (currentLangSection === 'en' || currentLangSection === 'both') {
        // Check if line contains HTML tags - preserve them as-is
        if (line.includes('<div') || line.includes('<span') || line.includes('</div>') || line.includes('</span>')) {
          result.push(line);
          continue;
        }

        // Skip lines that are primarily Chinese (but not HTML lines)
        if (isChinese(line) && !/[a-zA-Z]/.test(line)) {
          continue;
        }

        // Handle bilingual field names like "**编号 Case Number**: value"
        if (line.match(/^\*\*/)) {
          // First try bilingual format: "**中文 English**: value" (first part MUST contain Chinese)
          const bilingualMatch = line.match(/^\*\*([\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef\s]+)\s+([a-zA-Z0-9\s\(\)\-]+)\*\*\s*[:：]\s*(.+)/);
          if (bilingualMatch) {
            const [, zhPart, enPart, value] = bilingualMatch;
            // Use the English field name
            result.push(`**${enPart.trim()}**: ${value}`);
            continue;
          }
          // If no bilingual format, check for pure English field name and keep it as is
          const englishFieldMatch = line.match(/^\*\*([a-zA-Z0-9\s\(\)\-]+)\*\*\s*[:：]\s*(.+)/);
          if (englishFieldMatch) {
            // Keep English field names as-is
            result.push(line);
            continue;
          }
          // If neither pattern matched, skip this line (it's likely Chinese-only)
          continue;
        }

        // Clean Chinese annotations from English content (but NOT from field names we just processed)
        let cleaned = line.replace(/（[^）]+）/g, '').trim();
        cleaned = cleaned.replace(/[\u4e00-\u9fa5]+/g, '').trim();
        cleaned = cleaned.replace(/\s+/g, ' ').trim(); // Clean up extra spaces
        if (cleaned) {
          result.push(cleaned);
        } else if (line.trim() === '') {
          result.push('');
        }
      }
    } else {
      // Chinese locale
      if (currentLangSection === 'en') {
        // Skip English-only sections
        continue;
      }
      // Include Chinese content or content in 'both' sections
      if (currentLangSection === 'zh' || currentLangSection === 'both') {
        // Check if line contains HTML tags - preserve them as-is
        if (line.includes('<div') || line.includes('<span') || line.includes('</div>') || line.includes('</span>')) {
          result.push(line);
          continue;
        }

        // Handle bilingual field names like "**编号 Case Number**: value"
        if (line.match(/^\*\*/)) {
          // First try bilingual format: "**中文 English**: value" (first part MUST contain Chinese)
          const bilingualMatch = line.match(/^\*\*([\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef\s]+)\s+([a-zA-Z0-9\s\(\)\-]+)\*\*\s*[:：]\s*(.+)/);
          if (bilingualMatch) {
            const [, zhPart, enPart, value] = bilingualMatch;
            // Use the Chinese field name
            result.push(`**${zhPart.trim()}**: ${value}`);
            continue;
          }
          // If no bilingual format, check for pure Chinese field name
          const chineseFieldMatch = line.match(/^\*\*([\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef\s\(\)\-]+)\*\*\s*[:：]\s*(.+)/);
          if (chineseFieldMatch) {
            // Keep Chinese field names as-is
            result.push(line);
            continue;
          }
          // If neither pattern matched, skip this line (it's likely English-only)
          continue;
        }

        // Extract Chinese from mixed content
        if (line.includes('（中文：')) {
          const match = line.match(/（中文：([^）]+)）/);
          if (match) {
            result.push(match[1]);
          }
        } else if (isChinese(line)) {
          result.push(line);
        } else if (line.trim() === '') {
          result.push('');
        }
      }
    }
  }

  return result.filter((line, index, arr) => {
    if (line === '' && arr[index - 1] === '') return false;
    return true;
  }).join('\n');
}

/**
 * Parse overview/raw files with separate English and Chinese sections
 * Format: #### English [all English content] #### 中文 [all Chinese content]
 */
function parseSeparatedLanguageContent(content: string, locale: 'en' | 'zh'): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let currentLangSection: 'en' | 'zh' | null = null;

  for (const line of lines) {
    // Check for language section markers
    if (line.trim() === '#### English') {
      currentLangSection = 'en';
      continue;
    }
    if (line.trim() === '#### 中文') {
      currentLangSection = 'zh';
      continue;
    }

    // Only include content from the matching language section
    if (currentLangSection === locale) {
      // Skip the separator lines (---)
      if (line.trim() === '---') {
        result.push('');
        continue;
      }
      // Include all other lines from the target language section
      result.push(line);
    }
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n');
}

/**
 * Process a single raw file and generate .en.md and .zh.md
 */
function processRawFile(rawFilePath: string, contentDir: string) {
  const fileName = path.basename(rawFilePath, '.raw.md');
  const dirName = path.dirname(rawFilePath).replace(contentDir + path.sep, '');

  // Skip Arena page.raw.md - it's handled by sync-arena-list.ts
  if (dirName === 'Arena' && fileName === 'page') {
    console.log(`Processing: ${rawFilePath}`);
    console.log(`  Skipped: Arena page.raw.md is handled by sync-arena-list.ts`);
    console.log('');
    return;
  }

  console.log(`Processing: ${rawFilePath}`);

  const rawContent = fs.readFileSync(rawFilePath, 'utf-8');

  let enContent: string;
  let zhContent: string;

  if (fileName === 'homepage') {
    const parsed = parseHomepageContent(rawContent);
    enContent = `# Homepage Content\n\n${parsed.en}`;
    zhContent = `# 首页内容\n\n${parsed.zh}`;
  } else if (dirName === 'About' && fileName === 'page') {
    enContent = parseAboutPage(rawContent, 'en');
    zhContent = parseAboutPage(rawContent, 'zh');
  } else if (dirName === 'FAQ' && fileName === 'page') {
    enContent = parseFAQPage(rawContent, 'en');
    zhContent = parseFAQPage(rawContent, 'zh');
  } else if (dirName === 'Framework' && fileName === 'page') {
    enContent = parseFrameworkPage(rawContent, 'en');
    zhContent = parseFrameworkPage(rawContent, 'zh');
  } else if (fileName === 'overview') {
    // Use separated language parser for overview
    enContent = parseSeparatedLanguageContent(rawContent, 'en');
    zhContent = parseSeparatedLanguageContent(rawContent, 'zh');
  } else if (fileName === 'tech-configuration') {
    // Use separated language parser for tech-configuration
    enContent = parseSeparatedLanguageContent(rawContent, 'en');
    zhContent = parseSeparatedLanguageContent(rawContent, 'zh');
  } else if (['page', 'implementation', 'requirements', 'validation-report', 'project-report'].includes(fileName)) {
    enContent = parseSimplePage(rawContent, 'en');
    zhContent = parseSimplePage(rawContent, 'zh');
  } else {
    console.log(`  Warning: No specific parser for ${fileName}, copying raw content`);
    enContent = rawContent;
    zhContent = rawContent;
  }

  // Write .en.md
  const enPath = path.join(contentDir, dirName, `${fileName}.en.md`);
  fs.writeFileSync(enPath, enContent, 'utf-8');
  console.log(`  Generated: ${enPath}`);

  // Write .zh.md
  const zhPath = path.join(contentDir, dirName, `${fileName}.zh.md`);
  fs.writeFileSync(zhPath, zhContent, 'utf-8');
  console.log(`  Generated: ${zhPath}`);
  console.log('');
}

/**
 * Find and process all raw files
 */
function syncAllContent() {
  const contentDir = path.join(process.cwd(), 'Content');

  function findRawFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findRawFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.raw.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const rawFiles = findRawFiles(contentDir);
  console.log(`Found ${rawFiles.length} raw files\n`);

  for (const rawFile of rawFiles) {
    processRawFile(rawFile, contentDir);
    console.log('');
  }

  console.log('Content sync complete!');
}

// Run the sync
syncAllContent();

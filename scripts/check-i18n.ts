/**
 * i18n Code Validation Script
 *
 * This script checks for hardcoded Chinese/English text that should be internationalized.
 * Run with: npm run check-i18n
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

interface Issue {
  file: string;
  line: number;
  type: 'hardcoded-chinese' | 'hardcoded-english' | 'missing-conditional';
  text: string;
  context: string;
}

const issues: Issue[] = [];

// Patterns to check
const patterns = {
  // Chinese characters in JSX: >中文<
  hardcodedChinese: />([^<]*[\u4e00-\u9fa5]+[^<]*)</,

  // English text in JSX (user-facing): >English Text<
  hardcodedEnglish: />([A-Z][A-Za-z\s]{10,})</,

  // Conditional check for locale
  hasConditional: /locale\s*===\s*['"`]zh['"`]|isChina\s*\?/,
};

/**
 * Recursively find all TSX files in a directory
 */
function findTsxFiles(dir: string, baseDir: string = ''): string[] {
  const files: string[] = [];

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && item !== 'node_modules' && item !== '.next') {
        files.push(...findTsxFiles(fullPath, join(baseDir, item)));
      } else if (stat.isFile() && item.endsWith('.tsx')) {
        files.push(join(baseDir, item));
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }

  return files;
}

/**
 * Check a single file for i18n issues
 */
function checkFile(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
        return;
      }

      // Skip if already has conditional (check current line)
      if (patterns.hasConditional.test(line)) {
        return;
      }

      // Also skip if the Chinese/English text is part of a ternary expression
      // This catches: {isZh ? '中文' : 'English'} or {locale === 'zh' ? '中文' : 'English'}
      if (line.includes('?') && line.includes(':')) {
        return;
      }

      // Check for hardcoded Chinese in JSX
      const chineseMatch = line.match(patterns.hardcodedChinese);
      if (chineseMatch) {
        // Skip aria-labels and data-testid
        if (!line.includes('aria-') && !line.includes('data-testid')) {
          issues.push({
            file: filePath,
            line: lineNum,
            type: 'hardcoded-chinese',
            text: chineseMatch[1],
            context: line.trim(),
          });
        }
      }

      // Check for hardcoded Chinese in object properties (title: '中文')
      const chinesePropMatch = line.match(/(?:title|description|text|label|name):\s*['"`][^'"`]*[\u4e00-\u9fa5]+[^'"`]*['"`]/);
      if (chinesePropMatch) {
        // Skip if line has conditional
        if (!line.includes('isChina') && !line.includes('locale')) {
          issues.push({
            file: filePath,
            line: lineNum,
            type: 'hardcoded-chinese',
            text: chinesePropMatch[0],
            context: line.trim(),
          });
        }
      }

      // Check for hardcoded English (user-facing text)
      const englishMatch = line.match(patterns.hardcodedEnglish);
      if (englishMatch) {
        // Skip aria-labels, data-testid, and technical terms
        if (!line.includes('aria-') &&
            !line.includes('data-testid') &&
            !line.includes('className=') &&
            !line.includes('href=')) {
          issues.push({
            file: filePath,
            line: lineNum,
            type: 'hardcoded-english',
            text: englishMatch[1],
            context: line.trim(),
          });
        }
      }
    });
  } catch (error) {
    console.error(`${colors.red}Error reading ${filePath}: ${error}${colors.reset}`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.blue}🔍 Checking for i18n issues in TypeScript/TSX files...${colors.reset}`);
  console.log('');

  // Find all TSX files
  const appFiles = findTsxFiles('app', 'app');
  const componentFiles = findTsxFiles('components', 'components');
  const allFiles = [...appFiles, ...componentFiles];

  console.log(`${colors.blue}Found ${allFiles.length} TSX files to check${colors.reset}`);
  console.log('');

  // Check each file
  allFiles.forEach(checkFile);

  // Group issues by type
  const chineseIssues = issues.filter(i => i.type === 'hardcoded-chinese');
  const englishIssues = issues.filter(i => i.type === 'hardcoded-english');

  // Print results
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log('');

  if (chineseIssues.length === 0) {
    console.log(`${colors.green}✓ No hardcoded Chinese text found in JSX${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Found ${chineseIssues.length} hardcoded Chinese text(s):${colors.reset}`);
    console.log('');
    chineseIssues.forEach(issue => {
      console.log(`${colors.yellow}${issue.file}:${issue.line}${colors.reset}`);
      console.log(`  Text: "${issue.text}"`);
      console.log(`  Context: ${issue.context.substring(0, 80)}...`);
      console.log('');
    });
  }

  if (englishIssues.length === 0) {
    console.log(`${colors.green}✓ No hardcoded English text found in JSX${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ Found ${englishIssues.length} potential hardcoded English (review manually):${colors.reset}`);
    console.log('');
    englishIssues.forEach(issue => {
      console.log(`${colors.yellow}${issue.file}:${issue.line}${colors.reset}`);
      console.log(`  Text: "${issue.text}"`);
      console.log(`  Context: ${issue.context.substring(0, 80)}...`);
      console.log('');
    });
    console.log(`  Note: Some results may be legitimate (aria-labels, test IDs)`);
    console.log('');
  }

  // Final summary
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log('');

  if (issues.length === 0) {
    console.log(`${colors.green}✓ All i18n checks passed!${colors.reset}`);
    console.log('');
    console.log('Your code follows proper internationalization practices.');
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Found ${issues.length} potential i18n issue(s)${colors.reset}`);
    console.log('');
    console.log('Please review the results above and fix any hardcoded text.');
    console.log('Remember to use:');
    console.log(`  {locale === 'zh' ? '中文' : 'English'}`);
    console.log(`  or`);
    console.log(`  {isChina ? '中文' : 'English'}`);
    console.log('');
    process.exit(1);
  }
}

main();

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getContentFile } from '@/lib/content';
import { notFound } from 'next/navigation';


interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

/**
 * Parse FAQ markdown content into structured data
 */
function parseFAQContent(markdown: string): FAQCategory[] {
  const lines = markdown.split('\n');
  const categories: FAQCategory[] = [];
  let currentCategory: FAQCategory | null = null;
  let currentQuestion: string | null = null;
  let currentAnswer: string[] = [];
  let inContactSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect contact section
    if (line.includes('### Still Have Questions?') || line.includes('### 仍有疑问？')) {
      inContactSection = true;
      break; // Stop parsing, contact section is handled separately in UI
    }

    // Skip title and empty lines at start
    if (line.startsWith('# FAQ') || line.trim() === '') {
      continue;
    }

    // Category headers (###)
    if (line.match(/^###\s+/)) {
      // Save previous question if any
      if (currentQuestion && currentAnswer.length > 0) {
        if (currentCategory) {
          currentCategory.items.push({ q: currentQuestion, a: currentAnswer.join(' ') });
        }
        currentQuestion = null;
        currentAnswer = [];
      }

      // Save previous category if any
      if (currentCategory && currentCategory.items.length > 0) {
        categories.push(currentCategory);
      }

      const categoryTitle = line.replace(/^###\s+/, '').trim();
      currentCategory = { category: categoryTitle, items: [] };
      continue;
    }

    // Question headers (####)
    if (line.match(/^####\s+/)) {
      // Save previous question if any
      if (currentQuestion && currentAnswer.length > 0) {
        if (currentCategory) {
          currentCategory.items.push({ q: currentQuestion, a: currentAnswer.join(' ') });
        }
      }

      currentQuestion = line.replace(/^####\s+/, '').trim();
      currentAnswer = [];
      continue;
    }

    // Answer content (non-empty lines after a question)
    if (currentQuestion && line.trim() !== '') {
      currentAnswer.push(line.trim());
    }

    // Empty line - finalize answer
    if (line.trim() === '' && currentQuestion && currentAnswer.length > 0) {
      if (currentCategory) {
        currentCategory.items.push({ q: currentQuestion, a: currentAnswer.join(' ') });
      }
      currentQuestion = null;
      currentAnswer = [];
    }
  }

  // Don't forget the last answer
  if (currentQuestion && currentAnswer.length > 0 && currentCategory) {
    currentCategory.items.push({ q: currentQuestion, a: currentAnswer.join(' ') });
  }

  // Add the last category
  if (currentCategory && currentCategory.items.length > 0) {
    categories.push(currentCategory);
  }

  return categories;
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isChina = locale === 'zh';

  // Load FAQ content from file
  const contentFile = await getContentFile('FAQ', 'page', locale);

  if (!contentFile) {
    notFound();
  }

  const faqs = parseFAQContent(contentFile.content);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-20 sm:py-28">
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <Badge variant="in-arena" className="mb-6 bg-white border-gray-200">
            <HelpCircle className="mr-2 h-4 w-4" />
            {isChina ? '常见问题' : 'FAQ'}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            {isChina ? '常见问题' : 'Frequently Asked Questions'}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isChina
              ? '查找关于RWAI Arena的常见问题答案'
              : 'Find answers to common questions about RWAI Arena'}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {faqs.map((category, catIdx) => (
            <div key={catIdx} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.items.map((faq, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 shadow-sm transition-all hover:shadow-md data-[state=open]:border-blue-600 data-[state=open]:bg-blue-50/30"
                  >
                    <AccordionItem
                      value={`item-${catIdx}-${idx}`}
                      className="border-none"
                    >
                      <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-5 text-lg">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 pb-5 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white p-10 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 mx-auto mb-4">
            <HelpCircle className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {isChina ? '仍有问题？' : 'Still have questions?'}
          </h3>
          <p className="text-gray-700 mb-8 max-w-md mx-auto">
            {isChina
              ? '如果您没有找到想要的答案，请随时联系我们。'
              : 'If you couldn\'t find the answer you\'re looking for, feel free to reach out to us.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`https://github.com/THU-ZJAI/Real-World-AI`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 text-base font-medium transition-all duration-fast border-2 border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50 hover:border-gray-300 rounded-button"
            >
              GitHub
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 text-base font-medium transition-all duration-fast bg-blue-600 hover:bg-blue-700 text-white rounded-button"
            >
              {isChina ? '联系我们' : 'Contact Us'}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

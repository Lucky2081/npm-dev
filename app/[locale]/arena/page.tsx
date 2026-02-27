import { getContentFile } from '@/lib/content';
import { getAllArenasFromStaticData } from '@/lib/static-data';
import ArenaClient from './arena-client';
import { Suspense } from 'react';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

interface ArenaPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ArenaPage({ params }: ArenaPageProps) {
  const { locale } = await params;

  // Read page content with frontmatter
  const contentFile = await getContentFile('Arena', 'page', locale);

  // Get pageTitle and pageSubtitle from frontmatter, or use defaults
  const pageTitle = contentFile?.frontmatter?.pageTitle ||
    (locale === 'zh' ? '真实AI竞技场' : 'Real AI Arena');
  const pageSubtitle = contentFile?.frontmatter?.pageSubtitle ||
    (locale === 'zh' ? '为你的业务任务，定义唯一最优实践' : 'Define the Best Practice for Your Business Tasks');
  const arenas = await getAllArenasFromStaticData();

  return (
    <Suspense fallback={null}>
      <ArenaClient params={params} pageTitle={pageTitle} pageSubtitle={pageSubtitle} arenas={arenas} />
    </Suspense>
  );
}

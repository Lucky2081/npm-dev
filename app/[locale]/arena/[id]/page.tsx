import { notFound } from 'next/navigation';
import { ArenaDetailClient } from './client-page';
import { getAllArenasFromStaticData } from '@/lib/static-data';
import { getArenaContent } from '@/lib/content';

export const dynamicParams = false;

export async function generateStaticParams() {
  const arenas = await getAllArenasFromStaticData();
  return arenas.map((arena) => ({ id: arena.folderId }));
}

export default async function ArenaDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const arenas = await getAllArenasFromStaticData();
  const arena = arenas.find((item) => item.folderId === id || item.id === id);

  if (!arena) {
    notFound();
  }

  // Load content from exported static JSON, fallback to markdown files.
  const tabs = ['overview', 'implementation', 'tech-configuration', 'requirements', 'validation-report', 'project-report'] as const;
  const content: Record<string, string> = {};
  for (const tab of tabs) {
    const contentFile = await getArenaContent(arena.folderId, tab, locale);
    if (contentFile?.content) {
      content[tab] = contentFile.content;
    }
  }
  const hasContent = Object.keys(content).length > 0;

  return (
    <ArenaDetailClient
      arena={arena}
      locale={locale}
      arenaId={id}
      initialContent={content}
      hasContent={hasContent}
    />
  );
}

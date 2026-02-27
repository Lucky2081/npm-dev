import Link from 'next/link';

export default function RootPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">RWAI Arena</h1>
        <p className="text-gray-600 mb-8">Choose your language / 请选择语言</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/en" className="px-5 py-2 rounded-md bg-black text-white">
            English
          </Link>
          <Link href="/zh" className="px-5 py-2 rounded-md border border-gray-300">
            中文
          </Link>
        </div>
      </div>
    </main>
  );
}

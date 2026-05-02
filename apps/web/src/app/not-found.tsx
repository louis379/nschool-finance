import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-primary-500">404</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-800">找不到頁面</h1>
        <p className="mt-2 text-sm text-gray-500">這個連結可能已經失效或被移除</p>
        <Link
          href="/"
          className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          回首頁
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="px-6 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
          Wandr
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}

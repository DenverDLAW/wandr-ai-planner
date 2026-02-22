import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
          Wandr
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/plan"
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            Plan New Trip
          </Link>
          {user && (
            <span className="text-sm text-gray-400 hidden md:block">{user.email}</span>
          )}
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

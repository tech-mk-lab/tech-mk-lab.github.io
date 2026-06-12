import type { ReactNode } from 'react'
import Header from './Header'
import BottomNav from './BottomNav'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-svh bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-[390px] mx-auto w-full px-4 pt-4 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

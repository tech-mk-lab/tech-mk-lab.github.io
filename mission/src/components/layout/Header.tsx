import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/teams', label: '팀' },
  { path: '/missions', label: '미션' },
  { path: '/ranking', label: '순위' },
  { path: '/plan', label: '일정' },
]

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-[390px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-base tracking-tight flex items-center gap-1.5">
          <span className="text-lg">🎯</span>
          워크숍 미션
        </Link>
        <nav className="hidden sm:flex gap-1">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-colors ${
                pathname === path ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

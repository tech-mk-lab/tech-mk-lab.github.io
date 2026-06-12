import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '홈', icon: '🏠' },
  { path: '/teams', label: '팀', icon: '👥' },
  { path: '/missions', label: '미션', icon: '🎯' },
  { path: '/ranking', label: '순위', icon: '🏆' },
  { path: '/plan', label: '일정', icon: '📅️' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="max-w-[390px] mx-auto flex">
        {navItems.map(({ path, label, icon }) => {
          const active = pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
                active ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <span className={`text-xl leading-none transition-transform ${active ? 'scale-110' : ''}`}>
                {icon}
              </span>
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

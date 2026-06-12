import { Link } from 'react-router-dom'
import { useMission } from '../../hooks/useMission'
import { useTeams } from '../../hooks/useTeams'
import { useRanking } from '../../hooks/useRanking'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'

export default function HomePage() {
  const { mission: missions, loading: missionsLoading, error: missionsError, refetch: refetchMissions } = useMission()
  const { teams, loading: teamsLoading, error: teamsError, refetch: refetchTeams } = useTeams()
  const { ranking, loading: rankingLoading, error: rankingError, refetch: refetchRanking } = useRanking()

  const loading = missionsLoading || teamsLoading || rankingLoading
  const error = missionsError || teamsError || rankingError

  const completedCount = missions.filter((m) => m.completedBy.length > 0).length
  const totalMissions = missions.length
  const unlockedCount = missions.filter((m) => m.isUnlocked).length
  const totalPoints = missions.reduce((sum, m) => sum + m.points, 0)
  const topTeam = ranking[0]

  function handleRetry() {
    if (missionsError) refetchMissions()
    if (teamsError) refetchTeams()
    if (rankingError) refetchRanking()
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={handleRetry} />

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-5 shadow-lg">
        <p className="text-blue-200 text-xs font-medium mb-1">2026 상반기 워크숍</p>
        <h1 className="text-2xl font-bold mb-0.5">팀 미션 챌린지</h1>
        <p className="text-blue-100 text-sm">함께 미션을 완수하고 팀 최고점을 노려라!</p>
        <div className="mt-4 flex gap-2">
          <Link
            to="/missions"
            className="flex-1 bg-white text-blue-600 text-sm font-bold py-2 rounded-xl text-center active:scale-95 transition-transform"
          >
            미션 보기
          </Link>
          <Link
            to="/ranking"
            className="flex-1 bg-blue-500/50 text-white text-sm font-bold py-2 rounded-xl text-center active:scale-95 transition-transform"
          >
            순위 보기
          </Link>
        </div>
      </div>

      {/* 통계 카드 3개 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-blue-600">{teams.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">참여 팀</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">{unlockedCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">공개 미션</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-orange-500">{totalPoints}</p>
          <p className="text-xs text-gray-400 mt-0.5">총 획득 점수</p>
        </div>
      </div>

      {/* 미션 진행률 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">미션 진행률</span>
          <span className="text-sm font-bold text-blue-600">
            {completedCount} / {totalMissions}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all"
            style={{ width: `${(completedCount / totalMissions) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          전체 미션 중 {Math.round((completedCount / totalMissions) * 100)}% 완료됨
        </p>
      </div>

      {/* 1위 팀 */}
      {topTeam && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🥇</span>
            <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide">현재 1위</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-lg font-bold text-gray-800">{topTeam.teamName}</p>
              <p className="text-xs text-gray-500">완료 미션 {topTeam.completedMissions}개</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-yellow-600">{topTeam.score}</p>
              <p className="text-xs text-yellow-500 font-medium">점</p>
            </div>
          </div>
        </div>
      )}

      {/* 빠른 이동 */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { to: '/plan', icon: '📅', label: '일정', sub: '일정 확인' },
          { to: '/teams', icon: '👥', label: '팀 현황', sub: `${teams.length}개 팀 참여 중` },
          { to: '/missions', icon: '🎯', label: '미션 목록', sub: `${unlockedCount}개 공개됨` },
          { to: '/ranking', icon: '🏆', label: '실시간 순위', sub: '팀별 점수 확인' },
        ].map(({ to, icon, label, sub }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 active:scale-95 transition-all"
          >
            <div className="text-2xl mb-2">{icon}</div>
            <p className="font-semibold text-gray-800 text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

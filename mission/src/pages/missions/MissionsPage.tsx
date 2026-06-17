import { Link } from 'react-router-dom'
import { useTeams } from '../../hooks/useTeams'
import { useMission } from '../../hooks/useMission'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'

export default function MissionsPage() {
  const { mission: missions, loading: missionsLoading, error: missionsError, refetch: refetchMissions } = useMission()
  const { teams, loading: teamsLoading, error: teamsError, refetch: refetchTeams } = useTeams()

  const loading = missionsLoading || teamsLoading
  const error = missionsError || teamsError

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={() => { if (missionsError) refetchMissions(); if (teamsError) refetchTeams() }} />

  const unlockedCount = missions.filter((m) => m.isUnlocked).length
  const totalPoints = missions
    .filter((m) => m.isUnlocked)
    .reduce((sum, m) => sum + m.points, 0)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">미션 목록</h2>
        <p className="text-sm text-gray-400">{unlockedCount}개 공개 · 최대 {totalPoints}점 획득 가능</p>
        <p className="text-sm text-gray-400">※ 1등 상품: 반차 (연차 0.5일)</p>
      </div>

      <div className="space-y-3">
        {missions.map((mission, index) => {
          const isLocked = !mission.isUnlocked
          const completedTeams = teams.filter((t) => mission.completedBy.includes(t.id))
          const numericId = mission.id.replace('m', '')

          const inner = (
            <div className="flex gap-3">
              {/* 미션 번호 / 잠금 아이콘 */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                  isLocked ? 'bg-gray-100' : 'bg-blue-50'
                }`}
              >
                {isLocked ? (
                  '🔒'
                ) : (
                  <span className="text-blue-600 font-black text-sm">M{index + 1}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className={`font-bold text-sm ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                    {mission.title}
                  </p>
                  <Badge variant={isLocked ? 'gray' : 'blue'}>+{mission.points}점</Badge>
                </div>

                {!isLocked && (
                  <div className="flex items-center justify-between">
                    {completedTeams.length === 0 ? (
                      <span className="text-xs text-gray-300">아직 완료한 팀 없음</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {completedTeams.map((team) => (
                          <span
                            key={team.id}
                            className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: team.color }}
                          >
                            ✓ {team.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="text-xs text-blue-400 font-medium flex-shrink-0 ml-2">
                      상세 →
                    </span>
                  </div>
                )}
              </div>
            </div>
          )

          if (isLocked) {
            return (
              <div
                key={mission.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 opacity-50"
              >
                {inner}
              </div>
            )
          }

          return (
            <Link
              key={mission.id}
              to={`/missions/${numericId}`}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 active:scale-95 transition-all"
            >
              {inner}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

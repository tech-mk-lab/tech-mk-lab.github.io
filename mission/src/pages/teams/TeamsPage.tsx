import { useTeams } from '../../hooks/useTeams'
import { useRanking } from '../../hooks/useRanking'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'

export default function TeamsPage() {
  const { teams, loading, error, refetch } = useTeams()
  const { ranking } = useRanking()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />

  const maxScore = Math.max(...teams.map((t) => t.score), 1)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">참여 팀</h2>
        <p className="text-sm text-gray-400">{teams.length}개 팀이 경쟁 중</p>
      </div>

      <div className="space-y-3">
        {teams.map((team) => {
          const rankEntry = ranking.find((r) => r.teamId === team.id)
          const completed = rankEntry?.completedMissions ?? 0
          const scorePercent = Math.round((team.score / maxScore) * 100)

          return (
            <div
              key={team.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 overflow-hidden relative"
            >
              {/* 왼쪽 컬러 바 */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ backgroundColor: team.color }}
              />

              <div className="pl-3">
                {/* 헤더 행 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.name.at(-1)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{team.name}</p>
                      <p className="text-xs text-gray-400">
                        {rankEntry ? `${rankEntry.rank}위` : ''} · 미션 {completed}개 완료
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black" style={{ color: team.color }}>
                      {team.score}
                    </p>
                    <p className="text-xs text-gray-400">점</p>
                  </div>
                </div>

                {/* 점수 바 */}
                <div className="mb-3">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${scorePercent}%`, backgroundColor: team.color }}
                    />
                  </div>
                </div>

                {/* 멤버 */}
                <div className="flex flex-wrap gap-1.5">
                  {team.members.map((member) => (
                    <span
                      key={member}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: `${team.color}18`,
                        color: team.color,
                      }}
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

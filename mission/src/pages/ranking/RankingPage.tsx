import { useEffect } from 'react'
import { useTeams } from '../../hooks/useTeams'
import { useRanking } from '../../hooks/useRanking'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'

const REFRESH_INTERVAL = 30_000

const medals = ['🥇', '🥈', '🥉']
const rankBg = [
  'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200',
  'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200',
  'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200',
]
const podiumHeights: Record<number, string> = { 1: 'h-28', 2: 'h-20', 3: 'h-16' }

function formatTime(date: Date) {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function RankingPage() {
  const { teams } = useTeams()
  const { ranking: rawRanking, loading, error, lastUpdated, refetch } = useRanking()

  useEffect(() => {
    const id = setInterval(refetch, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [refetch])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />

  const sorted = [...rawRanking].sort((a, b) => b.score - a.score)
  const maxScore = Math.max(...sorted.map((r) => r.score), 1)

  // 동점 처리: 같은 점수 → 같은 순위 (표준 경쟁 순위: 1,1,3...)
  const ranking = sorted.map((entry, _, arr) => {
    const rank = arr.findIndex((e) => e.score === entry.score) + 1
    const tied = arr.filter((e) => e.score === entry.score).length > 1
    return { ...entry, rank, tied }
  })

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">팀 순위</h2>
          <p className="text-sm text-gray-400">실시간 누적 점수 기준</p>
        </div>
        <button
          type="button"
          onClick={refetch}
          className="flex items-center gap-1.5 text-xs text-blue-500 font-medium bg-blue-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
        >
          <span>↻</span>
          <span>새로고침</span>
        </button>
      </div>

      {/* 마지막 갱신 시각 */}
      {lastUpdated && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>마지막 갱신: {formatTime(lastUpdated)} · 30초마다 자동 갱신</span>
        </div>
      )}

      {/* 포디움 (1~3위) */}
      {ranking.length >= 2 && (
        <div className="grid grid-cols-3 gap-2 items-end pb-2">
          {[ranking[1], ranking[0], ranking[2]].map((entry, i) => {
            if (!entry) return <div key={i} />
            const team = teams.find((t) => t.id === entry.teamId)
            const height = podiumHeights[entry.rank] ?? 'h-16'

            return (
              <div key={entry.teamId} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{medals[entry.rank - 1]}</span>
                <p className="text-xs font-bold text-gray-700 text-center leading-tight">
                  {entry.teamName}
                </p>
                <p className="text-sm font-black" style={{ color: team?.color }}>
                  {entry.score}점
                </p>
                <div
                  className={`w-full rounded-t-lg ${height} flex items-end justify-center pb-2`}
                  style={{ backgroundColor: `${team?.color}30`, border: `2px solid ${team?.color}50` }}
                >
                  <span className="text-xs font-bold text-gray-500">
                    {entry.tied ? `공동 ${entry.rank}위` : `${entry.rank}위`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 전체 순위 리스트 */}
      <div className="space-y-2">
        {ranking.map((entry) => {
          const team = teams.find((t) => t.id === entry.teamId)
          const isTop3 = entry.rank <= 3
          const scorePercent = Math.round((entry.score / maxScore) * 100)

          return (
            <div
              key={entry.teamId}
              className={`rounded-2xl p-4 shadow-sm border ${
                isTop3 ? rankBg[entry.rank - 1] : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {/* 순위 */}
                <div className="w-8 text-center flex-shrink-0">
                  {isTop3 ? (
                    <span className="text-xl">{medals[entry.rank - 1]}</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-400">{entry.rank}위</span>
                  )}
                </div>

                {/* 팀 색상 아이콘 */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                  style={{ backgroundColor: team?.color }}
                >
                  {team?.name.at(-1)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{entry.teamName}</p>
                  <p className="text-xs text-gray-400">미션 {entry.completedMissions}개 완료</p>
                </div>

                <div className="text-right flex-shrink-0">
                  {entry.tied && (
                    <p className="text-xs font-medium text-orange-500">공동 {entry.rank}위</p>
                  )}
                  <p className="text-lg font-black" style={{ color: team?.color }}>
                    {entry.score}
                  </p>
                  <p className="text-xs text-gray-400">점</p>
                </div>
              </div>

              {/* 점수 바 */}
              <div className="ml-11 bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${scorePercent}%`, backgroundColor: team?.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

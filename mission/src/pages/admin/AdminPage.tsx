import { useState } from 'react'
import { mockMissions } from '../../data/mockData'
import { useTeams } from '../../hooks/useTeams'
import type { Mission } from '../../types'
import client from '../../api/client'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'

type Feedback = { type: 'success' | 'error'; message: string }

export default function AdminPage() {
  const { teams, loading, error, refetch } = useTeams()
  const [missions, setMissions] = useState<Mission[]>(mockMissions)
  const [activeTab, setActiveTab] = useState<'score' | 'mission'>('score')

  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [scoreInput, setScoreInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  function showFeedback(fb: Feedback) {
    setFeedback(fb)
    setTimeout(() => setFeedback(null), 3000)
  }

  async function handleSubmitScore() {
    const score = parseInt(scoreInput, 10)
    if (!selectedTeamId || isNaN(score) || score === 0) return

    const team = teams.find((t) => t.id === selectedTeamId)
    if (!team) return

    setSubmitting(true)
    try {
      await client.post(
        '',
        JSON.stringify({ teamName: team.name, score }),
        {
          params: { action: 'score' },
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
        }
      )
      showFeedback({ type: 'success', message: `${team.name}에 ${score > 0 ? '+' : ''}${score}점 적용됐습니다.` })
      setScoreInput('')
      refetch()
    } catch {
      showFeedback({ type: 'error', message: '저장에 실패했습니다. 다시 시도해주세요.' })
    } finally {
      setSubmitting(false)
    }
  }

  function handleToggleMission(missionId: string) {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, isUnlocked: !m.isUnlocked } : m)),
    )
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />

  const selectedTeam = teams.find((t) => t.id === selectedTeamId)
  const canSubmit = !!selectedTeamId && scoreInput !== '' && !isNaN(parseInt(scoreInput, 10)) && parseInt(scoreInput, 10) !== 0

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">관리자</h2>
        <p className="text-sm text-gray-400">점수 및 미션 관리</p>
      </div>

      {/* 피드백 메시지 */}
      {feedback && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${feedback.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
            }`}
        >
          {feedback.type === 'success' ? '✓ ' : '✗ '}
          {feedback.message}
        </div>
      )}

      {/* 탭 */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(['score', 'mission'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
              }`}
          >
            {tab === 'score' ? '점수 관리' : '미션 관리'}
          </button>
        ))}
      </div>

      {activeTab === 'score' && (
        <div className="space-y-3">
          {/* 점수 입력 폼 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            {/* 팀 선택 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">팀 선택</label>
              <div className="grid grid-cols-2 gap-2">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${selectedTeamId === team.id
                        ? 'border-transparent text-white'
                        : 'border-gray-200 text-gray-700 bg-white'
                      }`}
                    style={selectedTeamId === team.id ? { backgroundColor: team.color } : {}}
                  >
                    <span
                      className="w-4 h-4 rounded-md flex-shrink-0"
                      style={{ backgroundColor: selectedTeamId === team.id ? 'rgba(255,255,255,0.4)' : team.color }}
                    />
                    {team.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 점수 입력 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">점수 입력</label>
              <input
                type="number"
                placeholder="점수를 입력하세요 (음수 가능)"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleSubmitScore()}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              />
            </div>

            {/* 저장 버튼 */}
            <button
              type="button"
              onClick={handleSubmitScore}
              disabled={!canSubmit || submitting}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${canSubmit && !submitting
                  ? 'bg-blue-600 text-white active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {submitting ? '저장 중...' : '저장'}
            </button>

            {/* 선택된 팀 + 점수 미리보기 */}
            {selectedTeam && scoreInput !== '' && !isNaN(parseInt(scoreInput, 10)) && (
              <p className="text-xs text-center text-gray-400">
                <span style={{ color: selectedTeam.color }} className="font-semibold">
                  {selectedTeam.name}
                </span>
                {' '}에{' '}
                <span className="font-semibold text-gray-700">
                  {parseInt(scoreInput, 10) > 0 ? '+' : ''}{scoreInput}점
                </span>
                {' '}적용
              </p>
            )}
          </div>

          {/* 현재 팀 점수 현황 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 px-1">현재 점수 현황</p>
            {[...teams].sort((a, b) => b.score - a.score).map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.name.at(-1)}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{team.name}</span>
                </div>
                <span className="text-base font-black" style={{ color: team.color }}>
                  {team.score}점
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mission' && (
        <div className="space-y-3">
          {missions.map((mission, index) => (
            <div
              key={mission.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-gray-400">M{index + 1}</span>
                    <p className="font-bold text-gray-900 text-sm">{mission.title}</p>
                    <Badge variant="blue">+{mission.points}점</Badge>
                  </div>
                  <p className="text-xs text-gray-400">{mission.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    완료 팀: {mission.completedBy.length}개
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleMission(mission.id)}
                  className={`relative inline-flex w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${mission.isUnlocked ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  aria-label={mission.isUnlocked ? '미션 잠금' : '미션 공개'}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${mission.isUnlocked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useParams, Link } from 'react-router-dom'
import { useMission } from '../../hooks/useMission'
import { useTeams } from '../../hooks/useTeams'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'

export default function MissionDetailPage() {
  const { missionId } = useParams<{ missionId: string }>()
  const { mission: missions, loading: missionsLoading, error: missionsError, refetch: refetchMissions } = useMission()
  const { teams, loading: teamsLoading, error: teamsError, refetch: refetchTeams } = useTeams()

  const loading = missionsLoading || teamsLoading
  const error = missionsError || teamsError

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={() => { if (missionsError) refetchMissions(); if (teamsError) refetchTeams() }} />

  const mission = missions.find((m) => m.id === `m${missionId}`)

  if (!mission) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
          🔍
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-1">미션을 찾을 수 없습니다</p>
          <p className="text-sm text-gray-400">존재하지 않는 미션입니다.</p>
        </div>
        <Link
          to="/missions"
          className="text-sm text-blue-600 font-medium underline underline-offset-2"
        >
          미션 목록으로
        </Link>
      </div>
    )
  }

  if (!mission.isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
          🔒
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-1">잠긴 미션입니다</p>
          <p className="text-sm text-gray-400">아직 공개되지 않은 미션입니다.</p>
        </div>
        <Link
          to="/missions"
          className="text-sm text-blue-600 font-medium underline underline-offset-2"
        >
          미션 목록으로
        </Link>
      </div>
    )
  }

  const index = missions.indexOf(mission)
  const completedTeams = teams.filter((t) => mission.completedBy.includes(t.id))
  const formUrl = import.meta.env.VITE_MISSION_FORM_URL

  return (
    <div className="space-y-4">
      {/* 뒤로 가기 */}
      <Link
        to="/missions"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        ← 미션 목록
      </Link>

      {/* 미션 헤더 */}
      <div className="bg-blue-50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            M{index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-blue-400 font-medium">미션 {index + 1}</p>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{mission.title}</h2>
          </div>
          <Badge variant="blue">+{mission.points}점</Badge>
        </div>
      </div>

      {/* 미션 내용 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">미션 내용</p>
        <p className="text-gray-800 text-sm leading-relaxed">{mission.description}</p>
      </div>

      {/* 사진 제출 */}
      {formUrl ? (
        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold text-sm py-3.5 rounded-2xl active:scale-95 transition-transform shadow-sm"
        >
          <span>📷</span>
          <span>사진 제출하기</span>
        </a>
      ) : null}

      {/* 완료 현황 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">완료 현황</p>
        {completedTeams.length === 0 ? (
          <p className="text-sm text-gray-400">아직 완료한 팀이 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {completedTeams.map((team) => (
              <span
                key={team.id}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full text-white font-medium"
                style={{ backgroundColor: team.color }}
              >
                ✓ {team.name}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400">
          {completedTeams.length}/{teams.length}팀 완료
        </p>
      </div>

      {/* QR 코드 URL */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200 space-y-1.5">
        <img src={`${import.meta.env.BASE_URL}qrcode_pentasecurity_survey.png`} alt="QR 코드" className="w-full h-auto" />
      </div>
    </div>
  )
}

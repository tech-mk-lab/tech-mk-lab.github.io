import type { Team, Mission, RankingEntry } from '../types'

export const mockTeams: Team[] = [
  { id: 't1', name: '팀 알파', members: ['김철수', '이영희', '박민준'], score: 320, color: '#3B82F6' },
  { id: 't2', name: '팀 베타', members: ['최지수', '정현우', '강소영'], score: 280, color: '#10B981' },
  { id: 't3', name: '팀 감마', members: ['윤서준', '임나연', '한태양'], score: 250, color: '#F59E0B' },
  { id: 't4', name: '팀 델타', members: ['송민서', '조현진', '오세린'], score: 190, color: '#EF4444' },
]

export const mockMissions: Mission[] = [
  {
    id: 'm1',
    title: '아이스브레이킹',
    description: '팀원들과 함께 공통점 5가지 찾기',
    points: 50,
    isUnlocked: true,
    completedBy: [],
  },
  {
    id: 'm2',
    title: '팀 슬로건 만들기',
    description: '팀의 정체성을 담은 슬로건을 30초 안에 발표하기',
    points: 80,
    isUnlocked: true,
    completedBy: [],
  },
  {
    id: 'm3',
    title: '사진 챌린지',
    description: '제시된 주제로 창의적인 단체 사진 찍기',
    points: 100,
    isUnlocked: false,
    completedBy: [],
  },
  {
    id: 'm4',
    title: '협업 퀴즈',
    description: '회사 관련 OX 퀴즈 10문제 팀원 협력하여 풀기',
    points: 120,
    isUnlocked: false,
    completedBy: [],
  },
  {
    id: 'm5',
    title: '파이널 미션',
    description: '최종 종합 팀워크 미션',
    points: 200,
    isUnlocked: false,
    completedBy: [],
  },
]

export const mockRanking: RankingEntry[] = mockTeams
  .map((team) => ({
    rank: 0,
    teamId: team.id,
    teamName: team.name,
    score: team.score,
    completedMissions: mockMissions.filter((m) => m.completedBy.includes(team.id)).length,
  }))
  .sort((a, b) => b.score - a.score)
  .map((entry, index) => ({ ...entry, rank: index + 1 }))

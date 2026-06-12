export interface Team {
  id: string
  name: string
  members: string[]
  score: number
  color: string
}

export interface Mission {
  id: string
  title: string
  description: string
  points: number
  isUnlocked: boolean
  completedBy: string[]
}

export interface RankingEntry {
  rank: number
  teamId: string
  teamName: string
  score: number
  completedMissions: number
}

export interface Plan {
  date: string
  action: string
  place: string
}

export interface Mission {
  id: string
  title: string
  description: string
  points: number
  isUnlocked: boolean
  completedBy: string[]
}
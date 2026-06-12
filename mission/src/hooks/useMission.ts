import {useState, useEffect, useCallback} from 'react'
import client from '../api/client'
import type {Mission} from '../types'

interface UseMissionResult {
    mission: Mission[]
    loading: boolean
    error: string | null
    refetch: () => void
}

export function useMission(): UseMissionResult {
    const [mission, setMission] = useState<Mission[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        client
            .get<Mission[]>('', {
                params: {action: 'mission'},
                signal: controller.signal,
            })
            .then(({data}) => {
                setMission(data)
                setError(null)
                setLoading(false)
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setError('팀 데이터를 불러오지 못했습니다.')
                    setLoading(false)
                }
            })

        return () => controller.abort()
    }, [refreshKey])

    const refetch = useCallback(() => {
        setLoading(true)
        setRefreshKey((k) => k + 1)
    }, [])

    return {mission, loading, error, refetch}
}

import {useState, useEffect, useCallback} from 'react'
import client from '../api/client'
import type {RankingEntry} from '../types'

interface UseRankingResult {
    ranking: RankingEntry[]
    loading: boolean
    error: string | null
    lastUpdated: Date | null
    refetch: () => void
}

export function useRanking(): UseRankingResult {
    const [ranking, setRanking] = useState<RankingEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        client
            .get<RankingEntry[]>('', {
                params: {action: 'ranking'},
                signal: controller.signal,
            })
            .then(({data}) => {
                setRanking(data)
                setError(null)
                setLastUpdated(new Date())
                setLoading(false)
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setError('랭킹 데이터를 불러오지 못했습니다.')
                    setLoading(false)
                }
            })

        return () => controller.abort()
    }, [refreshKey])

    const refetch = useCallback(() => {
        setLoading(true)
        setRefreshKey((k) => k + 1)
    }, [])

    return {ranking, loading, error, lastUpdated, refetch}
}

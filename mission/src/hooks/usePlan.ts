import {useState, useEffect, useCallback} from 'react'
import client from '../api/client'
import type {Plan} from '../types'

interface UsePlanResult {
    plan: Plan[]
    loading: boolean
    error: string | null
    refetch: () => void
}

export function usePlan(): UsePlanResult {
    const [plan, setPlan] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        client
            .get<Plan[]>('', {
                params: {action: 'plan'},
                signal: controller.signal,
            })
            .then(({data}) => {
                setPlan(data)
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

    return {plan, loading, error, refetch}
}

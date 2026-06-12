import { usePlan } from '../../hooks/usePlan'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorMessage from '../../components/ui/ErrorMessage'

export default function PlanPage() {
    const { plan, loading, error, refetch } = usePlan()

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage message={error} onRetry={refetch} />

    const grouped = plan.reduce<Record<string, typeof plan>>((acc, item) => {
        if (!acc[item.date]) acc[item.date] = []
        acc[item.date].push(item)
        return acc
    }, {})

    const dates = Object.keys(grouped)

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-bold text-gray-900">일정표</h2>
                <p className="text-sm text-gray-400">행사 날짜별 활동 및 장소</p>
            </div>

            {dates.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center text-sm text-gray-400">
                    등록된 일정이 없습니다.
                </div>
            ) : (
                <div className="space-y-4">
                    {dates.map((date) => (
                        <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-blue-600 px-4 py-2.5">
                                <span className="text-sm font-bold text-white">{date}</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {grouped[date].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 px-4 py-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800">{item.action}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="text-gray-300 text-xs">📍</span>
                                            <span className="text-xs text-gray-500">{item.place}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

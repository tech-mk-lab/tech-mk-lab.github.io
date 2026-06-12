interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorMessage({
  message = '데이터를 불러오지 못했습니다.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-2xl">
        ⚠️
      </div>
      <div>
        <p className="font-semibold text-gray-700 mb-1">오류가 발생했습니다</p>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}

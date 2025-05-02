export function Modal({
    isOpen,
    onClose,
    title,
    children,
  }: {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
  }) {
    if (!isOpen) return null
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          {children}
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
          >
            닫기
          </button>
        </div>
      </div>
    )
  }
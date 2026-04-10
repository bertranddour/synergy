interface ErrorStateProps {
  message: string
  retry?: () => void
}

export function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div className="shadow-neo-inset rounded-[2rem] bg-[var(--surface)] p-8 text-center" role="alert">
      <p className="text-sm text-[var(--color-error)]">{message}</p>
      {retry && (
        <button type="button" onClick={retry} className="neo-btn shadow-neo-button mt-4 rounded-full px-6 py-2 text-sm">
          Retry
        </button>
      )}
    </div>
  )
}

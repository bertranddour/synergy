import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-12 text-center">
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">
          7 Flows Synergy
        </h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)]">
          Your business fitness system
        </p>
      </div>
    </div>
  )
}

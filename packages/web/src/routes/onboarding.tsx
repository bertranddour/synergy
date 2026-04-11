import { FRAMEWORK_COLORS, FRAMEWORK_NAMES, type FrameworkSlug } from '@synergy/shared'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthStore } from '../stores/auth'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})

const STAGES = [
  { value: 'solo', label: 'Solo Founder', description: 'Just me, building and validating' },
  { value: 'small-team', label: 'Small Team', description: '2-10 people, finding product-market fit' },
  { value: 'growing', label: 'Growing', description: '10-50 people, scaling what works' },
  { value: 'scaling', label: 'Scaling', description: '50+ people, building for scale' },
] as const

function OnboardingPage() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const updateUser = useAuthStore((s) => s.updateUser)
  const [step, setStep] = useState(0)
  const [name, setName] = useState(user?.name ?? '')
  const [stage, setStage] = useState(user?.stage ?? 'solo')
  const [activeFrameworks, setActiveFrameworks] = useState<Set<FrameworkSlug>>(new Set())
  const [saving, setSaving] = useState(false)

  const frameworks = Object.keys(FRAMEWORK_COLORS) as FrameworkSlug[]

  const saveProfile = async () => {
    await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, stage }),
    })
    updateUser({ name, stage })
  }

  const activateFramework = async (slug: FrameworkSlug) => {
    await fetch('/api/users/me/frameworks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ frameworkSlug: slug }),
    })
  }

  const completeOnboarding = async () => {
    setSaving(true)
    try {
      // Activate selected frameworks
      for (const slug of activeFrameworks) {
        await activateFramework(slug)
      }
      // Mark onboarding complete
      await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingCompleted: true }),
      })
      updateUser({ onboardingCompleted: true })
      void navigate({ to: '/' })
    } catch {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    if (step === 0) {
      await saveProfile()
      setStep(1)
    } else if (step === 1) {
      await saveProfile()
      setStep(2)
    } else {
      await completeOnboarding()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="shadow-neo-panel rounded-[2rem] bg-[var(--surface)] p-10">
          {/* Header */}
          <h1 className="font-display text-center text-2xl tracking-tight">Welcome to Synergy</h1>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            {step === 0 && "Let's get to know you"}
            {step === 1 && 'Where are you in your journey?'}
            {step === 2 && 'Which frameworks do you want to track?'}
          </p>

          {/* Step 1: Name */}
          {step === 0 && (
            <div className="wave-entrance-1 mt-8">
              <label
                htmlFor="onboarding-name"
                className="mb-2 block text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]"
              >
                What should we call you?
              </label>
              <input
                id="onboarding-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-embossed w-full px-6 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
            </div>
          )}

          {/* Step 2: Stage */}
          {step === 1 && (
            <div className="wave-entrance-1 mt-8 space-y-3">
              {STAGES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStage(s.value)}
                  className={`w-full rounded-[1.2rem] p-4 text-left transition-all ${
                    stage === s.value ? 'shadow-neo-embossed' : 'shadow-neo-well'
                  }`}
                >
                  <p className="font-semibold">{s.label}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{s.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Frameworks */}
          {step === 2 && (
            <div className="wave-entrance-1 mt-8 space-y-3">
              {frameworks.map((slug) => {
                const isActive = activeFrameworks.has(slug)
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => {
                      setActiveFrameworks((prev) => {
                        const next = new Set(prev)
                        if (next.has(slug)) next.delete(slug)
                        else next.add(slug)
                        return next
                      })
                    }}
                    className={`flex w-full items-center gap-3 rounded-[1.2rem] p-4 text-left transition-all ${
                      isActive ? 'shadow-neo-embossed' : 'shadow-neo-well'
                    }`}
                  >
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: FRAMEWORK_COLORS[slug] }} />
                    <div className="flex-1">
                      <p className="font-semibold">{FRAMEWORK_NAMES[slug]}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isActive
                          ? 'bg-[var(--color-synergy)]/10 text-[var(--color-synergy)]'
                          : 'text-[var(--text-tertiary)]'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={() => void handleNext()}
              disabled={saving || (step === 0 && !name.trim()) || (step === 2 && activeFrameworks.size === 0)}
              className="neo-btn shadow-neo-button rounded-full px-8 py-3 font-semibold disabled:opacity-40"
            >
              {saving ? 'Setting up...' : step === 2 ? 'Get Started' : 'Continue'}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block rounded-full transition-all ${
                i === step ? 'h-2 w-6 bg-[var(--color-synergy)]' : 'h-2 w-2 bg-[var(--zinc-300)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuthStore } from '../../../stores/auth'
import { useRunnerStore } from '../../../stores/runner'
import { FieldStep } from '../../../components/modes/FieldStep'

export const Route = createFileRoute('/_auth/runner/$sessionId')({
  component: ModeRunner,
})

interface SessionData {
  session: {
    id: string
    modeId: string
    status: string
    fieldsData: Record<string, unknown>
    currentFieldIndex: number
    decision: string | null
    startedAt: string
    completedAt: string | null
  }
  mode: {
    id: string
    slug: string
    name: string
    fieldsSchema: Array<{
      name: string
      description: string
      type: string
      required: boolean
      example?: string
      options?: string[]
    }>
    doneSignal: string
  } | null
}

function ModeRunner() {
  const { sessionId } = Route.useParams()
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()
  const {
    currentFieldIndex,
    fieldsData,
    startSession,
    setFieldData,
    advanceField,
    reset,
  } = useRunnerStore()

  const [completed, setCompleted] = useState(false)

  // Load session + mode data
  const { data, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load session')
      const data = await res.json() as SessionData

      // Initialize runner store
      if (data.mode) {
        startSession({
          sessionId: data.session.id,
          modeSlug: data.mode.slug,
          modeName: data.mode.name,
          fields: data.mode.fieldsSchema,
        })
      }

      return data
    },
  })

  // Save field progressively
  const saveMutation = useMutation({
    mutationFn: async (params: { fieldIndex: number; fieldData: unknown }) => {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error('Failed to save')
      return res.json()
    },
  })

  // Complete session
  const completeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/sessions/${sessionId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      if (!res.ok) throw new Error('Failed to complete')
      return res.json() as Promise<{
        session: SessionData['session']
        composabilitySuggestions: Array<{ modeSlug: string; reason: string }>
      }>
    },
    onSuccess: () => {
      setCompleted(true)
    },
  })

  const handleFieldSubmit = async (value: unknown) => {
    setFieldData(currentFieldIndex, value)

    // Save to server
    saveMutation.mutate({ fieldIndex: currentFieldIndex, fieldData: value })

    const fields = data?.mode?.fieldsSchema ?? []
    if (currentFieldIndex >= fields.length - 1) {
      // Last field — complete the session
      completeMutation.mutate()
    } else {
      advanceField()
    }
  }

  if (isLoading || !data?.mode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="wave-spinner" />
      </div>
    )
  }

  if (completed || data.session.status === 'completed') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="wave-entrance-1">
          <div className="shadow-neo-panel mx-auto flex h-24 w-24 items-center justify-center rounded-full">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="font-display mt-6 text-3xl tracking-tight">
            {data.mode.name} Complete
          </h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            {data.mode.doneSignal}
          </p>
        </div>

        {completeMutation.data?.composabilitySuggestions &&
          completeMutation.data.composabilitySuggestions.length > 0 && (
          <div className="wave-entrance-2 mt-8 shadow-neo-well rounded-[1.8rem] bg-[var(--surface)] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
              Next suggested mode
            </p>
            {completeMutation.data.composabilitySuggestions.map((s) => (
              <p key={s.modeSlug} className="mt-2 text-[var(--text-secondary)]">
                → {s.modeSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}: {s.reason}
              </p>
            ))}
          </div>
        )}

        <div className="wave-entrance-3 mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => {
              reset()
              void navigate({ to: '/modes' })
            }}
            className="neo-btn shadow-neo-button rounded-full px-8 py-3"
          >
            Back to Library
          </button>
          <button
            type="button"
            onClick={() => void navigate({ to: '/' })}
            className="neo-btn shadow-neo-button rounded-full px-8 py-3"
          >
            Dashboard
          </button>
        </div>
      </div>
    )
  }

  const fields = data.mode.fieldsSchema
  const currentField = fields[currentFieldIndex]
  if (!currentField) return null

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Mode name header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-lg text-[var(--text-secondary)]">
          {data.mode.name}
        </h1>
        <button
          type="button"
          onClick={() => {
            reset()
            void navigate({ to: '/modes/$slug', params: { slug: data.mode!.slug } })
          }}
          className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          Exit
        </button>
      </div>

      {/* Field step */}
      <FieldStep
        key={currentFieldIndex}
        index={currentFieldIndex}
        total={fields.length}
        name={currentField.name}
        description={currentField.description}
        type={currentField.type}
        required={currentField.required}
        example={currentField.example}
        options={currentField.options}
        value={fieldsData[String(currentFieldIndex)]}
        onSubmit={handleFieldSubmit}
        isLast={currentFieldIndex >= fields.length - 1}
      />

      {/* Field navigator dots */}
      <div className="mt-8 flex justify-center gap-2">
        {fields.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => i < currentFieldIndex ? useRunnerStore.getState().goToField(i) : undefined}
            className={`h-2 w-2 rounded-full transition-all ${
              i === currentFieldIndex
                ? 'w-6 bg-[var(--text-primary)]'
                : i < currentFieldIndex
                ? 'bg-[var(--text-tertiary)] cursor-pointer'
                : 'bg-[var(--zinc-300)]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

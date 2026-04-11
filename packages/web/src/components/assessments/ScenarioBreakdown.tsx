interface ScenarioBreakdownProps {
  responses: Array<{
    scenarioId: string
    answer: string
    score: number
  }>
}

function scoreColor(score: number): string {
  if (score >= 5) return 'var(--color-health-green)'
  if (score >= 3) return 'var(--color-health-yellow)'
  if (score >= 1) return 'var(--color-health-orange)'
  return 'var(--color-health-red)'
}

export function ScenarioBreakdown({ responses }: ScenarioBreakdownProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Scenario Breakdown</h2>
      {responses.map((r, i) => (
        <div key={r.scenarioId} className="shadow-neo-embossed rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-neo-button">
                {i + 1}
              </span>
              <span className="text-sm">
                Answer: <span className="font-semibold uppercase">{r.answer}</span>
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: scoreColor(r.score) }}>
              {r.score}/5
            </span>
          </div>
          <div className="shadow-neo-inset mt-3 h-2 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(r.score / 5) * 100}%`,
                backgroundColor: scoreColor(r.score),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

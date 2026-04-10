interface SparklineChartProps {
  data: number[]
  color?: string
  width?: number
  height?: number
}

export function SparklineChart({ data, color = 'var(--text-tertiary)', width = 80, height = 24 }: SparklineChartProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((value - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block"
      role="img"
      aria-label="Metric trend"
    >
      <title>Sparkline chart</title>
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dot on last point */}
      {data.length > 0 &&
        (() => {
          const lastX = width
          const lastY = height - ((data[data.length - 1]! - min) / range) * (height - 4) - 2
          return <circle cx={lastX} cy={lastY} r={2} fill={color} />
        })()}
    </svg>
  )
}

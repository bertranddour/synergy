export function formatDate(date: Date | string, locale: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date))
}

export function formatRelativeTime(date: Date | string, locale: string): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diffSeconds = Math.round((now - then) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffSeconds < 60) return rtf.format(-diffSeconds, 'second')
  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) return rtf.format(-diffMinutes, 'minute')
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return rtf.format(-diffHours, 'hour')
  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 30) return rtf.format(-diffDays, 'day')
  const diffMonths = Math.round(diffDays / 30)
  return rtf.format(-diffMonths, 'month')
}

export function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value)
}

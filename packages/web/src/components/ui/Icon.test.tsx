// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ICON_PATHS, Icon, type IconName } from './Icon'

const ALL_ICON_NAMES: IconName[] = [
  'house',
  'lightning',
  'brain',
  'clipboard-text',
  'book-open-text',
  'chart-line-up',
  'users-three',
  'gear',
  'sign-out',
  'trend-up',
  'trend-down',
  'equals',
  'timer',
  'envelope',
  'arrow-left',
  'arrow-right',
  'check',
]

describe('ICON_PATHS registry', () => {
  it('has a non-empty entry for every IconName', () => {
    for (const name of ALL_ICON_NAMES) {
      const paths = ICON_PATHS[name]
      expect(paths, `Missing paths for "${name}"`).toBeDefined()
      expect(paths.length, `Empty paths array for "${name}"`).toBeGreaterThan(0)
      for (const d of paths) {
        expect(d.length, `Empty path string for "${name}"`).toBeGreaterThan(0)
      }
    }
  })

  it('has exactly 17 icons', () => {
    expect(Object.keys(ICON_PATHS)).toHaveLength(17)
  })
})

describe('Icon component', () => {
  it('renders an SVG with fill="currentColor" and correct viewBox', () => {
    const { container } = render(<Icon name="house" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('fill')).toBe('currentColor')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 256 256')
  })

  it('defaults to md size (20px)', () => {
    const { container } = render(<Icon name="house" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('20')
    expect(svg?.getAttribute('height')).toBe('20')
  })

  it.each([
    ['xs', '12'],
    ['sm', '16'],
    ['md', '20'],
    ['lg', '24'],
    ['xl', '32'],
  ] as const)('size="%s" renders %s x %s', (size, px) => {
    const { container } = render(<Icon name="gear" size={size} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe(px)
    expect(svg?.getAttribute('height')).toBe(px)
  })

  it('is aria-hidden when no label (decorative)', () => {
    const { container } = render(<Icon name="house" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.getAttribute('aria-label')).toBeNull()
    expect(svg?.getAttribute('role')).toBeNull()
  })

  it('has aria-label and role="img" when label provided (semantic)', () => {
    const { container } = render(<Icon name="check" label="Complete" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-label')).toBe('Complete')
    expect(svg?.getAttribute('role')).toBe('img')
    expect(svg?.getAttribute('aria-hidden')).toBeNull()
  })

  it('passes className to SVG element', () => {
    const { container } = render(<Icon name="gear" className="text-red-500 h-8 w-8" />)
    const svg = container.querySelector('svg')
    expect(svg?.classList.contains('text-red-500')).toBe(true)
    expect(svg?.classList.contains('h-8')).toBe(true)
  })

  it('renders path elements from ICON_PATHS', () => {
    const { container } = render(<Icon name="house" />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBe(ICON_PATHS.house.length)
    expect(paths[0]?.getAttribute('d')).toBe(ICON_PATHS.house[0])
  })

  it('renders accessible icon via role query', () => {
    render(<Icon name="envelope" label="Email sent" />)
    const img = screen.getByRole('img', { name: 'Email sent' })
    expect(img).toBeDefined()
  })
})

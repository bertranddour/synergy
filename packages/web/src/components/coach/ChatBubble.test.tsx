// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatBubble } from './ChatBubble'

describe('ChatBubble', () => {
  it('renders user message on the right', () => {
    const { container } = render(<ChatBubble sender="user" content="Hello Alicia" />)
    expect(container.querySelector('.justify-end')).not.toBeNull()
    expect(container.textContent).toContain('Hello Alicia')
  })

  it('renders alicia message with avatar', () => {
    const { container } = render(<ChatBubble sender="alicia" content="Hey! Let's work on it." />)
    expect(container.textContent).toContain('A')
    expect(container.textContent).toContain("Hey! Let's work on it.")
  })

  it('shows streaming cursor when isStreaming', () => {
    const { container } = render(<ChatBubble sender="alicia" content="Thinking..." isStreaming />)
    const cursor = container.querySelector('.animate-pulse')
    expect(cursor).not.toBeNull()
  })

  it('shows typing dots when isTyping', () => {
    const { container } = render(<ChatBubble sender="alicia" content="" isTyping />)
    const dots = container.querySelectorAll('.typing-dot')
    expect(dots.length).toBe(3)
  })

  it('does not show content when isTyping', () => {
    const { container } = render(<ChatBubble sender="alicia" content="should not show" isTyping />)
    expect(container.textContent).not.toContain('should not show')
  })

  it('renders suggestion chips when provided', () => {
    render(
      <ChatBubble
        sender="alicia"
        content="Try this mode."
        suggestions={[{ label: 'Run Validation', slug: 'validation' }]}
      />,
    )
    expect(screen.getByText('Run Validation')).toBeDefined()
  })

  it('does not render chips for user messages', () => {
    const { container } = render(
      <ChatBubble sender="user" content="Test" suggestions={[{ label: 'Run Validation', slug: 'validation' }]} />,
    )
    expect(container.textContent).not.toContain('Run Validation')
  })
})

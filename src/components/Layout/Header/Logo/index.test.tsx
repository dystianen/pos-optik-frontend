import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Logo from './index'

// We need to wrap Mantine components with MantineProvider
const renderWithMantine = (component: React.ReactNode) => {
  return render(<MantineProvider>{component}</MantineProvider>)
}

describe('Logo Component', () => {
  it('renders the logo text correctly', () => {
    renderWithMantine(<Logo />)

    // Check if OPTIKERS text is present
    expect(screen.getByText('OPTIKERS')).toBeInTheDocument()

    // Check if the dot is present (it's inside a nested Title span based on the code)
    expect(screen.getByText('.')).toBeInTheDocument()
  })

  it('renders a link to the homepage', () => {
    renderWithMantine(<Logo />)

    // The link should wrap the text, so we can find it by its role
    const linkElement = screen.getByRole('link')
    expect(linkElement).toHaveAttribute('href', '/')
  })
})

import { render, screen } from '@testing-library/react'
import Providers from './index'

describe('Providers Component', () => {
  it('renders children correctly', () => {
    render(
      <Providers>
        <div data-testid="child">Test Child</div>
      </Providers>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('renders ToastContainer', () => {
    render(
      <Providers>
        <div>Child</div>
      </Providers>
    )

    // ToastContainer usually rendered at the root, check if it's there
    // Toastify adds a container with class 'Toastify'
    const toastContainer = document.querySelector('.Toastify')
    expect(toastContainer).toBeInTheDocument()
  })
})

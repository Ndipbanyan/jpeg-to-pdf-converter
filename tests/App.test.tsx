import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App'

describe('App', () => {
  it('renders the converter title', () => {
    render(<App />)
    expect(screen.getByText('JPEG to PDF Converter')).toBeInTheDocument()
  })
}) 
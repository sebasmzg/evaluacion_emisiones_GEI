import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import { Input } from './input'

describe('Input', () => {
  it('debería renderizar correctamente', () => {
    render(<Input placeholder="Test Input" />)
    expect(screen.getByPlaceholderText('Test Input')).toBeInTheDocument()
  })

  it('debería aplicar la clase base', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('input')
  })

  it('debería aplicar clases personalizadas', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('custom-class')
  })

  it('debería aceptar el tipo number', () => {
    render(<Input type="number" />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('debería estar deshabilitado cuando se especifica', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('debería pasar las propiedades adicionales', () => {
    render(<Input data-testid="test-input" aria-label="test input" />)
    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('aria-label', 'test input')
  })
}) 
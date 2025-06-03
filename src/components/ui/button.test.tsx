import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import { Button } from './button'

describe('Button', () => {
  it('debería renderizar correctamente', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('debería aplicar la clase primary por defecto', () => {
    render(<Button>Test Button</Button>)
    const button = screen.getByText('Test Button')
    expect(button.className).toContain('primary')
  })

  it('debería aplicar la variante secondary cuando se especifica', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByText('Secondary Button')
    expect(button.className).toContain('secondary')
  })

  it('debería aplicar el tamaño large cuando se especifica', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByText('Large Button')
    expect(button.className).toContain('large')
  })

  it('debería estar deshabilitado cuando se especifica', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByText('Disabled Button')
    expect(button).toBeDisabled()
    expect(button.className).toContain('disabled')
  })

  it('debería aplicar clases personalizadas', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByText('Custom Button')
    expect(button.className).toContain('custom-class')
  })
}) 
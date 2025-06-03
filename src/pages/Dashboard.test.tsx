import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('debería renderizar correctamente', () => {
    render(<Dashboard />)
    
    // Verificar elementos principales
    expect(screen.getByText('Calculadora de Emisiones GEI')).toBeInTheDocument()
    expect(screen.getByText('Calcular y Visualizar Resultados')).toBeInTheDocument()
  })

  it('debería mostrar los gráficos al hacer clic en el botón calcular', () => {
    render(<Dashboard />)
    
    // Inicialmente no deberían mostrarse los resultados
    expect(screen.queryByText('Resultados')).not.toBeInTheDocument()
    
    // Hacer clic en el botón calcular
    const botonCalcular = screen.getByText('Calcular y Visualizar Resultados')
    fireEvent.click(botonCalcular)
    
    // Verificar que se muestren los resultados
    expect(screen.getByText('Resultados')).toBeInTheDocument()
  })
}) 
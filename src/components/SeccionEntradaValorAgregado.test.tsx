import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import { SeccionEntradaValorAgregado } from './SeccionEntradaValorAgregado'

describe('SeccionEntradaValorAgregado', () => {
  it('debería renderizar la tabla de valores agregados', () => {
    render(<SeccionEntradaValorAgregado />)
    
    // Verificar elementos principales
    expect(screen.getByText('Valor Agregado por Sector')).toBeInTheDocument()
    expect(screen.getByText('Ingrese los datos de valor agregado por sector y año')).toBeInTheDocument()
  })

  it('debería permitir agregar un nuevo valor agregado', () => {
    render(<SeccionEntradaValorAgregado />)
    
    const botonAgregar = screen.getByText(/Agregar/i)
    const filasIniciales = screen.getAllByRole('row')
    
    fireEvent.click(botonAgregar)
    
    const filasNuevas = screen.getAllByRole('row')
    expect(filasNuevas.length).toBe(filasIniciales.length + 1)
  })

  it('debería permitir editar un valor agregado existente', () => {
    render(<SeccionEntradaValorAgregado />)
    
    // Hacer clic en el primer botón de editar
    const botonesEditar = screen.getAllByText('Editar')
    fireEvent.click(botonesEditar[0])
    
    // Verificar que aparezcan los inputs
    const inputs = screen.getAllByRole('spinbutton')
    expect(inputs.length).toBeGreaterThan(0)
    
    // Editar un valor
    fireEvent.change(inputs[0], { target: { value: '1000000' } })
    
    // Guardar cambios
    const botonGuardar = screen.getByText('Guardar')
    fireEvent.click(botonGuardar)
    
    // Verificar que volvió al modo visualización
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  })

  it('debería permitir eliminar un valor agregado', () => {
    render(<SeccionEntradaValorAgregado />)
    
    const filasIniciales = screen.getAllByRole('row')
    const cantidadInicial = filasIniciales.length
    
    // Eliminar el primer valor agregado
    const botonesEliminar = screen.getAllByText('Eliminar')
    fireEvent.click(botonesEliminar[0])
    
    const filasFinales = screen.getAllByRole('row')
    expect(filasFinales.length).toBe(cantidadInicial - 1)
  })

  it('debería formatear correctamente los valores monetarios', () => {
    render(<SeccionEntradaValorAgregado />)
    
    // Verificar que los valores se muestren con formato de moneda
    const valores = screen.getAllByRole('cell')
    const valorFormateado = valores.some(valor => 
      valor.textContent?.includes('$') || 
      valor.textContent?.includes('.') || 
      valor.textContent?.includes(',')
    )
    
    expect(valorFormateado).toBe(true)
  })
}) 
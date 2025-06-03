import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../utils/test-utils'
import { SeccionEntradaConsumo } from './SeccionEntradaConsumo'

describe('SeccionEntradaConsumo', () => {
  it('debería renderizar la tabla de consumos', () => {
    render(<SeccionEntradaConsumo />)
    
    expect(screen.getByText('Consumo Energético')).toBeInTheDocument()
    expect(screen.getByText('Ingrese los datos de consumo energético por año')).toBeInTheDocument()
  })

  it('debería permitir agregar un nuevo consumo', () => {
    render(<SeccionEntradaConsumo />)
    
    const botonAgregar = screen.getByText('Agregar Consumo')
    fireEvent.click(botonAgregar)
    
    // Verificar que se agregó una nueva fila
    const filas = screen.getAllByRole('row')
    const cantidadFilasInicial = filas.length
    
    fireEvent.click(botonAgregar)
    
    const filasNuevas = screen.getAllByRole('row')
    expect(filasNuevas.length).toBe(cantidadFilasInicial + 1)
  })

  it('debería permitir editar un consumo existente', () => {
    render(<SeccionEntradaConsumo />)
    
    // Hacer clic en el primer botón de editar
    const botonesEditar = screen.getAllByText('Editar')
    fireEvent.click(botonesEditar[0])
    
    // Verificar que aparezcan los inputs
    const inputs = screen.getAllByRole('spinbutton')
    expect(inputs.length).toBeGreaterThan(0)
    
    // Editar un valor
    fireEvent.change(inputs[0], { target: { value: '1000' } })
    
    // Guardar cambios
    const botonGuardar = screen.getByText('Guardar')
    fireEvent.click(botonGuardar)
    
    // Verificar que volvió al modo visualización
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  })

  it('debería permitir eliminar un consumo', () => {
    render(<SeccionEntradaConsumo />)
    
    const filasIniciales = screen.getAllByRole('row')
    const cantidadInicial = filasIniciales.length
    
    // Eliminar el primer consumo
    const botonesEliminar = screen.getAllByText('Eliminar')
    fireEvent.click(botonesEliminar[0])
    
    const filasFinales = screen.getAllByRole('row')
    expect(filasFinales.length).toBe(cantidadInicial - 1)
  })
}) 
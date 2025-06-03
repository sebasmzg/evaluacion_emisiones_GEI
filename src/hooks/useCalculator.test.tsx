import { describe, it, expect } from 'vitest'
import { calcularResultados } from './useCalculator'
import { CONSUMOS_PRECARGADOS } from '../data/consumos'
import { VA_PRECARGADO } from '../data/valorAgregado'

describe('calcularResultados', () => {
  it('debería calcular correctamente las emisiones y energía para datos precargados', () => {
    const resultados = calcularResultados(CONSUMOS_PRECARGADOS, VA_PRECARGADO)
    
    expect(resultados).toHaveLength(CONSUMOS_PRECARGADOS.length)
    
    // Verificar estructura del resultado
    resultados.forEach(resultado => {
      expect(resultado).toHaveProperty('anio')
      expect(resultado).toHaveProperty('emisionesElectricidad')
      expect(resultado).toHaveProperty('emisionesGN')
      expect(resultado).toHaveProperty('emisionesGLP')
      expect(resultado).toHaveProperty('emisionesCarbon')
      expect(resultado).toHaveProperty('totalEmisiones')
      expect(resultado).toHaveProperty('energiaTotalTJ')
      expect(resultado).toHaveProperty('intensidadEnergetica')
    })

    // Verificar que los valores sean números positivos
    resultados.forEach(resultado => {
      expect(resultado.emisionesElectricidad).toBeGreaterThanOrEqual(0)
      expect(resultado.emisionesGN).toBeGreaterThanOrEqual(0)
      expect(resultado.emisionesGLP).toBeGreaterThanOrEqual(0)
      expect(resultado.emisionesCarbon).toBeGreaterThanOrEqual(0)
      expect(resultado.totalEmisiones).toBeGreaterThanOrEqual(0)
      expect(resultado.energiaTotalTJ).toBeGreaterThanOrEqual(0)
    })

    // Verificar que el total de emisiones sea la suma de todas las fuentes
    resultados.forEach(resultado => {
      const totalCalculado = 
        resultado.emisionesElectricidad +
        resultado.emisionesGN +
        resultado.emisionesGLP +
        resultado.emisionesCarbon
      
      expect(resultado.totalEmisiones).toBeCloseTo(totalCalculado, 2)
    })
  })

  it('debería manejar correctamente valores agregados faltantes', () => {
    const resultados = calcularResultados(CONSUMOS_PRECARGADOS, [])
    
    resultados.forEach(resultado => {
      expect(resultado.valorAgregadoTotal).toBe(0)
      expect(resultado.intensidadEnergetica).toBe(0)
    })
  })

  it('debería calcular correctamente la intensidad energética', () => {
    const resultados = calcularResultados(CONSUMOS_PRECARGADOS, VA_PRECARGADO)
    
    resultados.forEach(resultado => {
      if (resultado.valorAgregadoTotal > 0) {
        const intensidadCalculada = (resultado.energiaTotalTJ * 1e6) / resultado.valorAgregadoTotal
        expect(resultado.intensidadEnergetica).toBeCloseTo(intensidadCalculada, 5)
      } else {
        expect(resultado.intensidadEnergetica).toBe(0)
      }
    })
  })
}) 
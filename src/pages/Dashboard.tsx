import { useState } from "react"
import { CONSUMOS_PRECARGADOS } from "../data/consumos"
import { VA_PRECARGADO } from "../data/valorAgregado"
import { calcularResultados } from "../hooks/useCalculator"
import { SeccionEntradaConsumo } from "../components/SeccionEntradaConsumo"
import { SeccionEntradaValorAgregado } from "../components/SeccionEntradaValorAgregado"
import { Graficos } from "../components/Graficos"
import { Button } from "../components/ui/button"
import type { ConsumoEnergetico, ValorAgregado } from "../models/interfaces"
import styles from "./Dashboard.module.css"

const Dashboard = () => {
  const [consumos, setConsumos] = useState<ConsumoEnergetico[]>(CONSUMOS_PRECARGADOS)
  const [valoresAgregados, setValoresAgregados] = useState<ValorAgregado[]>(VA_PRECARGADO)
  const [resultados, setResultados] = useState(calcularResultados(consumos, valoresAgregados))
  const [mostrarGraficos, setMostrarGraficos] = useState(false)

  const handleCalcular = () => {
    const nuevosResultados = calcularResultados(consumos, valoresAgregados)
    setResultados(nuevosResultados)
    setMostrarGraficos(true)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Calculadora de Emisiones GEI</h1>
      
      <div className={styles.content}>
        <SeccionEntradaConsumo />
        <SeccionEntradaValorAgregado />
        
        <div className={styles.buttonContainer}>
          <Button size="lg" onClick={handleCalcular}>
            Calcular y Visualizar Resultados
          </Button>
        </div>

        {mostrarGraficos && resultados.length > 0 && (
          <div className={styles.resultsSection}>
            <h2 className={styles.resultsTitle}>Resultados</h2>
            <Graficos resultados={resultados} valoresAgregados={valoresAgregados} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

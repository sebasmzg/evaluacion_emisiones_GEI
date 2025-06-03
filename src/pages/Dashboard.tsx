import { useState } from "react"
import { CONSUMOS_PRECARGADOS } from "../data/consumos"
import { VA_PRECARGADO } from "../data/valorAgregado"
import { calcularResultados } from "../hooks/useCalculator"
import { SeccionEntradaConsumo } from "../components/SeccionEntradaConsumo"
import { SeccionEntradaValorAgregado } from "../components/SeccionEntradaValorAgregado"
import { Graficos } from "../components/Graficos"
import { Button } from "../components/ui/button"
import styles from "./Dashboard.module.css"

const Dashboard = () => {
  const [resultados, setResultados] = useState(calcularResultados(CONSUMOS_PRECARGADOS, VA_PRECARGADO))
  const [mostrarGraficos, setMostrarGraficos] = useState(false)

  const handleCalcular = () => {
    const nuevosResultados = calcularResultados(CONSUMOS_PRECARGADOS, VA_PRECARGADO)
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
            <Graficos resultados={resultados} valoresAgregados={VA_PRECARGADO} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

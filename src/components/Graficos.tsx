import { useMemo, useState, useEffect } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts"
import type { ResultadoCalculo, ValorAgregado } from "../models/interfaces"
import styles from "./Graficos.module.css"

interface GraficosProps {
  resultados: ResultadoCalculo[]
  valoresAgregados: ValorAgregado[]
}

const COLORS = {
  primary: "#3B82F6", // blue-500
  secondary: "#10B981", // emerald-500
  accent: "#F59E0B", // amber-500
  neutral: "#6B7280", // gray-500
}

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.neutral]

// Agregar helper para ordenar datos por año
const ordenarPorAño = <T extends { anio: number }>(datos: T[]) => {
  return [...datos].sort((a, b) => a.anio - b.anio)
}

export function Graficos({ resultados, valoresAgregados }: GraficosProps) {
  // Obtener años de cada fuente de datos
  const añosResultados = useMemo(() => {
    return [...new Set(resultados.map(r => r.anio))].sort((a, b) => b - a)
  }, [resultados])

  const añosVA = useMemo(() => {
    return [...new Set(valoresAgregados.map(va => va.anio))].sort((a, b) => b - a)
  }, [valoresAgregados])

  const [añosSeleccionadosResultados, setAñosSeleccionadosResultados] = useState<number[]>(añosResultados)
  const [añosSeleccionadosVA, setAñosSeleccionadosVA] = useState<number[]>(añosVA)

  // Actualizar años seleccionados cuando cambien los datos
  useEffect(() => {
    setAñosSeleccionadosResultados(añosResultados)
  }, [añosResultados])

  useEffect(() => {
    setAñosSeleccionadosVA(añosVA)
  }, [añosVA])

  const datosEmisiones = useMemo(
    () =>
      resultados
        .filter((r) => añosSeleccionadosResultados.includes(r.anio))
        .map((r) => ({
          anio: r.anio,
          Electricidad: Number(r.emisionesElectricidad.toFixed(2)),
          "Gas Natural": Number(r.emisionesGN.toFixed(2)),
          GLP: Number(r.emisionesGLP.toFixed(2)),
          Carbón: Number(r.emisionesCarbon.toFixed(2)),
          Total: Number(r.totalEmisiones.toFixed(2)),
        }))
        .sort((a, b) => a.anio - b.anio),
    [resultados, añosSeleccionadosResultados]
  )

  const datosVAPorAño = useMemo(() => {
    return valoresAgregados
      .filter((va) => añosSeleccionadosVA.includes(va.anio))
      .map((va) => {
        const total = va.primario_COP + va.secundario_COP + va.terciario_COP
        return {
          anio: va.anio,
          datos: [
            {
              name: "Primario",
              value: Number(((va.primario_COP / total) * 100).toFixed(1)),
            },
            {
              name: "Secundario",
              value: Number(((va.secundario_COP / total) * 100).toFixed(1)),
            },
            {
              name: "Terciario",
              value: Number(((va.terciario_COP / total) * 100).toFixed(1)),
            },
          ],
        }
      })
      .sort((a, b) => b.anio - a.anio)
  }, [valoresAgregados, añosSeleccionadosVA])

  const datosKuznets = useMemo(
    () => {
      // Obtener años comunes y ordenarlos cronológicamente
      const añosComunes = [...new Set(
        resultados
          .filter(r => 
            añosSeleccionadosResultados.includes(r.anio) && 
            añosSeleccionadosVA.includes(r.anio)
          )
          .map(r => r.anio)
      )].sort((a, b) => a - b)

      // Encontrar el rango de VA para normalizar
      const datosVA = añosComunes.map(año => {
        const resultado = resultados.find(r => r.anio === año)
        return resultado ? resultado.valorAgregadoTotal / 1e9 : 0
      })
      const minVA = Math.min(...datosVA)
      const maxVA = Math.max(...datosVA)
      const rangoVA = maxVA - minVA

      // Crear puntos de datos ordenados cronológicamente
      return añosComunes
        .map((año, index) => {
          const resultado = resultados.find(r => r.anio === año)
          if (!resultado) return null

          const energiaGWh = resultado.energiaTotalTJ * 0.277778
          const va = resultado.valorAgregadoTotal / 1e9

          return {
            // Usar el índice como posición X para garantizar el orden
            x: index,
            y: energiaGWh,
            anio: año,
            va: va,
            orden: index
          }
        })
        .filter((punto): punto is NonNullable<typeof punto> => punto !== null)
    },
    [resultados, añosSeleccionadosResultados, añosSeleccionadosVA]
  )

  const toggleAñoResultados = (año: number) => {
    setAñosSeleccionadosResultados((prev) =>
      prev.includes(año)
        ? prev.filter((a) => a !== año)
        : [...prev, año].sort((a, b) => b - a)
    )
  }

  const toggleAñoVA = (año: number) => {
    setAñosSeleccionadosVA((prev) =>
      prev.includes(año)
        ? prev.filter((a) => a !== año)
        : [...prev, año].sort((a, b) => b - a)
    )
  }

  return (
    <div className={styles.container}>
      {/* Selectores de años */}
      <div className={styles.yearSelectors}>
        <div className={styles.yearSelectorGroup}>
          <h3 className={styles.yearTitle}>
            Años de Consumo Energético
          </h3>
          <div className={styles.yearButtons}>
            {añosResultados.map((año) => (
              <button
                key={año}
                onClick={() => toggleAñoResultados(año)}
                className={`${styles.yearButton} ${
                  añosSeleccionadosResultados.includes(año) ? styles.yearButtonActive : ""
                }`}
              >
                {año}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.yearSelectorGroup}>
          <h3 className={styles.yearTitle}>
            Años de Valor Agregado
          </h3>
          <div className={styles.yearButtons}>
            {añosVA.map((año) => (
              <button
                key={año}
                onClick={() => toggleAñoVA(año)}
                className={`${styles.yearButton} ${
                  añosSeleccionadosVA.includes(año) ? styles.yearButtonActive : ""
                }`}
              >
                {año}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(añosSeleccionadosResultados.length > 0 || añosSeleccionadosVA.length > 0) ? (
        <div className={styles.chartsGrid}>
          {/* Gráfico de línea: Emisiones totales por año */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              Emisiones Totales por Año
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={datosEmisiones}
                margin={{ top: 20, right: 30, bottom: 40, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="anio" 
                  stroke="#6B7280"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#6B7280"
                  label={{
                    value: "tCO₂",
                    angle: -90,
                    position: "insideLeft",
                    offset: -45,
                    style: { fill: "#6B7280" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }}/>
                <Line
                  type="monotone"
                  dataKey="Total"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.primary }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de barras: Emisiones por fuente */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              Emisiones por Fuente
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={datosEmisiones}
                margin={{ top: 20, right: 30, bottom: 40, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="anio" 
                  stroke="#6B7280"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#6B7280"
                  label={{
                    value: "tCO₂",
                    angle: -90,
                    position: "insideLeft",
                    offset: -45,
                    style: { fill: "#6B7280" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }}/>
                <Bar dataKey="Electricidad" fill={CHART_COLORS[0]} />
                <Bar dataKey="Gas Natural" fill={CHART_COLORS[1]} />
                <Bar dataKey="GLP" fill={CHART_COLORS[2]} />
                <Bar dataKey="Carbón" fill={CHART_COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráficos de pastel: Composición del VA por año */}
          {datosVAPorAño.map(({ anio, datos }) => (
            <div key={anio} className={styles.chartCard}>
              <h3 className={styles.chartTitle}>
                Composición del Valor Agregado {anio} (%)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <Pie
                    data={datos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))
                      return percent > 0.05 ? (
                        <text
                          x={x}
                          y={y}
                          fill="#ffffff"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{ fontSize: "0.875rem", fontWeight: 500 }}
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      ) : null
                    }}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {datos.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.375rem",
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}

          {/* Gráfico de dispersión: Curva de Kuznets */}
          <div className={`${styles.chartCard} ${styles.fullWidth}`}>
            <h3 className={styles.chartTitle}>
              Curva Ambiental de Kuznets
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Año"
                  stroke="#6B7280"
                  label={{
                    value: "Año",
                    position: "bottom",
                    offset: 40,
                    style: { fill: "#6B7280", fontSize: 12 },
                  }}
                  tickFormatter={(value) => {
                    const punto = datosKuznets[value]
                    return punto ? punto.anio.toString() : ''
                  }}
                  ticks={datosKuznets.map((_, i) => i)}
                  domain={[0, datosKuznets.length - 1]}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Energía"
                  stroke="#6B7280"
                  label={{
                    value: "Consumo Energético (GWh)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -45,
                    style: { fill: "#6B7280", fontSize: 12 },
                  }}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: "12px",
                    padding: "8px",
                  }}
                  content={({ payload }) => {
                    if (!payload || !payload[0]) return null
                    const data = payload[0].payload
                    return (
                      <div className={styles.tooltipContent}>
                        <p className={styles.tooltipTitle}>Año: {data.anio}</p>
                        <p className={styles.tooltipValue}>VA: {data.va.toFixed(0)} MM COP</p>
                        <p className={styles.tooltipValue}>Energía: {data.y.toFixed(1)} GWh</p>
                      </div>
                    )
                  }}
                />
                <Scatter
                  name="Relación VA-Energía"
                  data={datosKuznets}
                  fill={COLORS.primary}
                  line={{
                    type: "linear",
                    stroke: COLORS.primary,
                    strokeWidth: 1
                  }}
                  shape={(props: { cx?: number; cy?: number }) => (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={6}
                      fill={COLORS.primary}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  )}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className={styles.noDataMessage}>
          Selecciona al menos un año para visualizar los gráficos
        </div>
      )}
    </div>
  )
} 
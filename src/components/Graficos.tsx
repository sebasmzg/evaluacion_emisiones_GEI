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

export function Graficos({ resultados, valoresAgregados }: GraficosProps) {
  const años = useMemo(
    () => [...new Set(resultados.map((r) => r.anio))].sort(),
    [resultados]
  )

  const [añosSeleccionados, setAñosSeleccionados] = useState<number[]>(años)

  useEffect(() => {
    setAñosSeleccionados(años)
  }, [años])

  const datosEmisiones = useMemo(
    () =>
      resultados
        .filter((r) => añosSeleccionados.includes(r.anio))
        .map((r) => ({
          anio: r.anio,
          Electricidad: Number(r.emisionesElectricidad.toFixed(2)),
          "Gas Natural": Number(r.emisionesGN.toFixed(2)),
          GLP: Number(r.emisionesGLP.toFixed(2)),
          Carbón: Number(r.emisionesCarbon.toFixed(2)),
          Total: Number(r.totalEmisiones.toFixed(2)),
        })),
    [resultados, añosSeleccionados]
  )

  const datosVAPorAño = useMemo(() => {
    return valoresAgregados
      .filter((va) => añosSeleccionados.includes(va.anio))
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
  }, [valoresAgregados, añosSeleccionados])

  const datosKuznets = useMemo(
    () =>
      resultados.map((r) => ({
        x: r.valorAgregadoTotal / 1e9,
        y: r.energiaTotalTJ,
        anio: r.anio,
      })),
    [resultados]
  )

  const toggleAño = (año: number) => {
    setAñosSeleccionados((prev) =>
      prev.includes(año)
        ? prev.filter((a) => a !== año)
        : [...prev, año].sort()
    )
  }

  return (
    <div className={styles.container}>
      {/* Selector de años */}
      <div className={styles.yearSelector}>
        <h3 className={styles.yearTitle}>
          Seleccionar Años
        </h3>
        <div className={styles.yearButtons}>
          {años.map((año) => (
            <button
              key={año}
              onClick={() => toggleAño(año)}
              className={`${styles.yearButton} ${
                añosSeleccionados.includes(año) ? styles.yearButtonActive : ""
              }`}
            >
              {año}
            </button>
          ))}
        </div>
      </div>

      {añosSeleccionados.length > 0 ? (
        <div className={styles.chartsGrid}>
          {/* Gráfico de línea: Emisiones totales por año */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              Emisiones Totales por Año
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosEmisiones}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="anio" stroke="#6B7280" />
                <YAxis
                  stroke="#6B7280"
                  label={{
                    value: "tCO₂",
                    angle: -90,
                    position: "insideLeft",
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
                <Legend />
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
              <BarChart data={datosEmisiones}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="anio" stroke="#6B7280" />
                <YAxis
                  stroke="#6B7280"
                  label={{
                    value: "tCO₂",
                    angle: -90,
                    position: "insideLeft",
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
                <Legend />
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
                <PieChart>
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
                    {datos.map((entry, index) => (
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
                    formatter={(value: string) => (
                      <span style={{ color: "#374151", fontSize: "0.875rem" }}>
                        {value}
                      </span>
                    )}
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
                  name="VA"
                  stroke="#6B7280"
                  label={{
                    value: "VA (MM COP)",
                    position: "bottom",
                    offset: 40,
                    style: { fill: "#6B7280", fontSize: 12 },
                  }}
                  tickFormatter={(value) => value.toFixed(0)}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Energía"
                  stroke="#6B7280"
                  label={{
                    value: "Energía (TJ)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -45,
                    style: { fill: "#6B7280", fontSize: 12 },
                  }}
                  tickFormatter={(value) => value.toFixed(0)}
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
                        <p className={styles.tooltipValue}>VA: {data.x.toFixed(0)} MM COP</p>
                        <p className={styles.tooltipValue}>Energía: {data.y.toFixed(0)} TJ</p>
                      </div>
                    )
                  }}
                />
                <Scatter
                  name="Relación VA-Energía"
                  data={datosKuznets}
                  fill={COLORS.primary}
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
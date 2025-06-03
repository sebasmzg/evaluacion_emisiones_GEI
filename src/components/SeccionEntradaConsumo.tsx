import { useState } from "react"
import type { ConsumoEnergetico } from "../models/interfaces"
import { CONSUMOS_PRECARGADOS } from "../data/consumos"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { FE_SIN_ANUAL } from "../data/feSIN"
import { FACTORES_COMBUSTIBLES } from "../data/factoresCombustibles"
import styles from "./SeccionEntradaConsumo.module.css"

export function SeccionEntradaConsumo() {
  const [consumos, setConsumos] = useState<ConsumoEnergetico[]>(CONSUMOS_PRECARGADOS)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string, field: keyof ConsumoEnergetico, value: number) => {
    setConsumos(
      consumos.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    )
  }

  const handleDelete = (id: string) => {
    setConsumos(consumos.filter((c) => c.id !== id))
  }

  const handleAdd = () => {
    const currentYear = new Date().getFullYear()
    const defaultFE = 0.2
    
    // Verificar si el año existe en FE_SIN_ANUAL y usar el valor más reciente si no existe
    const fe = Object.entries(FE_SIN_ANUAL)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))[0][1]
    
    const newConsumo: ConsumoEnergetico = {
      id: crypto.randomUUID(),
      anio: currentYear,
      electricidad_kWh: 0,
      gas_natural_m3: 0,
      glp_kg: 0,
      carbon_kg: 0,
      fe_sin_kgCO2kWh: fe || defaultFE,
    }
    setConsumos([...consumos, newConsumo])
    setEditingId(newConsumo.id)
  }

  const calcularEmisionesTotales = (consumo: ConsumoEnergetico) => {
    const emisionesElectricidad = (consumo.electricidad_kWh * consumo.fe_sin_kgCO2kWh) / 1000;
    const emisionesGN = FACTORES_COMBUSTIBLES.GasNatural.pci * consumo.gas_natural_m3 * FACTORES_COMBUSTIBLES.GasNatural.fe * 1e-9;
    const emisionesGLP = FACTORES_COMBUSTIBLES.GLP.pci * consumo.glp_kg * FACTORES_COMBUSTIBLES.GLP.fe * 1e-9;
    const emisionesCarbon = FACTORES_COMBUSTIBLES.Carbon.pci * consumo.carbon_kg * FACTORES_COMBUSTIBLES.Carbon.fe * 1e-9;
    return (emisionesElectricidad + emisionesGN + emisionesGLP + emisionesCarbon).toFixed(2);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Consumo Energético</h2>
      <p className={styles.description}>
        Ingrese los datos de consumo energético por año
      </p>

      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Año</TableHead>
              <TableHead>Electricidad (kWh)</TableHead>
              <TableHead>Gas Natural (m³)</TableHead>
              <TableHead>GLP (kg)</TableHead>
              <TableHead>Carbón (kg)</TableHead>
              <TableHead>FE SIN (kgCO₂/kWh)</TableHead>
              <TableHead>Emisiones Totales (tCO₂)</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consumos.map((consumo) => (
              <TableRow key={consumo.id}>
                <TableCell>
                  {editingId === consumo.id ? (
                    <Input
                      type="number"
                      value={consumo.anio}
                      onChange={(e) =>
                        handleSave(consumo.id, "anio", Number(e.target.value))
                      }
                    />
                  ) : (
                    consumo.anio
                  )}
                </TableCell>
                <TableCell>
                  {editingId === consumo.id ? (
                    <Input
                      type="number"
                      value={consumo.electricidad_kWh}
                      onChange={(e) =>
                        handleSave(
                          consumo.id,
                          "electricidad_kWh",
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    consumo.electricidad_kWh.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  {editingId === consumo.id ? (
                    <Input
                      type="number"
                      value={consumo.gas_natural_m3}
                      onChange={(e) =>
                        handleSave(
                          consumo.id,
                          "gas_natural_m3",
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    consumo.gas_natural_m3.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  {editingId === consumo.id ? (
                    <Input
                      type="number"
                      value={consumo.glp_kg}
                      onChange={(e) =>
                        handleSave(consumo.id, "glp_kg", Number(e.target.value))
                      }
                    />
                  ) : (
                    consumo.glp_kg.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  {editingId === consumo.id ? (
                    <Input
                      type="number"
                      value={consumo.carbon_kg}
                      onChange={(e) =>
                        handleSave(consumo.id, "carbon_kg", Number(e.target.value))
                      }
                    />
                  ) : (
                    consumo.carbon_kg.toLocaleString()
                  )}
                </TableCell>
                <TableCell>{consumo.fe_sin_kgCO2kWh}</TableCell>
                <TableCell>{calcularEmisionesTotales(consumo)}</TableCell>
                <TableCell>
                  <div className={styles.actionCell}>
                    {editingId === consumo.id ? (
                      <button
                        onClick={() => setEditingId(null)}
                        className={styles.editButton}
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(consumo.id)}
                        className={styles.editButton}
                      >
                        Editar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(consumo.id)}
                      className={styles.deleteButton}
                    >
                      Eliminar
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={handleAdd} className={styles.addButton}>
        Agregar Consumo
      </Button>
    </div>
  )
} 
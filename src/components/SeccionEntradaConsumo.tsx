import { useState, useMemo } from "react"
import type { ConsumoEnergetico } from "../models/interfaces"
import { FE_SIN_ANUAL } from "../data/feSIN"
import { FACTORES_COMBUSTIBLES } from "../data/factoresCombustibles"
import { CONSUMOS_PRECARGADOS } from "../data/consumos"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ActionButtons } from "./ui/ActionButtons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import styles from "./SeccionEntradaConsumo.module.css"

type SortField = 'anio' | 'electricidad_kWh' | 'gas_natural_m3' | 'glp_kg' | 'carbon_kg' | 'fe_sin_kgCO2kWh'
type SortOrder = 'asc' | 'desc'

interface SeccionEntradaConsumoProps {
  consumos: ConsumoEnergetico[]
  onConsumosChange: (consumos: ConsumoEnergetico[]) => void
}

export function SeccionEntradaConsumo({ consumos, onConsumosChange }: SeccionEntradaConsumoProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchYear, setSearchYear] = useState("")
  const [sortConfig, setSortConfig] = useState<{field: SortField, order: SortOrder}>({
    field: 'anio',
    order: 'desc'
  })

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }))
  }

  const filteredAndSortedConsumos = useMemo(() => {
    return [...consumos]
      .filter(consumo => 
        searchYear === "" || 
        consumo.anio.toString().includes(searchYear)
      )
      .sort((a, b) => {
        const multiplier = sortConfig.order === 'asc' ? 1 : -1
        return (a[sortConfig.field] - b[sortConfig.field]) * multiplier
      })
  }, [consumos, searchYear, sortConfig])

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string, field: keyof ConsumoEnergetico, value: number) => {
    const newConsumos = consumos.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    ).sort((a, b) => b.anio - a.anio)
    
    onConsumosChange(newConsumos)
  }

  const handleDelete = (id: string) => {
    const newConsumos = consumos
      .filter((c) => c.id !== id)
      .sort((a, b) => b.anio - a.anio)
    
    onConsumosChange(newConsumos)
  }

  const handleAdd = () => {
    const currentYear = new Date().getFullYear()
    const defaultFE = 0.2
    
    // Obtener el factor de emisión más reciente
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
    
    const newConsumos = [...consumos, newConsumo].sort((a, b) => b.anio - a.anio)
    onConsumosChange(newConsumos)
    setEditingId(newConsumo.id)
  }

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return '↕️'
    return sortConfig.order === 'asc' ? '↑' : '↓'
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

      <div className={styles.searchContainer}>
        <Input
          type="text"
          placeholder="Buscar por año..."
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button 
                  onClick={() => handleSort('anio')}
                  className={styles.sortButton}
                >
                  Año {getSortIcon('anio')}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('electricidad_kWh')}
                  className={styles.sortButton}
                >
                  Electricidad (kWh) {getSortIcon('electricidad_kWh')}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('gas_natural_m3')}
                  className={styles.sortButton}
                >
                  Gas Natural (m³) {getSortIcon('gas_natural_m3')}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('glp_kg')}
                  className={styles.sortButton}
                >
                  GLP (kg) {getSortIcon('glp_kg')}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('carbon_kg')}
                  className={styles.sortButton}
                >
                  Carbón (kg) {getSortIcon('carbon_kg')}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('fe_sin_kgCO2kWh')}
                  className={styles.sortButton}
                >
                  FE SIN (kgCO₂/kWh) {getSortIcon('fe_sin_kgCO2kWh')}
                </button>
              </TableHead>
              <TableHead>Emisiones Totales (tCO₂)</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedConsumos.map((consumo) => (
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
                <TableCell>
                  {editingId === consumo.id ? (
                    <Input
                      type="number"
                      value={consumo.fe_sin_kgCO2kWh}
                      onChange={(e) =>
                        handleSave(
                          consumo.id,
                          "fe_sin_kgCO2kWh",
                          Number(e.target.value)
                        )
                      }
                      step="0.001"
                    />
                  ) : (
                    consumo.fe_sin_kgCO2kWh
                  )}
                </TableCell>
                <TableCell>{calcularEmisionesTotales(consumo)}</TableCell>
                <TableCell>
                  <ActionButtons
                    isEditing={editingId === consumo.id}
                    onEdit={() => editingId === consumo.id ? setEditingId(null) : handleEdit(consumo.id)}
                    onDelete={() => handleDelete(consumo.id)}
                  />
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
import { useState, useMemo } from "react"
import type { ValorAgregado } from "../models/interfaces"
import { VA_PRECARGADO } from "../data/valorAgregado"
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
import styles from "./SeccionEntradaValorAgregado.module.css"

type SortField = 'anio' | 'primario_COP' | 'secundario_COP' | 'terciario_COP'
type SortOrder = 'asc' | 'desc'

interface SeccionEntradaValorAgregadoProps {
  valoresAgregados: ValorAgregado[]
  onValoresAgregadosChange: (valoresAgregados: ValorAgregado[]) => void
}

export function SeccionEntradaValorAgregado({ 
  valoresAgregados, 
  onValoresAgregadosChange 
}: SeccionEntradaValorAgregadoProps) {
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

  const filteredAndSortedValores = useMemo(() => {
    return [...valoresAgregados]
      .filter(valor => 
        searchYear === "" || 
        valor.anio.toString().includes(searchYear)
      )
      .sort((a, b) => {
        const multiplier = sortConfig.order === 'asc' ? 1 : -1
        return (a[sortConfig.field] - b[sortConfig.field]) * multiplier
      })
  }, [valoresAgregados, searchYear, sortConfig])

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string, field: keyof ValorAgregado, value: number) => {
    const newValores = valoresAgregados
      .map((va) => va.id === id ? { ...va, [field]: value } : va)
      .sort((a, b) => b.anio - a.anio)
    
    onValoresAgregadosChange(newValores)
  }

  const handleDelete = (id: string) => {
    const newValores = valoresAgregados
      .filter((va) => va.id !== id)
      .sort((a, b) => b.anio - a.anio)
    
    onValoresAgregadosChange(newValores)
  }

  const handleAdd = () => {
    const newValor: ValorAgregado = {
      id: crypto.randomUUID(),
      anio: new Date().getFullYear(),
      primario_COP: 0,
      secundario_COP: 0,
      terciario_COP: 0,
    }
    
    const newValores = [...valoresAgregados, newValor].sort((a, b) => b.anio - a.anio)
    onValoresAgregadosChange(newValores)
    setEditingId(newValor.id)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Valor Agregado por Sector</h2>
      <p className={styles.description}>
        Ingrese los datos de valor agregado por sector y año
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
                  Año {sortConfig.field === 'anio' ? (sortConfig.order === 'asc' ? '↑' : '↓') : '↕️'}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('primario_COP')}
                  className={styles.sortButton}
                >
                  Primario (COP) {sortConfig.field === 'primario_COP' ? (sortConfig.order === 'asc' ? '↑' : '↓') : '↕️'}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('secundario_COP')}
                  className={styles.sortButton}
                >
                  Secundario (COP) {sortConfig.field === 'secundario_COP' ? (sortConfig.order === 'asc' ? '↑' : '↓') : '↕️'}
                </button>
              </TableHead>
              <TableHead>
                <button 
                  onClick={() => handleSort('terciario_COP')}
                  className={styles.sortButton}
                >
                  Terciario (COP) {sortConfig.field === 'terciario_COP' ? (sortConfig.order === 'asc' ? '↑' : '↓') : '↕️'}
                </button>
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedValores.map((valor) => (
              <TableRow key={valor.id}>
                <TableCell>
                  {editingId === valor.id ? (
                    <Input
                      type="number"
                      value={valor.anio}
                      onChange={(e) =>
                        handleSave(valor.id, "anio", Number(e.target.value))
                      }
                    />
                  ) : (
                    valor.anio
                  )}
                </TableCell>
                <TableCell>
                  {editingId === valor.id ? (
                    <Input
                      type="number"
                      value={valor.primario_COP}
                      onChange={(e) =>
                        handleSave(
                          valor.id,
                          "primario_COP",
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    valor.primario_COP.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  {editingId === valor.id ? (
                    <Input
                      type="number"
                      value={valor.secundario_COP}
                      onChange={(e) =>
                        handleSave(
                          valor.id,
                          "secundario_COP",
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    valor.secundario_COP.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  {editingId === valor.id ? (
                    <Input
                      type="number"
                      value={valor.terciario_COP}
                      onChange={(e) =>
                        handleSave(
                          valor.id,
                          "terciario_COP",
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    valor.terciario_COP.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  <ActionButtons
                    isEditing={editingId === valor.id}
                    onEdit={() => editingId === valor.id ? setEditingId(null) : handleEdit(valor.id)}
                    onDelete={() => handleDelete(valor.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={handleAdd} className={styles.addButton}>
        Agregar Valor Agregado
      </Button>
    </div>
  )
} 
import { useState } from "react"
import type { ValorAgregado } from "../models/interfaces"
import { VA_PRECARGADO } from "../data/valorAgregado"
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
import styles from "./SeccionEntradaValorAgregado.module.css"

export function SeccionEntradaValorAgregado() {
  const [valoresAgregados, setValoresAgregados] = useState<ValorAgregado[]>(VA_PRECARGADO)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string, field: keyof ValorAgregado, value: number) => {
    setValoresAgregados(
      valoresAgregados.map((va) =>
        va.id === id ? { ...va, [field]: value } : va
      )
    )
  }

  const handleDelete = (id: string) => {
    setValoresAgregados(valoresAgregados.filter((va) => va.id !== id))
  }

  const handleAdd = () => {
    const newValor: ValorAgregado = {
      id: crypto.randomUUID(),
      anio: new Date().getFullYear(),
      primario_COP: 0,
      secundario_COP: 0,
      terciario_COP: 0,
    }
    setValoresAgregados([...valoresAgregados, newValor])
    setEditingId(newValor.id)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Valor Agregado por Sector</h2>
      <p className={styles.description}>
        Ingrese los datos de valor agregado por sector y año
      </p>

      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Año</TableHead>
              <TableHead>Primario (COP)</TableHead>
              <TableHead>Secundario (COP)</TableHead>
              <TableHead>Terciario (COP)</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {valoresAgregados.map((valor) => (
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
                  <div className={styles.actionCell}>
                    {editingId === valor.id ? (
                      <button
                        onClick={() => setEditingId(null)}
                        className={styles.editButton}
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(valor.id)}
                        className={styles.editButton}
                      >
                        Editar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(valor.id)}
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
        Agregar Valor Agregado
      </Button>
    </div>
  )
} 
import styles from "./action-buttons.module.css"

interface ActionButtonsProps {
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
}

export function ActionButtons({ isEditing, onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className={styles.container}>
      <button
        onClick={onEdit}
        className={isEditing ? styles.saveButton : styles.editButton}
      >
        {isEditing ? "Guardar" : "Editar"}
      </button>
      <button
        onClick={onDelete}
        className={styles.deleteButton}
      >
        Eliminar
      </button>
    </div>
  )
} 
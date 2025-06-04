import type { HTMLAttributes } from "react"
import styles from "./table.module.css"

interface TableProps extends HTMLAttributes<HTMLTableElement> {}
interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}
interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}
interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {}
interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {}

const Table = ({ className, ...props }: TableProps) => (
  <table
    className={className ? `${styles.table} ${className}` : styles.table}
    {...props}
  />
)

const TableHeader = ({ className, ...props }: TableHeaderProps) => (
  <thead
    className={className ? `${styles.tableHeader} ${className}` : styles.tableHeader}
    {...props}
  />
)

const TableBody = ({ className, ...props }: TableBodyProps) => (
  <tbody
    className={className ? `${styles.tableBody} ${className}` : styles.tableBody}
    {...props}
  />
)

const TableRow = ({ className, ...props }: TableRowProps) => (
  <tr
    className={className ? `${styles.tableRow} ${className}` : styles.tableRow}
    {...props}
  />
)

const TableHead = ({ className, ...props }: TableHeadProps) => (
  <th
    className={className ? `${styles.tableHeaderCell} ${className}` : styles.tableHeaderCell}
    {...props}
  />
)

const TableCell = ({ className, ...props }: TableCellProps) => (
  <td
    className={className ? `${styles.tableCell} ${className}` : styles.tableCell}
    {...props}
  />
)

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} 
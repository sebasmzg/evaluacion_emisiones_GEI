import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"
import styles from "./input.module.css"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={className ? `${styles.input} ${className}` : styles.input}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input } 
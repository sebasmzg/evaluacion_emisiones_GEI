import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"
import styles from "./button.module.css"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  isFullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isFullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const classes = [
      styles.button,
      variant === "default" && styles.primary,
      variant === "secondary" && styles.secondary,
      variant === "outline" && styles.outline,
      variant === "ghost" && styles.ghost,
      size === "sm" && styles.small,
      size === "lg" && styles.large,
      isFullWidth && styles.fullWidth,
      disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <button
        className={className ? `${classes} ${className}` : classes}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button } 
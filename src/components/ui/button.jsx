import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import "./button.css"

const sizeClassMap = {
  default: "ui-btn--md",
  sm: "ui-btn--sm",
  lg: "ui-btn--lg",
  icon: "ui-btn--icon",
}

const variantClassMap = {
  default: "ui-btn--primary",
  destructive: "ui-btn--danger",
  outline: "ui-btn--outline",
  secondary: "ui-btn--secondary",
  ghost: "ui-btn--ghost",
  link: "ui-btn--link",
}

function buttonVariants({ variant = "default", size = "default", className = "" } = {}) {
  const sizeClass = sizeClassMap[size] || sizeClassMap.default
  const variantClass = variantClassMap[variant] || variantClassMap.default
  return `ui-btn ${sizeClass} ${variantClass}${className ? ` ${className}` : ""}`
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props} />
  );
}

export { Button, buttonVariants }

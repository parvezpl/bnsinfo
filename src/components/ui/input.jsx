import * as React from "react"
import "./input.css"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`ui-input${className ? ` ${className}` : ""}`}
      {...props} />
  );
}

export { Input }

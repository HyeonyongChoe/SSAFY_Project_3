import { cn } from "@/shared/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "default", className, ...props }, ref) => {
    const base = "py-2 px-4 rounded font-semibold transition-colors"
    const variants = {
      default: "bg-blue-500 hover:bg-blue-600 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      destructive: "bg-red-500 hover:bg-red-600 text-white",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <h3 className="font-medium">Erscheinungsbild</h3>
        <p className="text-sm text-muted-foreground">
          Wähle zwischen Light und Dark Mode
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </div>
  )
}

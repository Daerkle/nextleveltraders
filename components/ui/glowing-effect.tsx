"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlowingEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function GlowingEffect({ 
  children,
  className,
  ...props
}: GlowingEffectProps) {
  return (
    <div
      className={cn(
        "relative",
        className
      )}
      {...props}
    >
      {/* Glowing Background */}
      <div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-primary/30 opacity-75 blur-lg group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

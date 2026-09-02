"use client"

import { useEffect, type ReactNode } from "react"

export default function SearchProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const input = document.getElementById("global-search-input")
        if (input) {
          input.focus();
        }
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return <>{children}</>
}

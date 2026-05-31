"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")

  useEffect(() => {
    const saved = localStorage.getItem("six-theme") as Theme | null
    const initial = saved ?? "dark"
    setThemeState(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
  }, [])

  const applyTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem("six-theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }, [])

  const toggle = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark")
  }, [theme, applyTheme])

  const setTheme = useCallback(
    (t: Theme) => {
      applyTheme(t)
    },
    [applyTheme]
  )

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

/**
 * Renders a square icon button that toggles the application's theme.
 *
 * The button shows a Sun icon when the current theme is `"dark"` and a Moon icon otherwise.
 * Its title is `"Light mode"` when the theme is dark and `"Dark mode"` otherwise.
 *
 * @returns A JSX element — a button that toggles the current theme when clicked.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#E8E8E8] dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:bg-[#F5F5F7] dark:hover:bg-[#111] hover:text-[#1A1A1A] dark:hover:text-white dark:text-white dark:hover:text-white transition-all"
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  )
}

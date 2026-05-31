import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SIX Knowledge Hub',
  description: 'AI-enabled organizational knowledge management platform',
}

/**
 * Root layout component that defines the document HTML/body, applies the Inter font variable to the body class, injects a small script to apply a saved theme before first paint, and wraps the page content with the ThemeProvider.
 *
 * @param children - Page content to render inside the ThemeProvider.
 * @returns The top-level HTML structure for the application containing the themed body and provided children.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-white dark:bg-black`}>
        {/* Apply saved theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{const t=localStorage.getItem('six-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

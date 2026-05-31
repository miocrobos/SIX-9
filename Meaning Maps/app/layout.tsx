import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Six Sense",
  description:
    "Your company's brain — turn documents and expertise into living knowledge maps.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "var(--color-bg-base)",
          colorNeutral: "var(--color-text-primary)",
          colorPrimary: "var(--color-accent-primary)",
          colorPrimaryForeground: "#ffffff",
          colorForeground: "var(--color-text-primary)",
          colorInput: "var(--color-bg-elevated)",
          colorInputForeground: "var(--color-text-primary)",
          colorDanger: "var(--color-state-error)",
          colorSuccess: "var(--color-state-success)",
          colorWarning: "var(--color-state-warning)",
          borderRadius: "var(--radius)",
          fontFamily: "var(--font-geist-sans)",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        {/* Prevent flash of wrong theme by applying saved preference before first paint */}
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var t=localStorage.getItem('six-theme');if(t==='dark'||!t)document.documentElement.classList.add('dark')}catch(e){}})()`,
            }}
          />
        </head>
        <body className="min-h-full flex flex-col">
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

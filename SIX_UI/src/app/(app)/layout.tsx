import AppHeader from '@/components/AppHeader'
import AIChatbox from '@/components/AIChatbox'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#F7F8FC] dark:bg-black text-[#1A1A1A] dark:text-white"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <AppHeader />
      <main>
        {children}
      </main>
      <AIChatbox />
    </div>
  )
}

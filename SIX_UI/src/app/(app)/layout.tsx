import AppHeader from '@/components/AppHeader'
import AIChatbox from '@/components/AIChatbox'
import MobileNav from '@/components/MobileNav'

/**
 * Root layout that wraps page content with the app header, main content area, AI chatbox, and mobile navigation.
 *
 * @param children - The page content to render inside the layout's main area; mobile bottom padding is applied to avoid overlapping the fixed navigation.
 * @returns The root JSX element that provides global background, typography, header, main content container, AI chatbox, and mobile navigation.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#F7F8FC] dark:bg-black text-[#1A1A1A] dark:text-white"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <AppHeader />
      {/* pb-16 on mobile clears the fixed bottom nav bar */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <AIChatbox />
      <MobileNav />
    </div>
  )
}

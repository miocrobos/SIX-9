import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AppNavbar } from "@/components/app-navbar"

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      <AppNavbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

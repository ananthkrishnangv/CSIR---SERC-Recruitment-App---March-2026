import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { adminPrisma } from "@/lib/prisma"
import { SettingsForm } from "./settings-form"

export default async function AdminSettings() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const logoSetting = await adminPrisma.setting.findUnique({
    where: { key: "portal_logo" }
  })

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Portal Settings</h1>
        <p className="text-slate-500">Manage global portal configuration and branding.</p>
      </div>

      <SettingsForm initialLogo={logoSetting?.value || ""} />
    </div>
  )
}

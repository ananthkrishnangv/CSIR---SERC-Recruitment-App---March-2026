import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "./profile-form"

export default async function ApplicantProfile() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  })

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your personal information and preferences.</p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  )
}

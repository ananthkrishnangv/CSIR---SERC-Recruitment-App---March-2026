import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ApplicationScrutinyTable } from "./scrutiny-table"

export default async function AdminJobApplications({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId }
  })

  if (!job) {
    return <div>Job not found</div>
  }

  const applications = await prisma.application.findMany({
    where: { jobId: jobId },
    include: {
      user: {
        include: { profile: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Applications for {job.code}</h1>
        <p className="text-slate-500">{job.title}</p>
      </div>

      <ApplicationScrutinyTable applications={applications} jobId={job.id} />
    </div>
  )
}

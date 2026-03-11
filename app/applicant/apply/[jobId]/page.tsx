import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ApplyForm } from "./apply-form"

export default async function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/login?callbackUrl=/applicant/apply/${jobId}`)
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId }
  })

  if (!job) {
    return <div>Job not found</div>
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  })

  let application = await prisma.application.findUnique({
    where: {
      userId_jobId: {
        userId: session.user.id,
        jobId: jobId
      }
    }
  })

  if (!application) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appNo = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    // Create draft application
    application = await prisma.application.create({
      data: {
        userId: session.user.id,
        jobId: jobId,
        applicationNo: appNo,
        status: "DRAFT",
        step: 1,
        personalDetails: JSON.stringify({
          name: profile?.user.name,
          phone: profile?.phone,
          dob: profile?.dob,
          gender: profile?.gender,
          category: profile?.category,
        }),
        educationDetails: profile?.educationDetails ? JSON.stringify({ summary: profile.educationDetails }) : null,
        experienceDetails: profile?.experienceDetails ? JSON.stringify({ summary: profile.experienceDetails }) : null,
      }
    })
  }

  if (application.status !== "DRAFT") {
    redirect("/applicant/dashboard")
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Apply for {job.title}</h1>
        <p className="text-slate-500">Job Code: {job.code}</p>
      </div>

      <ApplyForm application={application} job={job} />
    </div>
  )
}

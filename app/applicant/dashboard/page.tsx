import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, User, Clock, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

export default async function ApplicantDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: { job: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Applicant Dashboard</h1>
          <p className="text-slate-500">Welcome back, {session.user.name || session.user.email}</p>
        </div>
        <div className="flex gap-4">
          <Link href="/applicant/profile">
            <Button variant="outline">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Button>
          </Link>
          <Link href="/jobs">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter(a => a.status === "DRAFT").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Submitted</CardTitle>
            <CheckCircle className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter(a => a.status !== "DRAFT").length}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-xl font-semibold text-slate-900">My Applications</h2>
      
      {applications.length === 0 ? (
        <Card className="p-12 text-center">
          <CardTitle className="mb-2">No Applications Yet</CardTitle>
          <CardDescription>You haven&apos;t applied to any jobs yet. Browse open positions to get started.</CardDescription>
          <div className="mt-6">
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{app.job.title}</h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                      {app.job.code}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Application No: {app.applicationNo} • Applied on {format(new Date(app.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {app.status === "DRAFT" && <Clock className="h-4 w-4 text-amber-500" />}
                    {app.status === "SUBMITTED" && <CheckCircle className="h-4 w-4 text-blue-500" />}
                    {app.status === "UNDER_REVIEW" && <Clock className="h-4 w-4 text-indigo-500" />}
                    {app.status === "SHORTLISTED_FOR_TEST" && <CheckCircle className="h-4 w-4 text-purple-500" />}
                    {app.status === "REJECTED" && <XCircle className="h-4 w-4 text-red-500" />}
                    {app.status === "SELECTED" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    <span className="text-sm font-medium">
                      {app.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <Link href={`/applicant/apply/${app.jobId}`}>
                    <Button variant={app.status === "DRAFT" ? "default" : "outline"} size="sm">
                      {app.status === "DRAFT" ? "Continue" : "View"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

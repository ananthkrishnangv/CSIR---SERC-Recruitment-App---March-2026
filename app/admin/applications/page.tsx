import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

export default async function AdminApplicationsOverview() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const jobs = await prisma.job.findMany({
    include: {
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Application Scrutiny</h1>
        <p className="text-slate-500">Select a job to view and manage applications.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                  {job.code}
                </span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {job.status}
                </span>
              </div>
              <CardTitle className="line-clamp-2">{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
                <span>Total Applications:</span>
                <span className="font-bold text-slate-900">{job._count.applications}</span>
              </div>
              <Link href={`/admin/applications/${job.id}`} className="w-full">
                <Button className="w-full" variant="outline">View Applications</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

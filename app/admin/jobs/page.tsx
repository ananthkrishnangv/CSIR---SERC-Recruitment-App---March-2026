import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Plus } from "lucide-react"

export default async function AdminJobsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const jobs = await prisma.job.findMany({
    include: { reservations: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Jobs</h1>
          <p className="text-slate-500">Create and edit job postings.</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Closing Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">No jobs found.</td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="border-b border-slate-200 bg-white hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{job.code}</td>
                      <td className="px-6 py-4">{job.title}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {job.reservations?.map(res => (
                            <span key={res.id} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                              {res.category} ({res.vacancies})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 
                          job.status === 'CLOSED' ? 'bg-red-100 text-red-800' : 
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{format(new Date(job.closeDate), "MMM d, yyyy")}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

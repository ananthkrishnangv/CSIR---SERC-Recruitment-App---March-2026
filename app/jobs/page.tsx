import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { JobFilters } from "./job-filters"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined
  const lab = typeof resolvedSearchParams.lab === "string" ? resolvedSearchParams.lab : undefined
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1
  const limit = 9

  const where: any = { status: "OPEN" }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { code: { contains: q } },
    ]
  }

  if (category) {
    where.reservations = {
      some: {
        category: category
      }
    }
  }

  if (lab) {
    where.lab = lab
  }

  const [jobs, totalJobs] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        reservations: true
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.job.count({ where }),
  ])

  const totalPages = Math.ceil(totalJobs / limit)

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Open Positions</h1>
        <p className="mt-2 text-lg text-slate-600">Browse and apply for current vacancies at CSIR-SERC.</p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <JobFilters />
        </div>

        {/* Job Listings */}
        <div className="w-full md:w-3/4">
          {jobs.length === 0 ? (
            <Card className="p-12 text-center">
              <CardTitle className="mb-2">No Open Positions</CardTitle>
              <CardDescription>There are currently no open positions matching your criteria. Please check back later.</CardDescription>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <Card key={job.id} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                        {job.code}
                      </span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {job.reservations?.map(res => (
                          <span key={res.id} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {res.category} ({res.vacancies})
                          </span>
                        ))}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{job.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{job.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <p className="font-medium text-slate-900">Max Age</p>
                        <p>{job.maxAge} years</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Vacancies</p>
                        <p>{job.vacancies}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium text-slate-900">Closing Date</p>
                        <p>{format(new Date(job.closeDate), "PPP")}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/jobs/${job.id}`} className="w-full">
                      <Button className="w-full">View Details & Apply</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/jobs?page=${i + 1}${q ? `&q=${q}` : ""}${category ? `&category=${category}` : ""}${lab ? `&lab=${lab}` : ""}`}
                >
                  <Button variant={page === i + 1 ? "default" : "outline"} size="sm">
                    {i + 1}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

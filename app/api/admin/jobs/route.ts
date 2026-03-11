import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { reservations, ...jobData } = data
    
    const job = await prisma.job.create({
      data: {
        ...jobData,
        openDate: new Date(jobData.openDate),
        closeDate: new Date(jobData.closeDate),
        crucialDate: new Date(jobData.crucialDate),
        reservations: {
          create: reservations || []
        }
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error: any) {
    console.error("Create job error:", error)
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Job code already exists" }, { status: 400 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: { reservations: true }
    })

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Get job error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { reservations, ...jobData } = data
    
    // First delete existing reservations
    await prisma.jobReservation.deleteMany({
      where: { jobId: id }
    })

    // Then update job and create new reservations
    const job = await prisma.job.update({
      where: { id },
      data: {
        ...jobData,
        openDate: new Date(jobData.openDate),
        closeDate: new Date(jobData.closeDate),
        crucialDate: new Date(jobData.crucialDate),
        reservations: {
          create: reservations || []
        }
      },
      include: { reservations: true }
    })

    return NextResponse.json(job)
  } catch (error: any) {
    console.error("Update job error:", error)
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Job code already exists" }, { status: 400 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await prisma.job.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Delete job error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

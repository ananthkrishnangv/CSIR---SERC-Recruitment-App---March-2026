import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const application = await prisma.application.update({
      where: { 
        id: id,
        userId: session.user.id
      },
      data: {
        status: "SUBMITTED",
        step: 7
      },
    })

    await prisma.auditLog.create({
      data: {
        applicationId: application.id,
        action: "Application Submitted",
        performedBy: session.user.id,
      }
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error("Submit application error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

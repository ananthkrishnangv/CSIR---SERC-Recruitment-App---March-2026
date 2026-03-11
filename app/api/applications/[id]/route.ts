import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    
    const application = await prisma.application.update({
      where: { 
        id: id,
        userId: session.user.id // Ensure user owns the application
      },
      data,
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error("Update application error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

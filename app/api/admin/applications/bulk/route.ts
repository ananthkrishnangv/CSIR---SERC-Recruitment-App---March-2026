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

    const { applicationIds, status } = await req.json()

    if (!applicationIds || !Array.isArray(applicationIds) || !status) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 })
    }

    // Update statuses
    await prisma.application.updateMany({
      where: { id: { in: applicationIds } },
      data: { status },
    })

    // Create audit logs
    const auditLogs = applicationIds.map(appId => ({
      applicationId: appId,
      action: `Status updated to ${status}`,
      performedBy: session.user.id,
      notes: "Bulk action via admin portal"
    }))

    await prisma.auditLog.createMany({
      data: auditLogs
    })

    return NextResponse.json({ message: "Applications updated successfully" })
  } catch (error) {
    console.error("Bulk update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { adminPrisma } from "@/lib/prisma"

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { key, value } = await req.json()

    if (!key) {
      return NextResponse.json({ message: "Key is required" }, { status: 400 })
    }

    const setting = await adminPrisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })

    return NextResponse.json({ message: "Setting updated", setting })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { name, dob, ...profileData } = data

    // Update User
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    })

    // Update Profile
    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        ...profileData,
        dob: dob ? new Date(dob) : null,
      },
    })

    return NextResponse.json({ message: "Profile updated" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

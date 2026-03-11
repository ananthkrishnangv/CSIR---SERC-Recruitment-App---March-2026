"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <div className="relative h-10 w-32">
              <Image src={logoUrl} alt="Portal Logo" fill className="object-contain object-left" unoptimized />
            </div>
          ) : (
            <span className="text-xl font-bold tracking-tight text-indigo-900">CSIR-SERC</span>
          )}
          <span className="hidden text-sm font-medium text-slate-500 md:inline-block">Recruitment Portal</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/jobs" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
            Jobs
          </Link>
          {session ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                  Admin
                </Link>
              )}
              <Link href="/applicant/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

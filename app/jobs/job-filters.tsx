"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [q, setQ] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [lab, setLab] = useState(searchParams.get("lab") || "")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setQ(searchParams.get("q") || "")
    setCategory(searchParams.get("category") || "")
    setLab(searchParams.get("lab") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (category) params.set("category", category)
    if (lab) params.set("lab", lab)
    
    router.push(`/jobs?${params.toString()}`)
  }

  const clearFilters = () => {
    setQ("")
    setCategory("")
    setLab("")
    router.push("/jobs")
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q">Search Keywords</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                id="q"
                placeholder="Job title, code..."
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Reservation Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="UR">UR</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lab">Location / Lab</Label>
            <select
              id="lab"
              value={lab}
              onChange={(e) => setLab(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Labs</option>
              <option value="CSIR-SERC">CSIR-SERC</option>
              <option value="CSIR-HQ">CSIR-HQ</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button type="submit" className="w-full">Apply Filters</Button>
            <Button type="button" variant="outline" onClick={clearFilters} className="w-full">Clear All</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

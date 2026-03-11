"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    department: "",
    lab: "CSIR-SERC",
    maxAge: 28,
    vacancies: 1,
    openDate: "",
    closeDate: "",
    crucialDate: "",
    status: "DRAFT",
  })

  const [reservations, setReservations] = useState([
    { category: "UR", vacancies: 1, ageRelaxation: 0 }
  ])

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/admin/jobs/${id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch job")
        }
        const data = await res.json()
        
        setFormData({
          title: data.title,
          code: data.code,
          description: data.description,
          department: data.department,
          lab: data.lab,
          maxAge: data.maxAge,
          vacancies: data.vacancies,
          openDate: new Date(data.openDate).toISOString().split('T')[0],
          closeDate: new Date(data.closeDate).toISOString().split('T')[0],
          crucialDate: new Date(data.crucialDate).toISOString().split('T')[0],
          status: data.status,
        })
        
        if (data.reservations && data.reservations.length > 0) {
          setReservations(data.reservations.map((r: any) => ({
            category: r.category,
            vacancies: r.vacancies,
            ageRelaxation: r.ageRelaxation
          })))
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setFetching(false)
      }
    }
    
    fetchJob()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    })
  }

  const handleReservationChange = (index: number, field: string, value: string | number) => {
    const newReservations = [...reservations]
    newReservations[index] = { ...newReservations[index], [field]: value }
    setReservations(newReservations)
  }

  const addReservation = () => {
    setReservations([...reservations, { category: "SC", vacancies: 0, ageRelaxation: 5 }])
  }

  const removeReservation = (index: number) => {
    setReservations(reservations.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, reservations }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to update job")
      }

      router.push("/admin/jobs")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to delete job")
      }

      router.push("/admin/jobs")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-8 text-center text-slate-500">Loading job details...</div>
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Job</h1>
          <p className="text-slate-500">Update job posting details.</p>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete Job
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Job Code</Label>
                <Input id="code" name="code" value={formData.code} onChange={handleChange} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lab">Lab</Label>
                <Input id="lab" name="lab" value={formData.lab} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAge">Base Max Age (UR)</Label>
                <Input id="maxAge" name="maxAge" type="number" value={formData.maxAge} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vacancies">Total Vacancies</Label>
                <Input id="vacancies" name="vacancies" type="number" value={formData.vacancies} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="DRAFT">Draft</option>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openDate">Open Date</Label>
                <Input id="openDate" name="openDate" type="date" value={formData.openDate} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeDate">Close Date</Label>
                <Input id="closeDate" name="closeDate" type="date" value={formData.closeDate} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crucialDate">Crucial Date (for age/qualifications)</Label>
                <Input id="crucialDate" name="crucialDate" type="date" value={formData.crucialDate} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Reservations & Age Relaxations</h3>
                  <p className="text-sm text-slate-500">Configure category-wise vacancies and age relaxations based on GoI rules.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addReservation}>
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </div>

              <div className="space-y-4">
                {reservations.map((res, index) => (
                  <div key={index} className="flex items-end gap-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                    <div className="flex-1 space-y-2">
                      <Label>Category</Label>
                      <select
                        value={res.category}
                        onChange={(e) => handleReservationChange(index, "category", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="UR">UR</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="OBC-NCL">OBC-NCL</option>
                        <option value="EWS">EWS</option>
                        <option value="PwBD">PwBD</option>
                      </select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Vacancies</Label>
                      <Input 
                        type="number" 
                        min="0"
                        value={res.vacancies} 
                        onChange={(e) => handleReservationChange(index, "vacancies", Number(e.target.value))} 
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Age Relaxation (Years)</Label>
                      <Input 
                        type="number" 
                        min="0"
                        value={res.ageRelaxation} 
                        onChange={(e) => handleReservationChange(index, "ageRelaxation", Number(e.target.value))} 
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => removeReservation(index)}
                      disabled={reservations.length === 1}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

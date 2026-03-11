"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"

export function ApplicationScrutinyTable({ applications, jobId }: { applications: any[], jobId: string }) {
  const router = useRouter()
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [viewApp, setViewApp] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApps(applications.map(app => app.id))
    } else {
      setSelectedApps([])
    }
  }

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedApps([...selectedApps, id])
    } else {
      setSelectedApps(selectedApps.filter(appId => appId !== id))
    }
  }

  const handleBulkAction = async (status: string) => {
    if (selectedApps.length === 0) return
    
    setLoading(true)
    try {
      const res = await fetch("/api/admin/applications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationIds: selectedApps, status }),
      })

      if (!res.ok) throw new Error("Failed to update status")
      
      setSelectedApps([])
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Error updating applications")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <span className="text-sm font-medium text-slate-700">
          {selectedApps.length} selected
        </span>
        <div className="h-6 w-px bg-slate-200" />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleBulkAction("UNDER_REVIEW")}
          disabled={selectedApps.length === 0 || loading}
        >
          Mark Under Review
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleBulkAction("SHORTLISTED_FOR_TEST")}
          disabled={selectedApps.length === 0 || loading}
        >
          Shortlist for Test
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => handleBulkAction("PENDING_DIRECTOR_APPROVAL")}
          disabled={selectedApps.length === 0 || loading}
        >
          Push to Director
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => handleBulkAction("REJECTED")}
          disabled={selectedApps.length === 0 || loading}
        >
          Reject
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                <tr>
                  <th className="px-6 py-3">
                    <Checkbox 
                      checked={selectedApps.length === applications.length && applications.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3">App No</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Applied On</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">No applications found.</td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b border-slate-200 bg-white hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <Checkbox 
                          checked={selectedApps.includes(app.id)}
                          onCheckedChange={(c) => handleSelect(app.id, c as boolean)}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{app.applicationNo}</td>
                      <td className="px-6 py-4">{app.user.name || app.user.email}</td>
                      <td className="px-6 py-4">{app.user.profile?.category || "UR"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{format(new Date(app.createdAt), "MMM d, yyyy")}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setViewApp(app)}>
                          Quick View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewApp} onOpenChange={(open) => !open && setViewApp(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details: {viewApp?.applicationNo}</DialogTitle>
          </DialogHeader>
          {viewApp && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Applicant Name</h4>
                  <p className="text-base font-medium text-slate-900">{viewApp.user.name || viewApp.user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Status</h4>
                  <p className="text-base font-medium text-slate-900">{viewApp.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Category</h4>
                  <p className="text-base font-medium text-slate-900">{viewApp.user.profile?.category || "UR"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Gender</h4>
                  <p className="text-base font-medium text-slate-900">{viewApp.user.profile?.gender || "N/A"}</p>
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 text-lg font-semibold text-slate-900">Personal Details</h4>
                <pre className="rounded-md bg-slate-100 p-4 text-sm overflow-x-auto">
                  {viewApp.personalDetails ? JSON.stringify(JSON.parse(viewApp.personalDetails), null, 2) : "No data"}
                </pre>
              </div>
              
              <div>
                <h4 className="mb-2 text-lg font-semibold text-slate-900">Education Details</h4>
                <pre className="rounded-md bg-slate-100 p-4 text-sm overflow-x-auto">
                  {viewApp.educationDetails ? JSON.stringify(JSON.parse(viewApp.educationDetails), null, 2) : "No data"}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Image as ImageIcon, Upload } from "lucide-react"

export function SettingsForm({ initialLogo }: { initialLogo: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [logoData, setLogoData] = useState(initialLogo)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new window.Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        
        // Max width/height for logo
        const MAX_WIDTH = 300
        const MAX_HEIGHT = 100
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Compress to PNG to preserve transparency
        const dataUrl = canvas.toDataURL("image/png")
        setLogoData(dataUrl)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "portal_logo", value: logoData }),
      })

      if (!res.ok) throw new Error("Failed to update settings")
      
      setMessage("Settings updated successfully")
      router.refresh()
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
        <CardDescription>Update the portal logo and branding elements.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative group h-24 w-48 overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-50 shadow-sm flex items-center justify-center">
              {logoData ? (
                <Image src={logoData} alt="Portal Logo" fill className="object-contain p-2" unoptimized />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <span className="text-xs font-medium">No Logo</span>
                </div>
              )}
              <div 
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-left">
              <h3 className="text-lg font-medium text-slate-900">Portal Logo</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Upload a logo for the portal. It will be displayed in the navigation bar. Transparent PNG recommended.
              </p>
              <div className="mt-2">
                <Input 
                  id="logo" 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {logoData ? "Change Logo" : "Upload Logo"}
                </Button>
                {logoData && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => setLogoData("")}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {message && (
            <div className={`rounded-md p-3 text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}
          
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

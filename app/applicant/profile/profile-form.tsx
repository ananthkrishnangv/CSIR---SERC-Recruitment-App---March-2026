"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import Image from "next/image"
import { Camera, Upload, Plus, Trash2 } from "lucide-react"

export function ProfileForm({ profile }: { profile: any }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture || "")
  
  const [formData, setFormData] = useState({
    name: profile.user.name || "",
    phone: profile.phone || "",
    dob: profile.dob ? format(new Date(profile.dob), "yyyy-MM-dd") : "",
    gender: profile.gender || "",
    category: profile.category || "UR",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    pincode: profile.pincode || "",
  })

  // Parse JSON strings to arrays, or default to empty arrays
  const [educationList, setEducationList] = useState<any[]>(() => {
    try {
      return profile.educationDetails ? JSON.parse(profile.educationDetails) : []
    } catch {
      return []
    }
  })

  const [experienceList, setExperienceList] = useState<any[]>(() => {
    try {
      return profile.experienceDetails ? JSON.parse(profile.experienceDetails) : []
    } catch {
      return []
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newList = [...educationList]
    newList[index] = { ...newList[index], [field]: value }
    setEducationList(newList)
  }

  const addEducation = () => {
    setEducationList([...educationList, { degree: "", institution: "", year: "", percentage: "" }])
  }

  const removeEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index))
  }

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newList = [...experienceList]
    newList[index] = { ...newList[index], [field]: value }
    setExperienceList(newList)
  }

  const addExperience = () => {
    setExperienceList([...experienceList, { title: "", organization: "", startDate: "", endDate: "", description: "" }])
  }

  const removeExperience = (index: number) => {
    setExperienceList(experienceList.filter((_, i) => i !== index))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simple auto-compression using canvas
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new window.Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        
        // Max width/height
        const MAX_WIDTH = 400
        const MAX_HEIGHT = 400
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
        
        // Compress to JPEG with 0.7 quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7)
        setProfilePicture(dataUrl)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          profilePicture,
          educationDetails: JSON.stringify(educationList),
          experienceDetails: JSON.stringify(experienceList)
        }),
      })

      if (!res.ok) throw new Error("Failed to update profile")
      
      setMessage("Profile updated successfully")
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
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your contact, demographic, and professional details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative group h-32 w-32 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50 shadow-sm">
              {profilePicture ? (
                <Image src={profilePicture} alt="Profile" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300 bg-slate-100">
                  <Camera className="h-10 w-10" />
                </div>
              )}
              <div 
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <h3 className="text-lg font-medium text-slate-900">Profile Picture</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Upload a professional photo. It will be auto-compressed to save space (max 400x400px JPEG).
              </p>
              <div className="mt-2">
                <Input 
                  id="picture" 
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
                  {profilePicture ? "Change Picture" : "Upload Picture"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select 
                id="gender" 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category" 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="UR">Unreserved (UR)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="OBC-NCL">Other Backward Classes (OBC-NCL)</option>
                <option value="EWS">Economically Weaker Sections (EWS)</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 border-b pb-2">Address Details</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-medium text-slate-900">Educational Qualifications</h3>
              <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                <Plus className="mr-2 h-4 w-4" /> Add Education
              </Button>
            </div>
            
            {educationList.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No educational qualifications added yet.</p>
            ) : (
              <div className="space-y-4">
                {educationList.map((edu, index) => (
                  <div key={index} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end rounded-lg border border-slate-200 p-4 bg-slate-50">
                    <div className="space-y-2 lg:col-span-2">
                      <Label>Degree/Qualification</Label>
                      <Input 
                        value={edu.degree} 
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)} 
                        placeholder="e.g. B.Tech Computer Science"
                        required
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                      <Label>Institution</Label>
                      <Input 
                        value={edu.institution} 
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)} 
                        placeholder="University Name"
                        required
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                      <Label>Year</Label>
                      <Input 
                        value={edu.year} 
                        onChange={(e) => handleEducationChange(index, "year", e.target.value)} 
                        placeholder="e.g. 2020"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2 lg:col-span-1">
                      <div className="space-y-2 flex-1">
                        <Label>CGPA/%</Label>
                        <Input 
                          value={edu.percentage} 
                          onChange={(e) => handleEducationChange(index, "percentage", e.target.value)} 
                          placeholder="e.g. 8.5"
                          required
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-8"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-medium text-slate-900">Work Experience</h3>
              <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                <Plus className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </div>

            {experienceList.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No work experience added yet.</p>
            ) : (
              <div className="space-y-4">
                {experienceList.map((exp, index) => (
                  <div key={index} className="grid gap-4 sm:grid-cols-2 items-end rounded-lg border border-slate-200 p-4 bg-slate-50">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input 
                        value={exp.title} 
                        onChange={(e) => handleExperienceChange(index, "title", e.target.value)} 
                        placeholder="e.g. Software Engineer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Organization</Label>
                      <Input 
                        value={exp.organization} 
                        onChange={(e) => handleExperienceChange(index, "organization", e.target.value)} 
                        placeholder="Company Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input 
                        type="date"
                        value={exp.startDate} 
                        onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)} 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input 
                        type="date"
                        value={exp.endDate} 
                        onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2 flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <Label>Description</Label>
                        <textarea 
                          value={exp.description} 
                          onChange={(e) => handleExperienceChange(index, "description", e.target.value)} 
                          placeholder="Briefly describe your responsibilities"
                          className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-8"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {message && (
            <div className={`rounded-md p-3 text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}
          
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

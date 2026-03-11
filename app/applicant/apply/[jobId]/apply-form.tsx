"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const STEPS = [
  "Personal Details",
  "Education Details",
  "Experience Details",
  "Document Uploads",
  "Payment Details",
  "Review",
  "Submit"
]

export function ApplyForm({ application, job }: { application: any, job: any }) {
  const router = useRouter()
  const [step, setStep] = useState(application.step || 1)
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (step < 7) {
      setLoading(true)
      try {
        await fetch(`/api/applications/${application.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: step + 1 }),
        })
        setStep(step + 1)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePrev = async () => {
    if (step > 1) {
      setLoading(true)
      try {
        await fetch(`/api/applications/${application.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: step - 1 }),
        })
        setStep(step - 1)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/applications/${application.id}/submit`, {
        method: "POST",
      })
      if (res.ok) {
        router.push("/applicant/dashboard")
        router.refresh()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-200"></div>
        <div 
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
        ></div>
        <div className="relative flex justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                step > i + 1 ? "border-indigo-600 bg-indigo-600 text-white" :
                step === i + 1 ? "border-indigo-600 bg-white text-indigo-600" :
                "border-slate-300 bg-white text-slate-400"
              }`}>
                {i + 1}
              </div>
              <span className="hidden text-xs font-medium text-slate-500 sm:block">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {step}: {STEPS[step - 1]}</CardTitle>
          <CardDescription>
            {step === 1 && "Review your personal details. Update them in your profile if needed."}
            {step === 2 && "Provide your educational qualifications."}
            {step === 3 && "Provide your work experience details."}
            {step === 4 && "Upload necessary documents (ID, Certificates, etc.)."}
            {step === 5 && "Complete the payment process."}
            {step === 6 && "Review all your details before final submission."}
            {step === 7 && "Submit your application."}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {step === 1 && (
            <div className="rounded-md bg-slate-50 p-4">
              <pre className="text-sm">{JSON.stringify(JSON.parse(application.personalDetails || "{}"), null, 2)}</pre>
            </div>
          )}
          {step === 2 && (
            <div className="rounded-md bg-slate-50 p-4">
              <pre className="text-sm">{JSON.stringify(JSON.parse(application.educationDetails || "{}"), null, 2)}</pre>
            </div>
          )}
          {step === 3 && (
            <div className="rounded-md bg-slate-50 p-4">
              <pre className="text-sm">{JSON.stringify(JSON.parse(application.experienceDetails || "{}"), null, 2)}</pre>
            </div>
          )}
          {step === 4 && (
            <div className="flex h-full items-center justify-center rounded-md border-2 border-dashed border-slate-300 p-12 text-center">
              <div>
                <p className="text-sm text-slate-500">Document upload component placeholder</p>
                <Button variant="outline" className="mt-4">Select Files</Button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="flex h-full items-center justify-center rounded-md border border-slate-200 bg-slate-50 p-12 text-center">
              <div>
                <p className="text-lg font-medium text-slate-900">Payment Gateway Integration</p>
                <p className="text-sm text-slate-500">Fee: ₹500 (Exempted for SC/ST/PwBD/Women)</p>
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Application Summary</h3>
              <p className="text-sm text-slate-600">Please review all details carefully. Once submitted, you cannot edit the application.</p>
            </div>
          )}
          {step === 7 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <h3 className="mb-2 text-2xl font-bold text-slate-900">Ready to Submit</h3>
              <p className="mb-6 text-slate-500">By submitting, you declare that all information provided is true and correct.</p>
              <Button size="lg" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Final Submit Application"}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-200 pt-6">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1 || loading}>
            Previous
          </Button>
          {step < 7 && (
            <Button onClick={handleNext} disabled={loading}>
              Next Step
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

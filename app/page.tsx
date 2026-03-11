import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, CheckCircle, Users } from "lucide-react"
import * as motion from "motion/react-client"

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-50">
      {/* Hero Section with Glassmorphism */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/architecture/1920/1080?blur=2"
            alt="CSIR-SERC Campus"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-indigo-950/40 mix-blend-multiply" />
        </div>

        {/* Glassmorphism Banner */}
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-4xl rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-16"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
              >
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                Now hiring for 2026
              </motion.div>
              
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-sm">
                CSIR-SERC <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">Recruitment Portal</span>
              </h1>
              
              <p className="mx-auto mb-10 max-w-2xl text-lg text-indigo-50 sm:text-xl md:text-2xl font-light drop-shadow-sm">
                Join the Structural Engineering Research Centre. Apply for scientific, technical, and administrative positions to shape the future of engineering.
              </p>
              
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/jobs">
                  <Button size="lg" className="w-full bg-white text-indigo-900 hover:bg-slate-100 sm:w-auto h-14 px-8 text-lg rounded-xl shadow-lg transition-transform hover:scale-105">
                    View Open Positions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto h-14 px-8 text-lg rounded-xl backdrop-blur-md transition-transform hover:scale-105">
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl filter" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl filter" />
      </section>

      {/* Features Section */}
      <section className="w-full py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Simple 3-Step Application Process
            </h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
              Our streamlined portal makes it easy to apply for positions at CSIR-SERC.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border border-slate-100 bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl mb-2">1. Register & Profile</CardTitle>
                  <CardDescription className="text-base text-slate-500">
                    Create an account and fill in your basic personal details to get started.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border border-slate-100 bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <FileText className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl mb-2">2. Complete Application</CardTitle>
                  <CardDescription className="text-base text-slate-500">
                    Select a post, fill out the 7-step form, and upload your documents securely.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border border-slate-100 bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="p-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl mb-2">3. Submit & Track</CardTitle>
                  <CardDescription className="text-base text-slate-500">
                    Pay the fee (if applicable), submit your application, and track your status online.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

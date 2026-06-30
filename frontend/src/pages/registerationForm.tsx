import type React from "react"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, GraduationCap, Users, Mail, Phone, MessageSquare, ChevronRight, CheckCircle2 } from "lucide-react"

const grades = [
  { value: "kindergarten", label: "Kindergarten" },
  { value: "nursery-1", label: "Nursery 1" },
  { value: "nursery-2", label: "Nursery 2" },
  { value: "primary-1", label: "Primary 1" },
  { value: "primary-2", label: "Primary 2" },
  { value: "primary-3", label: "Primary 3" },
  { value: "primary-4", label: "Primary 4" },
  { value: "primary-5", label: "Primary 5" },
  { value: "primary-6", label: "Primary 6" },
  { value: "jss-1", label: "JSS 1" },
  { value: "jss-2", label: "JSS 2" },
  { value: "jss-3", label: "JSS 3" },
  { value: "ss-1", label: "SS 1" },
  { value: "ss-2", label: "SS 2" },
  { value: "ss-3", label: "SS 3" },
]

const steps = [
  { id: 1, label: "Student Info", icon: User, color: "from-sky-500 to-blue-600" },
  { id: 2, label: "Parent Info", icon: Users, color: "from-violet-500 to-purple-600" },
  { id: 3, label: "Additional", icon: MessageSquare, color: "from-emerald-500 to-green-600" },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({ type: null, message: null })
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    student_name: "",
    grade: "",
    parent_name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const canProceed = (step: number) => {
    if (step === 1) return !!formData.student_name && !!formData.grade
    if (step === 2) return !!formData.parent_name && !!formData.email && !!formData.phone
    return true
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ type: null, message: null })

    try {
      if (!formData.student_name || !formData.grade || !formData.parent_name || !formData.email || !formData.phone) {
        setFormStatus({ type: "error", message: "Please fill in all required fields." })
        setIsSubmitting(false)
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setFormStatus({ type: "error", message: "Please enter a valid email address." })
        setIsSubmitting(false)
        return
      }

      import("@/lib/api").then(async ({ default: api }) => {
        try {
          const response = await api.post('/users/student-registration', {
            full_name: formData.student_name,
            email: formData.email,
            phone: formData.phone,
            grade: formData.grade,
            parent_name: formData.parent_name,
            role: 'student',
            message: formData.message
          })

          setFormStatus({ type: "success", message: "Registration successful! Redirecting..." })

          const registrationData = {
            ...formData,
            tx_ref: response.data?.user?.reg_number || `TXN-${Date.now()}`,
            initiated_at: new Date().toISOString(),
            status: "completed",
          }

          setTimeout(() => {
            navigate("/register-success", { state: { registrationData } })
          }, 1000)
        } catch (apiError: any) {
          setFormStatus({
            type: "error",
            message: apiError.response?.data?.message || "Server error occurred. Please try again.",
          })
        }
      })
    } catch (error) {
      setFormStatus({ type: "error", message: error instanceof Error ? error.message : "An unexpected error occurred." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isDone = currentStep > step.id
          return (
            <div key={step.id} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm
                  ${isDone ? "bg-emerald-500" : isActive ? `bg-gradient-to-br ${step.color}` : "bg-gray-100 border-2 border-gray-200"}`}>
                  {isDone
                    ? <CheckCircle2 className="w-5 h-5 text-white" />
                    : <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                  }
                </div>
                <span className={`text-xs font-bold ${isActive ? "text-gray-900" : isDone ? "text-emerald-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-0.5 mb-5 rounded-full ${currentStep > step.id ? "bg-emerald-400" : "bg-gray-200"}`} />
              )}
            </div>
          )
        })}
      </div>

      {formStatus.type && formStatus.message && (
        <Alert variant={formStatus.type === "success" ? "default" : "destructive"} className="mb-6 rounded-2xl">
          <AlertDescription>{formStatus.message}</AlertDescription>
        </Alert>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>

        {/* Step 1 — Student */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900">Student Information</h3>
                <p className="text-xs text-muted-foreground">Tell us about the student applying</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_name" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Student Full Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="student_name"
                name="student_name"
                type="text"
                required
                value={formData.student_name}
                onChange={(e) => handleInputChange("student_name", e.target.value)}
                placeholder="Enter student's full name"
                className="h-11 rounded-xl bg-sky-50 border-sky-200 focus:bg-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-sky-500" />
                Grade / Class Level <span className="text-rose-500">*</span>
              </Label>
              <Select name="grade" required value={formData.grade} onValueChange={(v) => handleInputChange("grade", v)}>
                <SelectTrigger className="h-11 rounded-xl bg-sky-50 border-sky-200 focus:bg-white">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              size="lg"
              disabled={!canProceed(1)}
              onClick={() => setCurrentStep(2)}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold shadow-md mt-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 2 — Parent */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900">Parent / Guardian Information</h3>
                <p className="text-xs text-muted-foreground">We'll use this to reach out to you</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_name" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Parent / Guardian Full Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="parent_name"
                name="parent_name"
                type="text"
                required
                value={formData.parent_name}
                onChange={(e) => handleInputChange("parent_name", e.target.value)}
                placeholder="Enter parent/guardian full name"
                className="h-11 rounded-xl bg-violet-50 border-violet-200 focus:bg-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Mail className="w-4 h-4 text-violet-500" />
                Email Address <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="parent@example.com"
                className="h-11 rounded-xl bg-violet-50 border-violet-200 focus:bg-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Phone className="w-4 h-4 text-violet-500" />
                Phone Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+234 800 000 0000"
                className="h-11 rounded-xl bg-violet-50 border-violet-200 focus:bg-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <Button type="button" variant="outline" size="lg" onClick={() => setCurrentStep(1)} className="flex-1 font-bold border-2">
                Back
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={!canProceed(2)}
                onClick={() => setCurrentStep(3)}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold shadow-md"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 — Additional + Submit */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900">Almost Done!</h3>
                <p className="text-xs text-muted-foreground">Review your details and submit</p>
              </div>
            </div>

            {/* Summary card */}
            <div className="rounded-2xl bg-blue-50 border-2 border-blue-200 p-4 space-y-2.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-blue-500 mb-3">Application Summary</p>
              {[
                { label: "Student", value: formData.student_name },
                { label: "Grade", value: grades.find(g => g.value === formData.grade)?.label },
                { label: "Parent", value: formData.parent_name },
                { label: "Email", value: formData.email },
                { label: "Phone", value: formData.phone },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{label}</span>
                  <span className="font-extrabold text-gray-900 truncate max-w-[60%] text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                Additional Comments <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Any special needs, questions, or information you'd like to share..."
                className="rounded-xl resize-none bg-emerald-50 border-emerald-200 focus:bg-white placeholder:text-gray-400 min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <Button type="button" variant="outline" size="lg" onClick={() => setCurrentStep(2)} className="flex-1 font-bold border-2">
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] hover:opacity-90 text-white font-bold shadow-md"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground pt-1">
              By submitting, you agree to our terms. We'll contact you within 24–48 hours to schedule your campus visit.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

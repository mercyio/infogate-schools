import type React from "react"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
  }>({ type: null, message: null })

  const formRef = useRef<HTMLFormElement>(null)

  // Form state for controlled inputs
  const [formData, setFormData] = useState({
    student_name: "",
    grade: "",
    parent_name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      student_name: "",
      grade: "",
      parent_name: "",
      email: "",
      phone: "",
      message: "",
    })

    // Also reset the form element if it exists
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Form submission started")

    setIsSubmitting(true)
    setFormStatus({ type: null, message: null })

    try {
      // Validate required fields on client side
      if (!formData.student_name || !formData.grade || !formData.parent_name || !formData.email || !formData.phone) {
        setFormStatus({
          type: "error",
          message: "Please fill in all required fields.",
        })
        setIsSubmitting(false)
        return
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setFormStatus({
          type: "error",
          message: "Please enter a valid email address.",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Registration submitted:", formData)
      
      // Submit registration to the backend
      import("@/lib/api").then(async ({ default: api }) => {
        try {
            const response = await api.post('/users/student-registration', {
              full_name: formData.student_name,
              email: formData.email,
              phone: formData.phone,
              grade: formData.grade,
              parent_name: formData.parent_name,
              role: 'student', // Pre-assigned role
              message: formData.message
            });
            
            // Show success message
            setFormStatus({
              type: "success",
              message: "Registration successful! Redirecting to confirmation page...",
            });
            
            const registrationData = {
              ...formData,
              tx_ref: response.data?.user?.reg_number || `TXN-${Date.now()}`,
              initiated_at: new Date().toISOString(),
              status: "completed",
            };
            
            // Navigate to success page with registration data
            setTimeout(() => {
              navigate("/register-success", {
                state: { registrationData },
              })
            }, 1000)
            
        } catch (apiError: any) {
          console.error("API error during registration:", apiError);
          setFormStatus({
            type: "error",
            message: apiError.response?.data?.message || "Server error occurred during registration. Please try again.",
          });
        }
      });
      
    } catch (error) {
      console.error("Unexpected error during registration:", error)

      let errorMessage = "An unexpected error occurred. Please try again."

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      setFormStatus({
        type: "error",
        message: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <Card className="shadow-xl border-0 max-w-2xl mx-auto bg-gradient-to-br from-primary/20 via-primary/15 to-secondary/15">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                  Student Registration Form
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Please fill out all required fields to begin the application process
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {formStatus.type && formStatus.message && (
                  <Alert variant={formStatus.type === "success" ? "default" : "destructive"}>
                    <AlertDescription>
                      {typeof formStatus.message === "string" ? formStatus.message : "An error occurred"}
                    </AlertDescription>
                  </Alert>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {/* Student Information */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-foreground border-b-2 border-primary/30 pb-2">Student Information</h3>

                     <div className="space-y-2">
                       <Label htmlFor="student_name" className="text-foreground font-semibold">Student Full Name *</Label>
                       <Input
                         id="student_name"
                         name="student_name"
                         type="text"
                         required
                         value={formData.student_name}
                         onChange={(e) => handleInputChange("student_name", e.target.value)}
                         placeholder="Enter student's full name"
                         className="w-full border-primary/30 focus:border-primary focus:ring-primary"
                       />
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="grade" className="text-foreground font-semibold">Grade Level *</Label>
                      <Select
                        name="grade"
                        required
                        value={formData.grade}
                        onValueChange={(value) => handleInputChange("grade", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kindergarten">Kindergarten</SelectItem>
                          <SelectItem value="1st">1st Grade</SelectItem>
                          <SelectItem value="2nd">2nd Grade</SelectItem>
                          <SelectItem value="3rd">3rd Grade</SelectItem>
                          <SelectItem value="4th">4th Grade</SelectItem>
                          <SelectItem value="5th">5th Grade</SelectItem>
                          <SelectItem value="6th">6th Grade</SelectItem>
                          <SelectItem value="7th">7th Grade</SelectItem>
                          <SelectItem value="8th">8th Grade</SelectItem>
                          <SelectItem value="9th">9th Grade</SelectItem>
                          <SelectItem value="10th">10th Grade</SelectItem>
                          <SelectItem value="11th">11th Grade</SelectItem>
                          <SelectItem value="12th">12th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Parent/Guardian Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b-2 border-primary/30 pb-2">Parent/Guardian Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="parent_name" className="text-foreground font-semibold">Parent/Guardian Full Name *</Label>
                      <Input
                        id="parent_name"
                        name="parent_name"
                        type="text"
                        required
                        value={formData.parent_name}
                        onChange={(e) => handleInputChange("parent_name", e.target.value)}
                        placeholder="Enter parent/guardian full name"
                        className="w-full border-primary/30 focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-semibold">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter email address"
                        className="w-full border-primary/30 focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-semibold">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter phone number (e.g., +251912345678)"
                        className="w-full border-primary/30 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b-2 border-primary/30 pb-2">Additional Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-foreground font-semibold">Additional Comments (Optional)</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Any additional information you'd like to share..."
                        className="w-full min-h-[100px] border-primary/30 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-semibold rounded-lg disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Registration"}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      By submitting this form, you agree to our terms and conditions. We will contact you within 24-48
                      hours to schedule your campus visit.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
    </div>
  )
}
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Home, FileText } from "lucide-react"

interface RegistrationData {
  student_name: string
  grade: string
  parent_name: string
  email: string
  phone: string
  message: string
  tx_ref?: string
}

interface RegisterSuccessPageProps {
  registrationData?: RegistrationData
}

function RegisterSuccessPage({ registrationData }: RegisterSuccessPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [localRegistrationData, setLocalRegistrationData] = useState<RegistrationData | undefined>(registrationData)
  const [saveStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
  }>({
    type: "success",
    message: "Your registration has been completed successfully! We will contact you within 24-48 hours.",
  })

  useEffect(() => {
    // Get registration data from location state if passed from another page
    const state = location.state as { registrationData?: RegistrationData } | null
    if (state?.registrationData) {
      setLocalRegistrationData(state.registrationData)
    }
  }, [location.state])

  return (
    <div className="w-full bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800"></div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-400 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <CheckCircle className="w-20 h-20 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Registration Complete!</h1>
            <p className="text-lg md:text-2xl text-green-100 mb-8">Welcome to the Infogate Schools family</p>
          </div>
        </div>
      </section>

      {/* Success Details */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {saveStatus.type && (
              <Alert variant={saveStatus.type === "success" ? "default" : "destructive"} className="mb-8">
                <AlertDescription className="text-lg">{saveStatus.message}</AlertDescription>
              </Alert>
            )}

            {localRegistrationData && (
              <Card className="shadow-xl border-0 mb-8">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">Registration Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Student Name</h4>
                      <p className="text-gray-900">{localRegistrationData.student_name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Grade Level</h4>
                      <p className="text-gray-900">{localRegistrationData.grade}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Parent/Guardian</h4>
                      <p className="text-gray-900">{localRegistrationData.parent_name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Email</h4>
                      <p className="text-gray-900">{localRegistrationData.email}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Phone</h4>
                      <p className="text-gray-900">{localRegistrationData.phone}</p>
                    </div>
                    {localRegistrationData.tx_ref && (
                      <div>
                        <h4 className="font-semibold text-gray-700">Transaction ID</h4>
                        <p className="text-gray-900 font-mono text-sm">{localRegistrationData.tx_ref}</p>
                      </div>
                    )}
                  </div>

                  {localRegistrationData.message && (
                    <div>
                      <h4 className="font-semibold text-gray-700">Additional Comments</h4>
                      <p className="text-gray-900">{localRegistrationData.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card className="shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-amber-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Confirmation Email</h4>
                    <p className="text-gray-600">
                      You will receive a confirmation email within the next hour with your registration details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-amber-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">School Contact</h4>
                    <p className="text-gray-600">
                      Our admissions team will contact you within 24-48 hours to schedule a campus visit and discuss
                      next steps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-amber-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Campus Visit</h4>
                    <p className="text-gray-600">
                      Schedule a tour of our facilities and meet with our academic team to discuss your child's
                      educational journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>

              <Button
                onClick={() => window.print()}
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3"
              >
                <FileText className="w-4 h-4 mr-2" />
                Print Summary
              </Button>
            </div>

            {/* Contact Information */}
            <div className="mt-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-2">If you have any questions, please contact our admissions office:</p>
              <p className="text-gray-900 font-semibold">
                📞 +1 (555) 123-4567 | ✉️ admissions@infogateacademy.edu
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RegisterSuccessPage
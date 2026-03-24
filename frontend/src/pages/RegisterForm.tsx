import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });

  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    student_name: "",
    grade: "",
    parent_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      student_name: "",
      grade: "",
      parent_name: "",
      email: "",
      phone: "",
      message: "",
    });

    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submission started");

    setIsSubmitting(true);
    setFormStatus({ type: null, message: null });

    try {
      if (!formData.student_name || !formData.grade || !formData.parent_name || !formData.email || !formData.phone) {
        setFormStatus({
          type: "error",
          message: "Please fill in all required fields.",
        });
        setIsSubmitting(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setFormStatus({
          type: "error",
          message: "Please enter a valid email address.",
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Form submitted with data:", formData);

      setFormStatus({
        type: "success",
        message: "Your registration has been completed successfully! We will contact you within 24-48 hours.",
      });

      resetForm();
    } catch (error) {
      console.error("Unexpected error:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setFormStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8">
      <div className="text-center pb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
          Student Registration Form
        </h2>
        <p className="text-blue-700 mt-2">
          Please fill out all required fields to begin the application process
        </p>
      </div>
      <div className="space-y-6">
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
            <h3 className="text-lg font-semibold text-blue-900 border-b-2 border-blue-300 pb-2">Student Information</h3>

            <div className="space-y-2">
              <label htmlFor="student_name" className="block text-sm font-semibold text-blue-900">Student Full Name *</label>
              <Input
                id="student_name"
                name="student_name"
                type="text"
                required
                value={formData.student_name}
                onChange={(e) => handleInputChange("student_name", e.target.value)}
                placeholder="Enter student's full name"
                className="w-full h-12 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="grade" className="block text-sm font-semibold text-blue-900">Grade Level *</label>
              <select
                name="grade"
                id="grade"
                required
                value={formData.grade}
                onChange={(e) => handleInputChange("grade", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select grade level</option>
                <option value="kindergarten">Kindergarten</option>
                <option value="1st">1st Grade</option>
                <option value="2nd">2nd Grade</option>
                <option value="3rd">3rd Grade</option>
                <option value="4th">4th Grade</option>
                <option value="5th">5th Grade</option>
                <option value="6th">6th Grade</option>
                <option value="7th">7th Grade</option>
                <option value="8th">8th Grade</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
                <option value="11th">11th Grade</option>
                <option value="12th">12th Grade</option>
              </select>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b-2 border-blue-300 pb-2">Parent/Guardian Information</h3>

            <div className="space-y-2">
              <label htmlFor="parent_name" className="block text-sm font-semibold text-blue-900">Parent/Guardian Full Name *</label>
              <Input
                id="parent_name"
                name="parent_name"
                type="text"
                required
                value={formData.parent_name}
                onChange={(e) => handleInputChange("parent_name", e.target.value)}
                placeholder="Enter parent/guardian full name"
                className="w-full h-12 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-blue-900">Email Address *</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className="w-full h-12 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-blue-900">Phone Number *</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="w-full h-12 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b-2 border-blue-300 pb-2">Additional Information</h3>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-blue-900">Additional Comments (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Any additional information you'd like to share..."
                className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>

          <div className="text-center text-sm text-blue-700">
            <p>
              By submitting this form, you agree to our terms and conditions. We will contact you within 24-48 hours to schedule your campus visit.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

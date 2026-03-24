import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RegisterPage from "./registerationForm";
import {
  FileText,
  Calendar,
  ClipboardCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Phone,
  Mail,
} from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Submit Application",
    description: "Fill out our online application form with your child's details and upload required documents.",
  },
  {
    step: 2,
    title: "Schedule Assessment",
    description: "Book an age-appropriate assessment session for your child at our campus.",
  },
  {
    step: 3,
    title: "Assessment Day",
    description: "Your child participates in a fun, stress-free evaluation with our educators.",
  },
  {
    step: 4,
    title: "Welcome to Infogate!",
    description: "Receive your acceptance letter and join our school family orientation.",
  },
];

const requirements = [
  "Completed application form summery printout",
  "Birth certificate copy",
  "Recent passport-sized photos (2)",
  "Previous school records (if applicable)",
  "Medical/immunization records",
  "Parent/guardian ID copy",
];

const Admissions = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary font-semibold text-sm mb-6">
              <FileText className="w-4 h-4" />
              Admissions Open 2025
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Begin Your Child's Journey With Us
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of families who have trusted Infogate Academy to nurture 
              their children's growth. Applications are now open for the upcoming academic year.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="xl">
                Apply Online Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl">
                <Download className="w-5 h-5" />
                Download Brochure
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admission Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
             <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              Simple Admission Process
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-primary/20 to-transparent -z-10" />
                )}
                <div className="playful-card p-6 text-center h-full">
                   <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                     {step.step}
                   </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-6">
                Required Documents
              </h2>
              <p className="text-muted-foreground mb-6">
                Please prepare the following documents for your application. 
                All documents should be in PDF or image format.
              </p>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="playful-card p-8"
            >
              <h3 className="text-xl font-bold mb-6">Important Dates</h3>
              <div className="space-y-4">
                {[
                  { date: "Jan 15, 2025", event: "Application Opens", icon: Calendar },
                  { date: "Mar 30, 2025", event: "Application Deadline", icon: Clock },
                  { date: "Apr 15-30, 2025", event: "Assessment Period", icon: ClipboardCheck },
                  { date: "May 15, 2025", event: "Acceptance Letters", icon: FileText },
                  { date: "Aug 1, 2025", event: "School Begins", icon: Users },
                ].map((item, index) => (
                  <div key={item.event} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.event}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
          </motion.div>

          <RegisterPage />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold">Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "What is the student-to-teacher ratio?",
                a: "We maintain a low ratio of 8:1 for nursery and 15:1 for primary and secondary classes.",
              },
              {
                q: "Do you offer transportation?",
                a: "Yes, we provide safe bus transportation covering major areas. Routes and fees vary by location.",
              },
              {
                q: "Is there an entrance exam?",
                a: "We conduct age-appropriate assessments that are fun and interactive, not stressful exams.",
              },
              {
                q: "Are scholarships available?",
                a: "Yes, we offer merit-based and need-based financial assistance. Contact admissions for details.",
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="playful-card p-6"
              >
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>
      );
      };

      export default Admissions;

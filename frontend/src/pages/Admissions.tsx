import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RegisterPage from "./registerationForm";
import {
  FileText, Calendar, ClipboardCheck, Users,
  ArrowRight, CheckCircle2, Clock, Phone, Mail,
} from "lucide-react";

const steps = [
  {
    step: "01",
    emoji: "📝",
    title: "Submit Application",
    description: "Fill out our online application form with your child's details and upload required documents.",
    color: "from-sky-400 to-blue-600",
  },
  {
    step: "02",
    emoji: "📅",
    title: "Schedule Assessment",
    description: "Book an age-appropriate assessment session for your child at our campus.",
    color: "from-violet-400 to-purple-600",
  },
  {
    step: "03",
    emoji: "🎯",
    title: "Assessment Day",
    description: "Your child participates in a fun, stress-free evaluation with our educators.",
    color: "from-emerald-400 to-green-600",
  },
  {
    step: "04",
    emoji: "🎉",
    title: "Welcome to Infogate!",
    description: "Receive your acceptance letter and join our school family orientation.",
    color: "from-amber-400 to-orange-500",
  },
];

const requirements = [
  "Completed application form summary printout",
  "Birth certificate copy",
  "Recent passport-sized photos (2)",
  "Previous school records (if applicable)",
  "Medical/immunization records",
  "Parent/guardian ID copy",
];

const faqs = [
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
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Admissions = () => {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <div className="overflow-hidden">

      {/* ── PAGE HERO ── */}
      <section className="relative bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] text-white py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/20 rounded-full text-white font-semibold text-sm mb-6">
              <FileText className="w-4 h-4" />
              Admissions Open — 2025/2026
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              Begin Your Child's{" "}
              <span className="text-yellow-300">Journey With Us</span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed max-w-2xl mx-auto mb-10">
              Join the Infogate family — where every child is nurtured, celebrated,
              and prepared for a bright future. Applications are now open.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => setApplyOpen(true)} className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-lg group">
                Apply Online Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold">
                  Contact Admissions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50 L0 25 Q720 0 1440 25 L1440 50 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </section>

      {/* ── ADMISSION STEPS ── */}
      <section className="py-20 bg-sky-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-3">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Simple Admission Process
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Getting your child enrolled is easy. Follow these four simple steps to join our school family.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-sky-200 via-violet-200 to-amber-200 z-0" />

            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="relative z-10 rounded-3xl bg-white border-2 border-border p-6 text-center shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 text-2xl shadow-md`}>
                  {step.emoji}
                </div>
                <span className="text-xs font-extrabold text-muted-foreground tracking-widest">STEP {step.step}</span>
                <h3 className="text-base font-extrabold text-gray-900 mt-1 mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REQUIREMENTS & DATES ── */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-sky-100 border-2 border-sky-200 p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Required Documents</h2>
                  <p className="text-sm text-muted-foreground">Prepare these before applying</p>
                </div>
              </div>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3 p-3 rounded-xl hover:bg-sky-200/50 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Important Dates */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-violet-100 border-2 border-violet-200 p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-violet-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Important Dates</h2>
                  <p className="text-sm text-muted-foreground">Key timelines to remember</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { date: "Jan 15, 2025", event: "Application Opens", icon: Calendar, color: "bg-sky-100 text-sky-600" },
                  { date: "Mar 30, 2025", event: "Application Deadline", icon: Clock, color: "bg-rose-100 text-rose-600" },
                  { date: "Apr 15–30, 2025", event: "Assessment Period", icon: ClipboardCheck, color: "bg-violet-100 text-violet-600" },
                  { date: "May 15, 2025", event: "Acceptance Letters", icon: FileText, color: "bg-emerald-100 text-emerald-600" },
                  { date: "Sep 1, 2025", event: "School Begins", icon: Users, color: "bg-amber-100 text-amber-600" },
                ].map((item) => (
                  <div key={item.event} className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{item.event}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── APPLY CTA ── */}
      <section className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-sky-400/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-2xl mx-auto"
          >
            <div className="text-5xl mb-6">🎒</div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
              Ready to Enrol Your Child?
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Take the first step towards giving your child an outstanding education.
              Our admissions team is here to help you every step of the way.
            </p>
            <Button
              size="lg"
              onClick={() => setApplyOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold text-lg px-12 py-6 h-auto rounded-2xl shadow-2xl shadow-yellow-400/20 group"
            >
              Open Admission Form
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-3">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Can't find your answer? <Link to="/contact" className="text-primary font-semibold underline underline-offset-2">Contact us</Link> and we'll be happy to help.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => {
              const accents = [
                { badge: "bg-sky-100 text-sky-600", border: "border-l-sky-400" },
                { badge: "bg-violet-100 text-violet-600", border: "border-l-violet-400" },
                { badge: "bg-emerald-100 text-emerald-600", border: "border-l-emerald-400" },
                { badge: "bg-amber-100 text-amber-600", border: "border-l-amber-400" },
              ];
              const accent = accents[i % accents.length];
              return (
                <motion.div
                  key={faq.q}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className={`rounded-2xl bg-white border-2 border-border border-l-4 ${accent.border} p-6 shadow-sm hover:shadow-md transition-all`}
                >
                  <h3 className="font-extrabold text-gray-900 mb-2 flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${accent.badge}`}>Q</span>
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed pl-9">{faq.a}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="py-20 bg-sky-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-primary via-[#1a5276] to-[#0a2342] text-white overflow-hidden p-10 sm:p-14"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/10 rounded-full" />
            </div>
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Still have questions?</h2>
                <p className="text-white/70">Our admissions team is ready to guide you every step of the way.</p>
                <div className="flex flex-wrap gap-4 mt-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 text-white/75 text-sm">
                    <Phone className="w-4 h-4 text-yellow-300" />
                    +234 800 000 0000
                  </div>
                  <div className="flex items-center gap-2 text-white/75 text-sm">
                    <Mail className="w-4 h-4 text-yellow-300" />
                    admissions@infogateschools.com
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/contact">
                  <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-lg">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" onClick={() => setApplyOpen(true)} variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold">
                  Apply Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── APPLICATION MODAL ── */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-gray-900">
              Student Registration
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the details below and our admissions team will be in touch within 48 hours.
            </p>
          </DialogHeader>
          <RegisterPage />
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Admissions;

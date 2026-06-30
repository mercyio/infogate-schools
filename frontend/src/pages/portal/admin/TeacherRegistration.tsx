import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User, Save, Mail, Phone, GraduationCap,
  MapPin, ChevronRight, ArrowLeft, Award, BookOpen,
  CheckCircle2, AlertCircle, Briefcase, KeyRound, Copy,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

// ── Step definitions ──────────────────────────────────────────────────────
const STEPS = [
  {
    id: 1, key: "personal", label: "Personal Info", sub: "Basic details",
    icon: User, gradient: "from-[#0a2342] to-[#1a5276]",
  },
  {
    id: 2, key: "assignment", label: "Role & Assignment", sub: "Class & subject",
    icon: Briefcase, gradient: "from-yellow-400 to-amber-500",
  },
  {
    id: 3, key: "qualifications", label: "Qualifications", sub: "Education & experience",
    icon: Award, gradient: "from-sky-500 to-blue-600",
  },
  {
    id: 4, key: "review", label: "Review", sub: "Confirm & submit",
    icon: CheckCircle2, gradient: "from-emerald-500 to-green-600",
  },
];

const inputCls = "h-12 rounded-xl bg-white border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm placeholder:text-gray-400 shadow-sm";
const labelCls = "text-sm font-semibold text-gray-700 mb-2 block";

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className={labelCls}>{label} {required && <span className="text-rose-500">*</span>}</label>
    {children}
  </div>
);

const selectCls = "w-full h-12 rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none";

// ── Main component ────────────────────────────────────────────────────────
const TeacherRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const teacherId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [credentials, setCredentials] = useState<{ reg_number: string; password: string } | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "",
    role: "", class_id: "", subject: "",
    qualification: "", specialization: "", experience: "",
  });

  const { isLoading: isLoadingTeacher } = useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: async () => {
      const res = await api.get(`/users/teachers/${teacherId}`);
      const t = res.data;
      setFormData({
        name: t.user_id?.full_name || t.full_name || "",
        email: t.user_id?.email || t.email || "",
        phone: t.user_id?.phone || t.phone || "",
        address: t.address || "",
        role: t.role || "",
        class_id: t.assigned_class?._id || t.assigned_class || "",
        subject: t.assigned_subject || "",
        qualification: t.qualification || "",
        specialization: t.specialization || "",
        experience: t.experience || "",
      });
      return t;
    },
    enabled: isEdit && !!teacherId,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => (await api.get("/classes")).data || [],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload: Record<string, any> = {
        full_name: data.name,
        phone: data.phone || undefined,
        address: data.address || undefined,
        role: data.role || undefined,
        assigned_class: data.class_id || undefined,
        assigned_subject: data.subject || undefined,
        qualification: data.qualification || undefined,
        specialization: data.specialization || undefined,
        experience: data.experience || undefined,
      };
      if (data.email) payload.email = data.email;
      if (isEdit)
        return (await api.put(`/users/teachers/${teacherId}`, payload)).data;
      return (await api.post("/users/teachers", payload)).data;
    },
    onSuccess: (data) => {
      if (isEdit) {
        toast({ title: "Teacher Updated!", description: "Information saved successfully." });
        navigate("/portal/admin/teachers");
      } else {
        const creds = data.credentials || data;
        setCredentials({ reg_number: creds.reg_number, password: creds.password });
      }
    },
    onError: (e: any) => toast({
      title: isEdit ? "Update Failed" : "Registration Failed",
      description: e.response?.data?.message || "Please try again.",
      variant: "destructive",
    }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const goTo = (step: number) => { setDirection(step > currentStep ? 1 : -1); setCurrentStep(step); };

  const stepComplete = (id: number) => {
    if (id === 1) return !!formData.name && !!formData.email && !!formData.phone;
    if (id === 2) return !!formData.role;
    if (id === 3) return !!formData.qualification;
    return true;
  };

  const currentStepData = STEPS[currentStep - 1];

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 30 : -30 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -30 : 30, transition: { duration: 0.2 } }),
  };

  return (
    <div className="min-h-full bg-gray-50/80">
      <div className="max-w-6xl mx-auto p-6">

        {/* ── Page Header ── */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/portal/admin/teachers">
            <motion.button whileHover={{ x: -2 }} className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:shadow-md transition-all">
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {isEdit ? "Edit Teacher Details" : "Add New Teacher"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEdit ? "Update the teacher's information below" : "Complete all sections to register a new staff member"}
            </p>
          </div>
        </div>

        <div className="flex gap-6">

          {/* ── Left Sidebar ── */}
          <div className="hidden lg:flex flex-col w-64 shrink-0">
            {/* Teacher preview card */}
            <div className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] rounded-2xl p-6 mb-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-2xl font-extrabold mb-4">
                  {formData.name
                    ? formData.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                    : <GraduationCap className="w-7 h-7 text-white/60" />}
                </div>
                <p className="font-extrabold text-lg leading-tight">{formData.name || "New Teacher"}</p>
                {formData.role && (
                  <p className="text-white/60 text-xs mt-1">
                    {{ classTeacher: "Class Teacher", subjectTeacher: "Subject Teacher", both: "Class & Subject" }[formData.role] || formData.role}
                  </p>
                )}
                {formData.subject && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
                    <BookOpen className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs font-bold text-yellow-300">{formData.subject}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {STEPS.map((step) => {
                const done = stepComplete(step.id);
                const active = currentStep === step.id;
                return (
                  <button key={step.id} type="button" onClick={() => goTo(step.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all border-b border-gray-50 last:border-0 ${active ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${done && !active ? "bg-emerald-500" : active ? `bg-gradient-to-br ${step.gradient}` : "bg-gray-100"}`}>
                      {done && !active
                        ? <CheckCircle2 className="w-4 h-4 text-white" />
                        : <step.icon className={`w-4 h-4 ${active ? "text-white" : "text-gray-400"}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold leading-none ${active ? "text-gray-900" : done ? "text-emerald-700" : "text-gray-500"}`}>{step.label}</p>
                      <p className={`text-xs mt-0.5 ${done && !active ? "text-emerald-500" : "text-gray-400"}`}>{done && !active ? "Completed" : step.sub}</p>
                    </div>
                    {active && <ChevronRight className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Help box */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-700 mb-1">Before you start</p>
                  <p className="text-xs text-amber-600 leading-relaxed">Have the teacher's credentials, qualification certificates, and contact details ready.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — Form ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile step tabs */}
            <div className="lg:hidden flex gap-2 mb-5 overflow-x-auto pb-1">
              {STEPS.map((s) => {
                const done = stepComplete(s.id);
                const active = currentStep === s.id;
                return (
                  <button key={s.id} type="button" onClick={() => goTo(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all ${active ? `bg-gradient-to-r ${s.gradient} text-white border-transparent shadow-md` : done ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-gray-500 border-gray-200"}`}>
                    {done && !active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <s.icon className="w-3.5 h-3.5" />}
                    {s.label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(formData); }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={currentStep} custom={direction} variants={slide} initial="enter" animate="center" exit="exit">

                  {/* Step banner */}
                  <div className={`rounded-2xl bg-gradient-to-r ${currentStepData.gradient} p-6 mb-5 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center">
                          <currentStepData.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Step {currentStep} of {STEPS.length}</p>
                          <h2 className="text-xl font-extrabold text-white">{currentStepData.label}</h2>
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-white/20">{String(currentStep).padStart(2, "0")}</div>
                    </div>
                    <div className="relative z-10 mt-4">
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* ── STEP 1: Personal Info ── */}
                  {currentStep === 1 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                      <Field label="Full Name" required>
                        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required className={inputCls} />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Email Address" required>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="teacher@school.com" required className={`${inputCls} pl-10`} />
                          </div>
                        </Field>
                        <Field label="Phone Number" required>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+234 800 000 0000" required className={`${inputCls} pl-10`} />
                          </div>
                        </Field>
                      </div>
                      <Field label="Residential Address">
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input name="address" value={formData.address} onChange={handleChange} placeholder="Home address" className={`${inputCls} pl-10`} />
                        </div>
                      </Field>
                    </div>
                  )}

                  {/* ── STEP 2: Role & Assignment ── */}
                  {currentStep === 2 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                      <Field label="Teacher Role" required>
                        <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v, class_id: "", subject: "" })}>
                          <SelectTrigger className={`${inputCls} w-full`}>
                            <SelectValue placeholder="Select a role…" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="classTeacher">Class Teacher</SelectItem>
                            <SelectItem value="subjectTeacher">Subject Teacher</SelectItem>
                            <SelectItem value="both">Class & Subject Teacher</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>

                      {(formData.role === "subjectTeacher" || formData.role === "both") && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                          <Field label="Assigned Subject" required>
                            <div className="relative">
                              <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Mathematics" className={`${inputCls} pl-10`} />
                            </div>
                          </Field>
                        </motion.div>
                      )}

                      {(formData.role === "classTeacher" || formData.role === "both") && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                          <Field label="Assigned Class">
                            <Select value={formData.class_id} onValueChange={v => setFormData({ ...formData, class_id: v })}>
                              <SelectTrigger className={`${inputCls} w-full`}>
                                <SelectValue placeholder="Select a class…" />
                              </SelectTrigger>
                              <SelectContent>
                                {classes.map((cls: any) => (
                                  <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        </motion.div>
                      )}

                      {formData.role && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-yellow-600 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-yellow-800">Role selected</p>
                            <p className="text-xs text-yellow-600">
                              {{ classTeacher: "Class Teacher", subjectTeacher: "Subject Teacher", both: "Class & Subject Teacher" }[formData.role]}
                              {formData.subject && ` · ${formData.subject}`}
                              {formData.class_id && classes.length > 0 && ` · ${classes.find((c: any) => c._id === formData.class_id)?.name || ""}`}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* ── STEP 3: Qualifications ── */}
                  {currentStep === 3 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Highest Qualification" required>
                          <div className="relative">
                            <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. B.Sc. Education" required className={`${inputCls} pl-10`} />
                          </div>
                        </Field>
                        <Field label="Specialization">
                          <Input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Mathematics" className={inputCls} />
                        </Field>
                      </div>
                      <Field label="Years of Experience" required>
                        <Input name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" required className={inputCls} />
                      </Field>
                    </div>
                  )}

                  {/* ── STEP 4: Review ── */}
                  {currentStep === 4 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-200 p-5">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Registration Summary</p>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          {[
                            { label: "Full Name", value: formData.name || "—" },
                            { label: "Email", value: formData.email || "—" },
                            { label: "Phone", value: formData.phone || "—" },
                            { label: "Address", value: formData.address || "—" },
                            { label: "Role", value: { classTeacher: "Class Teacher", subjectTeacher: "Subject Teacher", both: "Class & Subject" }[formData.role] || "—" },
                            { label: "Subject", value: formData.subject || "—" },
                            { label: "Class", value: classes.find((c: any) => c._id === formData.class_id)?.name || "—" },
                            { label: "Qualification", value: formData.qualification || "—" },
                            { label: "Specialization", value: formData.specialization || "—" },
                            { label: "Experience", value: formData.experience ? `${formData.experience} year(s)` : "—" },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between gap-2">
                              <span className="text-gray-400 font-medium">{label}</span>
                              <span className="font-bold text-gray-900 text-right truncate max-w-[60%]">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">
                          A temporary password will be generated after registration. Share it with the teacher to log in for the first time.
                        </p>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* ── Navigation ── */}
              <div className="flex items-center justify-between mt-6">
                <Button type="button" variant="outline"
                  onClick={() => currentStep === 1 ? navigate("/portal/admin/teachers") : goTo(currentStep - 1)}
                  className="rounded-xl border-gray-200 font-semibold h-11 px-5">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>

                {currentStep < STEPS.length ? (
                  <Button type="button" onClick={() => goTo(currentStep + 1)}
                    className={`bg-gradient-to-r ${currentStepData.gradient} hover:opacity-90 text-white font-bold gap-2 shadow-md rounded-xl h-11 px-6`}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={saveMutation.isPending || isLoadingTeacher}
                    className="bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 text-white font-bold gap-2 shadow-md rounded-xl h-11 px-8">
                    {saveMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isEdit ? "Updating..." : "Registering..."}
                      </span>
                    ) : (
                      <><Save className="w-4 h-4" /> {isEdit ? "Update Teacher" : "Register Teacher"}</>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Credentials Modal ── */}
      <Dialog open={!!credentials} onOpenChange={(open) => { if (!open) { setCredentials(null); navigate("/portal/admin/teachers"); } }}>
        <DialogContent className="max-w-sm p-0 gap-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] px-6 py-5 relative">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-white">Teacher Registered!</DialogTitle>
                <p className="text-xs text-white/50 mt-0.5">Share these login credentials with the teacher</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-gray-400 font-medium">Employee / Reg Number</p>
                <p className="font-mono font-bold text-gray-900 mt-0.5">{credentials?.reg_number}</p>
              </div>
              <button onClick={() => copy(credentials!.reg_number, "Reg number")}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center text-gray-500 transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-gray-400 font-medium">Temporary Password</p>
                <p className="font-mono font-bold text-gray-900 mt-0.5">{credentials?.password}</p>
              </div>
              <button onClick={() => copy(credentials!.password, "Password")}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center text-gray-500 transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center pt-1">The teacher should change their password after first login.</p>
            <Button
              className="w-full bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 text-white font-bold rounded-xl h-11"
              onClick={() => { setCredentials(null); navigate("/portal/admin/teachers"); }}
            >
              Done — Go to Teacher List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherRegistration;

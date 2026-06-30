import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User, Save, Mail, Phone, Users, GraduationCap,
  Search, X, ChevronDown, ArrowLeft, Heart, MapPin,
  CheckCircle2, ChevronRight, BookOpen, AlertCircle, KeyRound, Copy,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

// ── Step definitions ──────────────────────────────────────────────────────
const STEPS = [
  {
    id: 1, key: "student", label: "Student Info", sub: "Personal details",
    icon: User, gradient: "from-[#0a2342] to-[#1a5276]", color: "blue",
  },
  {
    id: 2, key: "academic", label: "Academic", sub: "Class & program",
    icon: GraduationCap, gradient: "from-yellow-400 to-amber-500", color: "yellow",
  },
  {
    id: 3, key: "parent", label: "Parent / Guardian", sub: "Contact details",
    icon: Users, gradient: "from-sky-500 to-blue-600", color: "sky",
  },
  {
    id: 4, key: "medical", label: "Medical", sub: "Health information",
    icon: Heart, gradient: "from-rose-500 to-pink-600", color: "rose",
  },
];

const inputCls = "h-12 rounded-xl bg-white border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm placeholder:text-gray-400 shadow-sm";
const selectCls = "w-full h-12 rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none";
const labelCls = "text-sm font-semibold text-gray-700 mb-2 block";

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className={labelCls}>{label} {required && <span className="text-rose-500">*</span>}</label>
    {children}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────
const StudentRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const studentId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState(1);
  const [parentSearch, setParentSearch] = useState("");
  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);
  const parentDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (parentDropdownRef.current && !parentDropdownRef.current.contains(e.target as Node))
        setParentDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", dateOfBirth: "", gender: "",
    address: "", program: "", class_id: "", parent_id: "",
    parentName: "", parentEmail: "", parentPhone: "",
    emergencyContact: "", medicalInfo: "",
  });

  const [credentials, setCredentials] = useState<{ reg_number: string; password: string } | null>(null);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  const { isLoading: isLoadingStudent } = useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      const res = await api.get(`/users/students/${studentId}`);
      const s = res.data;
      const [firstName = "", ...rest] = (s.user_id?.full_name || s.full_name || "").split(" ");
      setFormData({
        firstName, lastName: rest.join(" "),
        dateOfBirth: s.date_of_birth?.split("T")[0] || "",
        gender: s.gender || "", address: s.address || "",
        program: s.program || "", class_id: s.class_id?._id || s.class_id || "",
        parent_id: s.parent_id?._id || s.parent_id || "",
        parentName: s.parent_name || "", parentEmail: s.parent_email || "",
        parentPhone: s.parent_phone || "", emergencyContact: s.emergency_contact || "",
        medicalInfo: s.medical_info || "",
      });
      return s;
    },
    enabled: isEdit && !!studentId,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => (await api.get("/classes")).data || [],
  });

  const { data: parents = [] } = useQuery({
    queryKey: ["parents"],
    queryFn: async () => (await api.get("/users/parents")).data || [],
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        full_name: `${data.firstName} ${data.lastName}`.trim(),
        date_of_birth: data.dateOfBirth, gender: data.gender, address: data.address,
        program: data.program, class_id: data.class_id, parent_id: data.parent_id || undefined,
        parent_name: data.parentName, parent_email: data.parentEmail, parent_phone: data.parentPhone,
        emergency_contact: data.emergencyContact, medical_info: data.medicalInfo,
      };
      if (isEdit) return (await api.put(`/users/students/${studentId}`, payload)).data;
      return (await api.post("/users/students", payload)).data;
    },
    onSuccess: (data) => {
      if (isEdit) {
        toast({ title: "Student Updated!", description: "Information updated successfully." });
        navigate("/portal/admin/students");
      } else {
        const creds = data.credentials || data;
        setCredentials({ reg_number: creds.reg_number, password: creds.password });
      }
    },
    onError: (error: any) => {
      toast({
        title: isEdit ? "Update Failed" : "Registration Failed",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); registerMutation.mutate(formData); };

  const filteredParents = parents.filter((p: any) => {
    const q = parentSearch.toLowerCase();
    return p.user_id?.full_name?.toLowerCase().includes(q) || p.user_id?.email?.toLowerCase().includes(q);
  });

  const stepComplete = (id: number) => {
    if (id === 1) return !!formData.firstName && !!formData.lastName && !!formData.dateOfBirth && !!formData.gender;
    if (id === 2) return !!formData.program && !!formData.class_id;
    if (id === 3) return !!formData.parentName && !!formData.parentEmail && !!formData.parentPhone;
    return true;
  };

  const currentStepData = STEPS[currentStep - 1];

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 30 : -30 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -30 : 30, transition: { duration: 0.2 } }),
  };
  const [direction, setDirection] = useState(1);
  const goTo = (step: number) => { setDirection(step > currentStep ? 1 : -1); setCurrentStep(step); };

  return (
    <div className="min-h-full bg-gray-50/80">
      <div className="max-w-6xl mx-auto p-6">

        {/* ── Page Header ── */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/portal/admin/students">
            <motion.button whileHover={{ x: -2 }} className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 hover:shadow-md transition-all">
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {isEdit ? "Edit Student Details" : "Register New Student"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEdit ? "Update the student's information below" : "Complete all sections to enrol a new student"}
            </p>
          </div>
        </div>

        <div className="flex gap-6">

          {/* ── Left Sidebar — Steps ── */}
          <div className="hidden lg:flex flex-col w-64 shrink-0">
            {/* Student preview card */}
            <div className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] rounded-2xl p-6 mb-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center text-2xl font-extrabold mb-4">
                  {formData.firstName ? `${formData.firstName[0]}${formData.lastName[0] || ""}` : <User className="w-7 h-7 text-white/60" />}
                </div>
                <p className="font-extrabold text-lg leading-tight">
                  {formData.firstName || formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`.trim()
                    : "New Student"}
                </p>
                {formData.program && <p className="text-white/60 text-xs mt-1 capitalize">{formData.program.replace("-", " ")}</p>}
                {formData.class_id && classes.length > 0 && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
                    <BookOpen className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs font-bold text-yellow-300">
                      {classes.find((c: any) => c._id === formData.class_id)?.name || ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Step list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {STEPS.map((step, i) => {
                const done = stepComplete(step.id);
                const active = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goTo(step.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all border-b border-gray-50 last:border-0 ${active ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
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
                  <p className="text-xs text-amber-600 leading-relaxed">Ensure you have the student's birth certificate, parent details, and medical records ready.</p>
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

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={currentStep} custom={direction} variants={slide} initial="enter" animate="center" exit="exit">

                  {/* Step header */}
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
                      <div className="text-right">
                        <div className="text-3xl font-extrabold text-white/20">{String(currentStep).padStart(2, "0")}</div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="relative z-10 mt-4">
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* ── STEP 1: Student Info ── */}
                  {currentStep === 1 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="First Name" required>
                          <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" required className={inputCls} />
                        </Field>
                        <Field label="Last Name" required>
                          <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" required className={inputCls} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Date of Birth" required>
                          <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required className={inputCls} />
                        </Field>
                        <Field label="Gender" required>
                          <div className="relative">
                            <select name="gender" value={formData.gender} onChange={handleChange} required className={selectCls}>
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </Field>
                      </div>
                      <Field label="Home Address" required>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input name="address" value={formData.address} onChange={handleChange} placeholder="Full home address" required className={`${inputCls} pl-10`} />
                        </div>
                      </Field>
                    </div>
                  )}

                  {/* ── STEP 2: Academic ── */}
                  {currentStep === 2 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                      <Field label="Program" required>
                        <div className="relative">
                          <select name="program" value={formData.program} onChange={handleChange} required className={selectCls}>
                            <option value="">Select program</option>
                            <option value="pre-school">Pre-School / Nursery</option>
                            <option value="primary">Primary School</option>
                            <option value="junior-secondary">Junior Secondary (JSS)</option>
                            <option value="senior-secondary">Senior Secondary (SS)</option>
                            <option value="vocational">Vocational Training</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </Field>
                      <Field label="Class / Grade" required>
                        <div className="relative">
                          <select name="class_id" value={formData.class_id} onChange={handleChange} required className={selectCls}>
                            <option value="">Select class</option>
                            {classes.map((cls: any) => (
                              <option key={cls._id} value={cls._id}>{cls.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </Field>

                      {formData.program && formData.class_id && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-yellow-600 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-yellow-800">Academic details set</p>
                            <p className="text-xs text-yellow-600">
                              {formData.program.replace("-", " ")} · {classes.find((c: any) => c._id === formData.class_id)?.name}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* ── STEP 3: Parent / Guardian ── */}
                  {currentStep === 3 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                      <Field label="Link to Existing Parent Account">
                        <div className="relative" ref={parentDropdownRef}>
                          <div
                            className={`flex items-center h-12 rounded-xl border bg-white px-3.5 gap-2 cursor-pointer shadow-sm transition-colors ${parentDropdownOpen ? "border-primary ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300"}`}
                            onClick={() => setParentDropdownOpen((o) => !o)}
                          >
                            <Search className="w-4 h-4 text-gray-400 shrink-0" />
                            {formData.parent_id ? (
                              <>
                                <span className="text-sm flex-1 truncate text-gray-800">
                                  {(() => {
                                    const p = parents.find((p: any) => p._id === formData.parent_id) as any;
                                    return p ? `${p.user_id?.full_name}${p.relationship ? ` (${p.relationship})` : ""}` : "Selected";
                                  })()}
                                </span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, parent_id: "" }); setParentSearch(""); }}>
                                  <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
                                </button>
                              </>
                            ) : (
                              <>
                                <input type="text" className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
                                  placeholder="Search parent by name or email…"
                                  value={parentSearch}
                                  onChange={(e) => { setParentSearch(e.target.value); setParentDropdownOpen(true); }}
                                  onClick={(e) => e.stopPropagation()} />
                                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                              </>
                            )}
                          </div>
                          <AnimatePresence>
                            {parentDropdownOpen && (
                              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                                className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                                <div className="px-4 py-2.5 text-xs text-gray-400 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                                  onClick={() => { setFormData({ ...formData, parent_id: "" }); setParentSearch(""); setParentDropdownOpen(false); }}>
                                  — None (unlink parent) —
                                </div>
                                {filteredParents.map((p: any) => (
                                  <div key={p._id} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"
                                    onClick={() => { setFormData({ ...formData, parent_id: p._id }); setParentSearch(""); setParentDropdownOpen(false); }}>
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {p.user_id?.full_name?.[0]}
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold text-gray-900">{p.user_id?.full_name} {p.relationship && <span className="text-gray-400 font-normal text-xs">({p.relationship})</span>}</p>
                                        <p className="text-xs text-gray-400">{p.user_id?.email}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {filteredParents.length === 0 && <p className="px-4 py-4 text-sm text-gray-400 text-center">No parents found.</p>}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </Field>

                      <div className="h-px bg-gray-100" />

                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Parent / Guardian Name" required>
                          <div className="relative">
                            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Full name" required className={`${inputCls} pl-10`} />
                          </div>
                        </Field>
                        <Field label="Parent Email" required>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input name="parentEmail" type="email" value={formData.parentEmail} onChange={handleChange} placeholder="parent@email.com" required className={`${inputCls} pl-10`} />
                          </div>
                        </Field>
                        <Field label="Parent Phone" required>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input name="parentPhone" value={formData.parentPhone} onChange={handleChange} placeholder="+234 800 000 0000" required className={`${inputCls} pl-10`} />
                          </div>
                        </Field>
                        <Field label="Emergency Contact">
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Name & phone number" className={`${inputCls} pl-10`} />
                          </div>
                        </Field>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 4: Medical ── */}
                  {currentStep === 4 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                      <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl mb-2">
                        <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-rose-700">
                          This information is confidential and only accessible to authorised staff. It helps us ensure the student's wellbeing.
                        </p>
                      </div>
                      <Field label="Allergies / Medical Conditions">
                        <textarea
                          name="medicalInfo"
                          value={formData.medicalInfo}
                          onChange={handleChange}
                          placeholder="List any allergies, chronic conditions, medications, or special needs the school should be aware of..."
                          className="w-full min-h-[160px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-gray-400 shadow-sm"
                        />
                      </Field>

                      {/* Summary */}
                      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-200 p-5">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Registration Summary</p>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          {[
                            { label: "Full Name", value: `${formData.firstName} ${formData.lastName}`.trim() || "—" },
                            { label: "Date of Birth", value: formData.dateOfBirth || "—" },
                            { label: "Gender", value: formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : "—" },
                            { label: "Program", value: formData.program ? formData.program.replace(/-/g, " ") : "—" },
                            { label: "Class", value: classes.find((c: any) => c._id === formData.class_id)?.name || "—" },
                            { label: "Parent", value: formData.parentName || "—" },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between gap-2">
                              <span className="text-gray-400 font-medium">{label}</span>
                              <span className="font-bold text-gray-900 text-right truncate max-w-[60%] capitalize">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* ── Navigation ── */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => currentStep === 1 ? navigate("/portal/admin/students") : goTo(currentStep - 1)}
                  className="rounded-xl border-gray-200 font-semibold h-11 px-5"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={() => goTo(currentStep + 1)}
                    className={`bg-gradient-to-r ${currentStepData.gradient} hover:opacity-90 text-white font-bold gap-2 shadow-md rounded-xl h-11 px-6`}
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending || isLoadingStudent}
                    className="bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 text-white font-bold gap-2 shadow-md rounded-xl h-11 px-8"
                  >
                    {registerMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isEdit ? "Updating..." : "Registering..."}
                      </span>
                    ) : (
                      <><Save className="w-4 h-4" /> {isEdit ? "Update Student" : "Register Student"}</>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Credentials Modal ── */}
      <Dialog open={!!credentials} onOpenChange={(open) => { if (!open) { setCredentials(null); navigate("/portal/admin/students"); } }}>
        <DialogContent className="max-w-sm p-0 gap-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] px-6 py-5 relative">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-white">Student Registered!</DialogTitle>
                <p className="text-xs text-white/50 mt-0.5">Share these login credentials with the student</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-gray-400 font-medium">Registration Number</p>
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
            <p className="text-xs text-gray-400 text-center pt-1">The student should change their password after first login.</p>
            <Button
              className="w-full bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 text-white font-bold rounded-xl h-11"
              onClick={() => { setCredentials(null); navigate("/portal/admin/students"); }}
            >
              Done — Go to Student List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentRegistration;

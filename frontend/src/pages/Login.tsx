import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield, BookOpen, User, Users,
  ArrowRight, ArrowLeft, Eye, EyeOff, Lock, Hash, CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const roles = [
  {
    id: "admin",
    icon: Shield,
    title: "Administrator",
    description: "School management & control",
    gradient: "from-[#0a2342] to-[#1a5276]",
    iconBg: "bg-gradient-to-br from-[#0a2342] to-[#1a5276]",
    lightBg: "bg-blue-50",
    accent: "text-[#0d3460]",
    border: "border-blue-200 hover:border-[#0d3460]",
    emoji: "🛡️",
  },
  {
    id: "teacher",
    icon: BookOpen,
    title: "Teacher",
    description: "Classes, grades & attendance",
    gradient: "from-yellow-400 to-amber-500",
    iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500",
    lightBg: "bg-yellow-50",
    accent: "text-amber-600",
    border: "border-yellow-200 hover:border-amber-400",
    emoji: "📚",
  },
  {
    id: "student",
    icon: User,
    title: "Student",
    description: "Timetable, results & assignments",
    gradient: "from-[#0d3460] to-[#1a5276]",
    iconBg: "bg-gradient-to-br from-[#0d3460] to-[#1a5276]",
    lightBg: "bg-sky-50",
    accent: "text-[#0d3460]",
    border: "border-sky-200 hover:border-[#0d3460]",
    emoji: "🎒",
  },
  {
    id: "parent",
    icon: Users,
    title: "Parent",
    description: "Child's progress & reports",
    gradient: "from-amber-400 to-yellow-500",
    iconBg: "bg-gradient-to-br from-amber-400 to-yellow-500",
    lightBg: "bg-amber-50",
    accent: "text-amber-600",
    border: "border-amber-200 hover:border-amber-400",
    emoji: "👨‍👩‍👧",
  },
];

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50, transition: { duration: 0.2 } }),
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const role = roles.find(r => r.id === selectedRole);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { reg_number: string; password: string }) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.token, {
        _id: data._id,
        name: data.full_name,
        email: data.email || data.reg_number,
        role: data.role as 'admin' | 'teacher' | 'student' | 'parent',
      });
      navigate(`/portal/${data.role}`);
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRoleSelect = (id: string) => {
    setSelectedRole(id);
    setDirection(1);
    setStep(2);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(1);
    setRegNumber("");
    setPassword("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ reg_number: regNumber, password });
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex relative overflow-hidden">

      {/* ── LEFT PANEL — dark navy ── */}
      <div className="hidden lg:flex w-[42%] bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] flex-col justify-between p-12 relative overflow-hidden shrink-0">
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

        {/* Top content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4 mt-4">
            Your School,<br />
            <span className="text-yellow-300">All In One Place.</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Access grades, timetables, attendance, reports and more — all from a single secure portal.
          </p>
        </div>

        {/* Role pills */}
        <div className="relative z-10 space-y-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = selectedRole === r.id;
            return (
              <motion.div
                key={r.id}
                animate={{ opacity: isActive ? 1 : 0.45, x: isActive ? 6 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className={`w-9 h-9 rounded-xl ${r.iconBg} flex items-center justify-center shadow-md shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-none">{r.title}</p>
                  <p className="text-white/45 text-xs mt-0.5">{r.description}</p>
                </div>
                {isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                    <CheckCircle2 className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">

        {/* Mobile logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src="/infogate-school-badge.svg" alt="Infogate" className="h-9 w-auto" />
            <span className="font-extrabold text-gray-900 text-sm">Infogate Schools</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px]">

          <AnimatePresence mode="wait" custom={direction}>

            {/* ── STEP 1: Role Selection ── */}
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={slide} initial="enter" animate="center" exit="exit">

                <div className="mb-8">
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back!</h1>
                  <p className="text-muted-foreground text-sm">Select who you're signing in as to continue.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    return (
                      <motion.button
                        key={r.id}
                        type="button"
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleRoleSelect(r.id)}
                        className={`group relative rounded-2xl border-2 ${r.border} bg-white p-5 text-left transition-all shadow-sm hover:shadow-lg overflow-hidden`}
                      >
                        <div className={`absolute inset-0 ${r.lightBg} opacity-0 group-hover:opacity-40 transition-opacity`} />
                        <div className="relative z-10">
                          <div className={`w-12 h-12 rounded-xl ${r.iconBg} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="font-extrabold text-gray-900 text-sm leading-none mb-1">{r.title}</p>
                          <p className="text-xs text-muted-foreground leading-snug">{r.description}</p>
                        </div>
                        <ArrowRight className={`absolute bottom-4 right-4 w-4 h-4 ${r.accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  New student?{" "}
                  <Link to="/admissions" className="text-primary font-bold hover:underline">
                    Apply for Admission →
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ── STEP 2: Login Form ── */}
            {step === 2 && role && (
              <motion.div key="step2" custom={direction} variants={slide} initial="enter" animate="center" exit="exit">

                {/* Back */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-900 transition-colors mb-8 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to roles
                </button>

                {/* Role header */}
                <div className={`rounded-2xl ${role.lightBg} border-2 ${role.border} p-5 flex items-center gap-4 mb-8`}>
                  <div className={`w-14 h-14 rounded-2xl ${role.iconBg} flex items-center justify-center shadow-lg shrink-0`}>
                    <role.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className={`text-xs font-extrabold uppercase tracking-widest ${role.accent}`}>Signing in as</span>
                    <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{role.title}</h2>
                  </div>
                  <span className="text-3xl">{role.emoji}</span>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Registration Number</label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        placeholder="e.g. STU-2024-001"
                        required
                        className="h-12 pl-10 rounded-xl bg-white border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="h-12 pl-10 pr-12 rounded-xl bg-white border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 accent-primary" />
                      <span className="text-xs text-muted-foreground">Remember me</span>
                    </label>
                    <a href="#" className={`text-xs font-bold hover:underline ${role.accent}`}>
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loginMutation.isPending}
                    className={`w-full bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white font-bold shadow-lg h-12 text-base transition-all`}
                  >
                    {loginMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Signing In...
                      </span>
                    ) : (
                      <>Sign In as {role.title} <ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs text-muted-foreground mt-6">
                  New student?{" "}
                  <Link to="/admissions" className="text-primary font-bold hover:underline">
                    Apply for Admission
                  </Link>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;

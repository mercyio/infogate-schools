import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  BookOpen,
  User,
  Users,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import heroSchool from "@/assets/hero-school.png";

import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const roles = [
  {
    id: "admin",
    icon: Shield,
    title: "Administrator",
    description: "Full school management access",
    color: "bg-admin",
    gradient: "from-admin to-lavender",
  },
  {
    id: "teacher",
    icon: BookOpen,
    title: "Teacher",
    description: "Manage classes and students",
    color: "bg-teacher",
    gradient: "from-teacher to-primary",
  },
  {
    id: "student",
    icon: User,
    title: "Student",
    description: "Access learning portal",
    color: "bg-student",
    gradient: "from-student to-secondary",
  },
  {
    id: "parent",
    icon: Users,
    title: "Parent",
    description: "Track your child's progress",
    color: "bg-parent",
    gradient: "from-parent to-coral",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { reg_number: string; password: string }) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // The backend returns { _id, reg_number, role, full_name, token, email }
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
        description: error.response?.data?.message || "Invalid credentials or server error.",
        variant: "destructive",
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast({
        title: "Role Required",
        description: "Please select a role before signing in.",
        variant: "destructive"
      });
      return;
    }
    
    loginMutation.mutate({ reg_number: regNumber, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <img src="/infogate-school-badge.svg" alt="Infogate Schools" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold">Infogate Schools</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                School Portal
              </p>
            </div>
          </Link>

          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground mb-8">
            Select your role and sign in to continue
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {roles.map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role.id)}
                className={`playful-card p-4 text-left transition-all ${
                  selectedRole === role.id
                    ? `ring-2 ring-offset-2 ring-${role.id}`
                    : ""
                }`}
                style={{
                  borderColor: selectedRole === role.id ? `hsl(var(--${role.id}))` : undefined,
                }}
              >
                <div className={`w-10 h-10 ${role.color} rounded-xl flex items-center justify-center mb-2`}>
                  <role.icon className="w-5 h-5 text-card" />
                </div>
                <h3 className="font-bold text-sm">{role.title}</h3>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Registration Number</label>
              <Input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="Enter your registration number"
                required
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline font-semibold">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant={selectedRole ? (selectedRole as "admin" | "teacher" | "student" | "parent") : "default"}
              size="lg"
              className="w-full"
              disabled={!selectedRole}
            >
              {selectedRole ? `Sign In as ${roles.find(r => r.id === selectedRole)?.title}` : "Select a Role"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/admissions" className="text-primary font-semibold hover:underline">
              Apply for Admission
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 relative">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        <img
          src={heroSchool}
          alt="School illustration"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
    </div>
  );
};

export default Login;

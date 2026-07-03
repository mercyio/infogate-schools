import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [regNumber, setRegNumber]       = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { reg_number: string; password: string }) => {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    },
    onSuccess: (data) => {
      login(data.token, {
        _id:   data._id,
        name:  data.full_name,
        email: data.email || data.reg_number,
        role:  data.role as "admin" | "teacher" | "student" | "parent",
      });
      navigate(`/portal/${data.role}`);
    },
    onError: (error: any) => {
      toast({
        title:       "Login Failed",
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
        variant:     "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ reg_number: regNumber, password });
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-400/10" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-yellow-400/10" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl px-14 pt-12 pb-10">

        {/* Logo + school name */}
        <div className="flex flex-col items-center mb-7">
          <img src="/infogate-school-badge.svg" alt="Infogate Schools" className="h-32 w-auto" />
          <h1 className="-mt-2 text-base font-extrabold text-gray-800 tracking-wide uppercase text-center">
            Infogate Schools
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Registration number */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-gray-500">
              Registration Number
            </label>
            <input
              type="text"
              value={regNumber}
              onChange={e => setRegNumber(e.target.value)}
              placeholder="e.g. STU-2024-001"
              required
              className="w-full h-13 px-4 py-3.5 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-semibold text-gray-500">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full h-13 px-4 py-3.5 pr-11 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-[#0a2342] cursor-pointer"
            />
            <span className="text-sm text-gray-500">Keep me logged in</span>
          </label>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-13 py-3.5 mt-1 rounded-lg bg-[#0a2342] hover:bg-[#0d3460] disabled:opacity-60 text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : "Sign In"}
          </button>
        </form>
      </div>

      {/* Go back */}
      <Link
        to="/"
        className="relative z-10 mt-5 flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
      >
        <span className="text-base">←</span> Go back
      </Link>

      {/* Footer */}
      <p className="relative z-10 mt-4 text-xs text-white/30 font-semibold tracking-wide">
        Powered by Infogate Schools
      </p>
    </div>
  );
};

export default Login;

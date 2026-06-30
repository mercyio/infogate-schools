import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  ArrowLeft,
  User,
  Bell,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  CreditCard,
  Plus,
  Check,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Award,
  Zap,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

// Default values for fields not yet in the DB
const defaultStudentStats = {
  attendanceRate: 0,
  attendanceHistory: [],
  totalFees: 0,
  paidFees: 0,
  feesBreakdown: [],
  paymentHistory: [],
  gpa: 0,
  gradeLevel: "N/A",
  academicPerformance: [],
  cumulativePerformance: [],
};

const StudentDetail = () => {
  const { studentId, classId } = useParams();
  const navigate = useNavigate();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const queryClient = useQueryClient();
  const [paymentDescription, setPaymentDescription] = useState("");

  const { data: realStudent, isLoading, isError } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const res = await api.get(`/users/students/${studentId}`);
      return res.data;
    },
    enabled: !!studentId,
  });

  // Must be declared before any early returns to satisfy Rules of Hooks
  const recordPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const res = await api.post(`/users/students/${studentId}/payments`, paymentData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', studentId] });
      toast.success("Payment recorded successfully");
      setPaymentDialogOpen(false);
      setPaymentAmount("");
      setPaymentMethod("");
      setPaymentDescription("");
    },
    onError: () => {
      toast.error("Failed to record payment");
    }
  });

  const sfProp = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Merge real data with empty defaults
  const student = realStudent ? {
    ...defaultStudentStats,
    id: realStudent._id || studentId,
    name: sfProp(realStudent, 'user_id.full_name') || realStudent.full_name || realStudent.name || "Student Name",
    admissionNo: realStudent.admission_number || realStudent.reg_number || realStudent.admissionNo || "N/A",
    gender: sfProp(realStudent, 'user_id.gender') || realStudent.gender || "N/A",
    dateOfBirth: realStudent.date_of_birth ? 
      (typeof realStudent.date_of_birth === 'string' ? realStudent.date_of_birth.split('T')[0] : 
       realStudent.date_of_birth instanceof Date ? realStudent.date_of_birth.toISOString().split('T')[0] : 
       "2000-01-01") : "2000-01-01",
    class: sfProp(realStudent, 'class_id.name') || sfProp(realStudent, 'class_id.className') || realStudent.grade || realStudent.class || "N/A",
    level: realStudent.program || realStudent.level || "N/A",
    gradeLevel: realStudent.grade || realStudent.gradeLevel || "N/A",
    address: realStudent.address || "N/A",
    parentName: realStudent.parent_name || realStudent.parentName || "N/A",
    parentPhone: realStudent.parent_phone || realStudent.parentPhone || "N/A",
    parentEmail: realStudent.parent_email || realStudent.parentEmail || "N/A",
    totalFees: Number(realStudent.total_fees || realStudent.totalFees || sfProp(realStudent, 'class_id.fee_structure.total')) || 0,
    paidFees: Number(realStudent.paid_fees || realStudent.paidFees) || 0,
    paymentHistory: Array.isArray(realStudent.payment_history || realStudent.paymentHistory) ? (realStudent.payment_history || realStudent.paymentHistory) : [],
    academicPerformance: Array.isArray(realStudent.academic_performance || realStudent.academicPerformance) ? (realStudent.academic_performance || realStudent.academicPerformance) : [],
    attendanceHistory: Array.isArray(realStudent.attendance_history || realStudent.attendanceHistory) ? (realStudent.attendance_history || realStudent.attendanceHistory) : [],
    gpa: Number(realStudent.gpa) || 0,
    attendanceRate: Number(realStudent.attendanceRate) || 0,
  } : { 
    ...defaultStudentStats, 
    id: studentId || "N/A",
    name: "Student Profile", 
    admissionNo: "N/A", 
    dateOfBirth: "2000-01-01",
    gender: "N/A",
    class: "N/A",
    level: "N/A",
    address: "N/A",
    parentName: "N/A",
    parentPhone: "N/A",
    parentEmail: "N/A"
  };

  const studentName = String(student.name || "Student Profile");
  const academicPerformance = Array.isArray(student.academicPerformance)
    ? student.academicPerformance.filter(Boolean)
    : [];
  const attendanceHistory = Array.isArray(student.attendanceHistory)
    ? student.attendanceHistory.filter(Boolean)
    : [];
  const paymentHistory = Array.isArray(student.paymentHistory)
    ? student.paymentHistory.filter(Boolean)
    : [];
  const loginPassword = sfProp(realStudent, 'user_id.password') || "********";

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading student profile...</div>;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Student profile unavailable</h1>
          <p className="text-muted-foreground mb-6">
            The student record could not be loaded. The link may be invalid, or the record may not exist.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
            <Button onClick={() => navigate('/portal/admin/students')}>Open Student List</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!studentId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Student not found</h1>
          <p className="text-muted-foreground mb-6">
            The page was opened without a valid student id.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
            <Button onClick={() => navigate('/portal/admin/students')}>Open Student List</Button>
          </div>
        </div>
      </div>
    );
  }

  const totalFees = Number(student.totalFees) || 0;
  const paidFees = Number(student.paidFees) || 0;
  const outstanding = Math.max(0, totalFees - paidFees);
  const paymentProgress = totalFees > 0 ? (paidFees / totalFees) * 100 : 0;

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-primary";
    if (rate >= 75) return "text-secondary";
    return "text-orange-500";
  };

  const handleRecordPayment = () => {
    recordPaymentMutation.mutate({
      description: paymentDescription,
      amount: Number(paymentAmount),
      method: paymentMethod,
      reference: "TRF-" + Date.now().toString().slice(-6),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navy header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-yellow-400/20 border border-yellow-400/30 text-yellow-200 text-xs font-bold">
              Reg No: {student.admissionNo}
            </span>
          </div>

        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left sidebar ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Avatar + name */}
              <div className="text-center pt-7 pb-5 px-5 border-b border-gray-50">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl text-white font-extrabold text-2xl"
                  style={{ background: "linear-gradient(135deg, #0a2342 0%, #1a5276 100%)" }}
                >
                  {studentName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <h2 className="font-extrabold text-xl text-gray-900">{student.name}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{student.admissionNo}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-yellow-400 text-gray-900 text-xs font-extrabold">
                  {student.class || "No Class"}
                </span>
              </div>

              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm">Personal Info</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { icon: Calendar, label: "Date of Birth", value: student.dateOfBirth },
                  { icon: User,     label: "Gender",        value: student.gender },
                  { icon: MapPin,   label: "Address",       value: student.address },
                  { icon: Shield,   label: "Login Password",value: loginPassword },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-7 h-7 rounded-lg bg-[#0a2342]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[#0a2342]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                  <Users className="w-3 h-3 text-gray-900" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm">Parent / Guardian</h3>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: "Name",  value: student.parentName },
                  { label: "Phone", value: student.parentPhone },
                  { label: "Email", value: student.parentEmail },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl bg-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 break-words mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="academics" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-xl p-1 bg-white border border-gray-100 shadow-sm mb-5 h-11">
                <TabsTrigger
                  value="academics"
                  className="rounded-lg text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0a2342] data-[state=active]:to-[#1a5276] data-[state=active]:text-white flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" /> Academics
                </TabsTrigger>
                <TabsTrigger
                  value="attendance"
                  className="rounded-lg text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0a2342] data-[state=active]:to-[#1a5276] data-[state=active]:text-white flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" /> Attendance
                </TabsTrigger>
                <TabsTrigger
                  value="fees"
                  className="rounded-lg text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0a2342] data-[state=active]:to-[#1a5276] data-[state=active]:text-white flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Fees
                </TabsTrigger>
              </TabsList>

              {/* ── Academics ── */}
              <TabsContent value="academics" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-2xl p-5 text-white">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1">Current GPA</p>
                    <p className="text-4xl font-extrabold">{(Number(student.gpa) || 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Grade Level</p>
                    <p className="text-4xl font-extrabold text-[#0a2342]">{student.gradeLevel || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#0a2342]/10 flex items-center justify-center">
                      <BookOpen className="w-3 h-3 text-[#0a2342]" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Subject Performance</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-extrabold text-gray-500 text-xs uppercase">Subject</TableHead>
                        <TableHead className="text-center font-extrabold text-gray-500 text-xs uppercase">Score</TableHead>
                        <TableHead className="text-center font-extrabold text-gray-500 text-xs uppercase">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {academicPerformance.length > 0 ? (
                        academicPerformance.map((p: any, idx: number) => (
                          <TableRow key={idx} className="hover:bg-gray-50/70">
                            <TableCell className="font-semibold text-gray-900">{p.subject || "N/A"}</TableCell>
                            <TableCell className="text-center font-extrabold text-[#0a2342]">{p.score || 0}</TableCell>
                            <TableCell className="text-center">
                              <span className="px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-extrabold">
                                {p.grade || "N/A"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-10 text-gray-400 text-sm">
                            No academic records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* ── Attendance ── */}
              <TabsContent value="attendance" className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-2xl p-5 text-white">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1">Overall Rate</p>
                    <p className="text-4xl font-extrabold">{student.attendanceRate}%</p>
                    <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${(student.attendanceRate || 0) >= 80 ? "bg-green-400" : (student.attendanceRate || 0) >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                        style={{ width: `${student.attendanceRate || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Academic Level</p>
                    <p className="text-2xl font-extrabold text-[#0a2342] mt-1">{student.level}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#0a2342]/10 flex items-center justify-center">
                      <Clock className="w-3 h-3 text-[#0a2342]" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Monthly Status</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-extrabold text-gray-500 text-xs uppercase">Month</TableHead>
                        <TableHead className="text-center font-extrabold text-gray-500 text-xs uppercase">Rate</TableHead>
                        <TableHead className="text-center font-extrabold text-gray-500 text-xs uppercase">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceHistory.length > 0 ? (
                        attendanceHistory.map((month: any, idx: number) => {
                          const rate = Number(month.rate) || 0;
                          const good = rate >= 75;
                          return (
                            <TableRow key={idx} className="hover:bg-gray-50/70">
                              <TableCell className="font-semibold text-gray-900">{month.month || "N/A"}</TableCell>
                              <TableCell className="text-center font-extrabold text-[#0a2342]">{rate}%</TableCell>
                              <TableCell className="text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${good ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                                  {good ? "Excellent" : "Needs Improvement"}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-10 text-gray-400 text-sm">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* ── Fees ── */}
              <TabsContent value="fees" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div />
                  <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-md">
                        <Plus className="w-4 h-4" /> Record Payment
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] -m-6 mb-5 p-6 rounded-t-xl">
                          <DialogTitle className="text-white font-extrabold text-lg flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-yellow-400" /> Record Payment
                          </DialogTitle>
                          <p className="text-white/50 text-xs mt-1">{student.name}</p>
                        </div>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="card">Online Card</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Amount (₦)</Label>
                            <Input type="number" placeholder="0.00" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="rounded-xl" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Description</Label>
                          <Input placeholder="e.g. Q1 Tuition Balance" value={paymentDescription} onChange={(e) => setPaymentDescription(e.target.value)} className="rounded-xl" />
                        </div>
                        <button
                          onClick={handleRecordPayment}
                          disabled={!paymentAmount || !paymentMethod || !paymentDescription || recordPaymentMutation.isPending}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white font-extrabold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {recordPaymentMutation.isPending ? "Saving…" : "Confirm Payment"}
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-2xl p-5 text-white">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1">Total Paid</p>
                    <p className="text-3xl font-extrabold">₦{(Number(student.paidFees) || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
                    <p className="text-red-400 text-xs font-bold uppercase tracking-wide mb-1">Outstanding</p>
                    <p className="text-3xl font-extrabold text-red-600">₦{outstanding.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500 font-semibold">Payment Completion</span>
                    <span className="font-extrabold text-[#0a2342]">{paymentProgress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${paymentProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${paymentProgress >= 80 ? "bg-green-500" : paymentProgress >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#0a2342]/10 flex items-center justify-center">
                      <CreditCard className="w-3 h-3 text-[#0a2342]" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Payment History</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-extrabold text-gray-500 text-xs uppercase">Date</TableHead>
                        <TableHead className="font-extrabold text-gray-500 text-xs uppercase">Reference</TableHead>
                        <TableHead className="text-right font-extrabold text-gray-500 text-xs uppercase">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.length > 0 ? (
                        paymentHistory.map((payment: any, index: number) => (
                          <TableRow key={index} className="hover:bg-gray-50/70">
                            <TableCell className="text-gray-700 text-sm">{payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}</TableCell>
                            <TableCell className="font-mono text-xs text-gray-500">{payment.reference || "N/A"}</TableCell>
                            <TableCell className="text-right font-extrabold text-[#0a2342]">₦{(Number(payment.amount) || 0).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-10 text-gray-400 text-sm">
                            No payment history available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;

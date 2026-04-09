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

  const handleRecordPayment = () => {
    recordPaymentMutation.mutate({
      description: paymentDescription,
      amount: Number(paymentAmount),
      method: paymentMethod,
      reference: "TRF-" + Date.now().toString().slice(-6),
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <div className="bg-white border-b border-primary/10 mb-8 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">
               Student ID: {studentId}
             </Badge>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Student Profile Card */}
          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 playful-card p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20"
            >
              <div className="text-center mb-6">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-xl text-white font-bold text-2xl"
                  style={{
                    background: "linear-gradient(to bottom right, #4f46e5, #7c3aed)"
                  }}
                >
                  {studentName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <h2 className="font-bold text-xl">{student.name}</h2>
                <p className="text-muted-foreground">{student.admissionNo}</p>
                <Badge className="mt-2 bg-primary text-primary-foreground" variant="default">
                  {student.class}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-card border border-border/50">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    DOB: {student.dateOfBirth}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-card border border-border/50">
                  <User className="w-4 h-4 text-primary" />
                  <span>Gender: {student.gender}</span>
                </div>
                <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-card border border-border/50">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="truncate">{student.address}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs">Parent/Guardian</p>
                    <p className="font-medium">{student.parentName}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p className="font-medium">{student.parentPhone}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium">{student.parentEmail}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Tabs defaultValue="academics" className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-xl p-1 bg-muted/50 mb-6 h-12">
                  <TabsTrigger 
                    value="academics" 
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" /> Academics
                  </TabsTrigger>
                  <TabsTrigger 
                    value="attendance" 
                    className="rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" /> Attendance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="fees" 
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" /> Fees & Payments
                  </TabsTrigger>
                </TabsList>

                {/* Academics Tab */}
                <TabsContent value="academics" className="space-y-6">
                  <div className="playful-card p-6 border-t-4 border-t-primary">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" /> Academic Summary
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-sm text-muted-foreground mb-1">Current GPA</p>
                        <p className="text-3xl font-bold text-primary">{(Number(student.gpa) || 0).toFixed(2)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                        <p className="text-sm text-muted-foreground mb-1">Grade Level</p>
                        <p className="text-3xl font-bold text-secondary">{student.gradeLevel}</p>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" /> Subject Performance
                    </h3>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-center">Score</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {academicPerformance.length > 0 ? (
                            academicPerformance.map((performance: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{performance.subject || 'N/A'}</TableCell>
                                <TableCell className="text-center font-bold text-primary">{performance.score || 0}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                    {performance.grade || 'N/A'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No academic records found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance" className="space-y-6">
                  <div className="playful-card p-6 border-t-4 border-t-secondary">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-secondary" /> Attendance Overview
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                        <p className="text-sm text-muted-foreground mb-1">Overall Rate</p>
                        <p className="text-3xl font-bold text-secondary">{student.attendanceRate}%</p>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-sm text-muted-foreground mb-1">Academic Level</p>
                        <p className="text-3xl font-bold text-primary">{student.level}</p>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-4">Monthly Status</h3>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead className="text-center">Rate</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendanceHistory.length > 0 ? (
                            attendanceHistory.map((month: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{month.month || 'N/A'}</TableCell>
                                <TableCell className="text-center font-bold text-secondary">{month.rate || 0}%</TableCell>
                                <TableCell className="text-center">
                                  <Badge className={getAttendanceColor(Number(month.rate) || 0) + " bg-current/10"}>
                                    {(Number(month.rate) || 0) >= 75 ? "Excellent" : "Needs Improvement"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No attendance records found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                {/* Fees Tab */}
                <TabsContent value="fees" className="space-y-6">
                  <div className="playful-card p-6 border-t-4 border-t-primary">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" /> Financial Status
                      </h3>
                      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white border-none">
                            <Plus className="w-4 h-4" /> Record Payment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader className="bg-primary/10 -m-6 mb-6 p-6 rounded-t-lg border-b border-primary/20">
                            <DialogTitle className="text-2xl font-bold text-primary">Record Payment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                  <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Online Card</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Amount (₦)</Label>
                                <Input 
                                  type="number"
                                  placeholder="0.00" 
                                  value={paymentAmount} 
                                  onChange={(e) => setPaymentAmount(e.target.value)} 
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input 
                                placeholder="e.g. Q1 Tuition Balance" 
                                value={paymentDescription} 
                                onChange={(e) => setPaymentDescription(e.target.value)} 
                              />
                            </div>
                            <Button 
                              className="w-full bg-primary hover:bg-primary/90 mt-4 h-11 text-lg font-semibold" 
                              onClick={handleRecordPayment}
                              disabled={!paymentAmount || !paymentMethod || !paymentDescription}
                            >
                              Confirm Payment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                        <p className="text-3xl font-bold text-primary">₦{(Number(student.paidFees) || 0).toLocaleString()}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                        <p className="text-sm text-muted-foreground mb-1">Outstanding</p>
                        <p className="text-3xl font-bold text-secondary">₦{(Number(outstanding) || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-8">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Payment Completion</span>
                        <span className="font-bold">{paymentProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={paymentProgress} className="h-2" />
                    </div>

                    <h3 className="font-bold text-lg mb-4">Payment History</h3>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paymentHistory.length > 0 ? (
                            paymentHistory.map((payment: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}</TableCell>
                                <TableCell className="font-mono text-xs">{payment.reference || "N/A"}</TableCell>
                                <TableCell className="text-right font-bold text-primary">₦{(Number(payment.amount) || 0).toLocaleString()}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                No payment history available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDetail;

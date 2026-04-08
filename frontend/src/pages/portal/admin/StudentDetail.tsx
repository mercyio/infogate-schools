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

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const StudentDetail = () => {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentFor, setPaymentFor] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");


  const { data: realStudent, isLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const res = await api.get(`/users/students/${studentId}`);
      return res.data;
    },
    enabled: !!studentId,
  });

  // Merge real data with empty defaults
  const student = realStudent ? {
    ...defaultStudentStats,
    id: realStudent._id,
    name: realStudent.user_id?.full_name || realStudent.full_name || "Student Name",
    admissionNo: realStudent.admission_number || realStudent.reg_number || "N/A",
    gender: realStudent.gender || "N/A",
    dateOfBirth: realStudent.date_of_birth?.split('T')[0] || "2000-01-01",
    class: realStudent.grade || realStudent.class_id?.name || "N/A",
    level: realStudent.program || "N/A",
    gradeLevel: realStudent.grade || "N/A",
    address: realStudent.address || "N/A",
    parentName: realStudent.parent_name || "N/A",
    parentPhone: realStudent.parent_phone || "N/A",
    parentEmail: realStudent.parent_email || "N/A",
  } : { 
    ...defaultStudentStats, 
    id: studentId || "N/A",
    name: "Loading...", 
    admissionNo: studentId || "N/A", 
    dateOfBirth: "2000-01-01",
    gender: "N/A",
    class: "N/A",
    level: "N/A",
    address: "N/A",
    parentName: "N/A",
    parentPhone: "N/A",
    parentEmail: "N/A"
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading student profile...</div>;
  }

  const outstanding = (student.totalFees || 0) - (student.paidFees || 0);
  const paymentProgress = student.totalFees ? (student.paidFees / student.totalFees) * 100 : 0;

  const getFeesStatus = () => {
    if (student.totalFees > 0 && outstanding === 0)
      return { label: "Fully Paid", color: "bg-primary text-primary-foreground" };
    if ((student.paidFees || 0) > 0)
      return {
        label: "Partial Payment",
        color: "bg-secondary text-secondary-foreground",
      };
    return { label: "Unpaid", color: "bg-primary/20 text-primary border border-primary/30" };
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-primary";
    if (rate >= 75) return "text-secondary";
    return "text-primary/70";
  };
 
  const getAttendanceBg = (rate: number) => {
    if (rate >= 90) return "bg-primary/20";
    if (rate >= 75) return "bg-secondary/20";
    return "bg-primary/10";
  };

  const handleRecordPayment = () => {
    // In real app, this would update the database
    console.log("Recording payment:", {
      description: paymentDescription,
      amount: paymentAmount,
      method: paymentMethod,
      reference: "TRF-" + Date.now(),
    });
    setPaymentDialogOpen(false);
    setPaymentAmount("");
    setPaymentMethod("");
    setPaymentDescription("");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
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
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border-2 border-primary/10 shadow-inner">
                  <User className="w-12 h-12 text-primary" />
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
                    DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
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
                        <p className="text-3xl font-bold text-primary">{student.gpa.toFixed(2)}</p>
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
                          {student.academicPerformance.length > 0 ? (
                            student.academicPerformance.map((performance) => (
                              <TableRow key={performance.subject}>
                                <TableCell className="font-medium">{performance.subject}</TableCell>
                                <TableCell className="text-center font-bold text-primary">{performance.score}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                    {performance.grade}
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
                          {student.attendanceHistory.length > 0 ? (
                            student.attendanceHistory.map((month) => (
                              <TableRow key={month.month}>
                                <TableCell className="font-medium">{month.month}</TableCell>
                                <TableCell className="text-center font-bold text-secondary">{month.rate}%</TableCell>
                                <TableCell className="text-center">
                                  <Badge className={getAttendanceColor(month.rate) + " bg-current/10"}>
                                    {month.rate >= 75 ? "Excellent" : "Needs Improvement"}
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
                        <p className="text-3xl font-bold text-primary">₦{student.paidFees.toLocaleString()}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                        <p className="text-sm text-muted-foreground mb-1">Outstanding</p>
                        <p className="text-3xl font-bold text-secondary">₦{outstanding.toLocaleString()}</p>
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
                          {student.paymentHistory.length > 0 ? (
                            student.paymentHistory.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                <TableCell className="font-mono text-xs">{payment.reference}</TableCell>
                                <TableCell className="text-right font-bold text-primary">₦{payment.amount.toLocaleString()}</TableCell>
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

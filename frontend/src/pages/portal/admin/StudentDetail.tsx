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

// Mock student data
const studentsData: Record<
  string,
  {
    id: string;
    name: string;
    admissionNo: string;
    gender: string;
    dateOfBirth: string;
    class: string;
    classId: string;
    level: string;
    address: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    attendanceRate: number;
    attendanceHistory: Array<{
      month: string;
      rate: number;
      present: number;
      absent: number;
      total: number;
    }>;
    totalFees: number;
    paidFees: number;
    feesBreakdown: Array<{ item: string; amount: number }>;
    paymentHistory: Array<{
      id: string;
      date: string;
      paidFor: string;
      amount: number;
      method: string;
      reference: string;
    }>;
    gpa: number;
    gradeLevel: string;
    academicPerformance: Array<{
      subject: string;
      grade: string;
      score: number;
      classAverage: number;
      assignment: number;
      classwork: number;
      classActivity: number;
    }>;
    cumulativePerformance: Array<{
      term: string;
      assignment: number;
      classwork: number;
      classActivity: number;
      score: number;
      grade: string;
      gpa: number;
      rank: number;
      totalStudents: number;
    }>;
  }
> = {
  "N1-001": {
    id: "N1-001",
    name: "Adaeze Okonkwo",
    admissionNo: "IG/2024/N001",
    gender: "Female",
    dateOfBirth: "2020-03-15",
    class: "Nursery 1",
    classId: "1",
    level: "Nursery",
    address: "15, Victoria Island, Lagos",
    parentName: "Mr. & Mrs. Okonkwo",
    parentPhone: "+234 801 234 5678",
    parentEmail: "okonkwo.family@email.com",
    attendanceRate: 95,
    attendanceHistory: [
      { month: "September", rate: 100, present: 20, absent: 0, total: 20 },
      { month: "October", rate: 95, present: 19, absent: 1, total: 20 },
      { month: "November", rate: 90, present: 18, absent: 2, total: 20 },
      { month: "December", rate: 95, present: 10, absent: 1, total: 11 },
    ],
    totalFees: 75000,
    paidFees: 75000,
    feesBreakdown: [
      { item: "Tuition Fee", amount: 50000 },
      { item: "Development Levy", amount: 10000 },
      { item: "Uniform Fee", amount: 8000 },
      { item: "Books & Materials", amount: 5000 },
      { item: "Sports Fee", amount: 2000 },
    ],
    paymentHistory: [
      {
        id: "PAY001",
        date: "2024-09-05",
        paidFor: "Tuition Fee",
        amount: 75000,
        method: "Bank Transfer",
        reference: "TRF-2024-0905-001",
      },
    ],
    gpa: 4.0,
    gradeLevel: "A+",
    academicPerformance: [
      {
        subject: "Mathematics",
        grade: "A+",
        score: 95,
        classAverage: 78,
        assignment: 9,
        classwork: 19,
        classActivity: 10,
      },
      {
        subject: "English",
        grade: "A",
        score: 92,
        classAverage: 80,
        assignment: 8,
        classwork: 18,
        classActivity: 9,
      },
      {
        subject: "Science",
        grade: "A+",
        score: 94,
        classAverage: 76,
        assignment: 9,
        classwork: 20,
        classActivity: 10,
      },
      {
        subject: "Social Studies",
        grade: "A",
        score: 88,
        classAverage: 75,
        assignment: 8,
        classwork: 17,
        classActivity: 9,
      },
      {
        subject: "Physical Education",
        grade: "A+",
        score: 96,
        classAverage: 82,
        assignment: 10,
        classwork: 20,
        classActivity: 10,
      },
    ],
    cumulativePerformance: [
      {
        term: "Term 1",
        assignment: 8,
        classwork: 18,
        classActivity: 9,
        score: 92,
        grade: "A",
        gpa: 3.9,
        rank: 3,
        totalStudents: 45,
      },
      {
        term: "Term 2",
        assignment: 9,
        classwork: 19,
        classActivity: 10,
        score: 94,
        grade: "A+",
        gpa: 4.0,
        rank: 2,
        totalStudents: 45,
      },
      {
        term: "Term 3",
        assignment: 9,
        classwork: 19,
        classActivity: 10,
        score: 95,
        grade: "A+",
        gpa: 4.0,
        rank: 1,
        totalStudents: 45,
      },
    ],
  },
  "N1-002": {
    id: "N1-002",
    name: "Chinedu Eze",
    admissionNo: "IG/2024/N002",
    gender: "Male",
    dateOfBirth: "2020-06-22",
    class: "Nursery 1",
    classId: "1",
    level: "Nursery",
    address: "42, Lekki Phase 1, Lagos",
    parentName: "Mr. Eze",
    parentPhone: "+234 802 345 6789",
    parentEmail: "eze.family@email.com",
    attendanceRate: 88,
    attendanceHistory: [
      { month: "September", rate: 85, present: 17, absent: 3, total: 20 },
      { month: "October", rate: 90, present: 18, absent: 2, total: 20 },
      { month: "November", rate: 85, present: 17, absent: 3, total: 20 },
      { month: "December", rate: 91, present: 10, absent: 1, total: 11 },
    ],
    totalFees: 75000,
    paidFees: 50000,
    feesBreakdown: [
      { item: "Tuition Fee", amount: 50000 },
      { item: "Development Levy", amount: 10000 },
      { item: "Uniform Fee", amount: 8000 },
      { item: "Books & Materials", amount: 5000 },
      { item: "Sports Fee", amount: 2000 },
    ],
    paymentHistory: [
      {
        id: "PAY002",
        date: "2024-09-10",
        paidFor: "Tuition Fee",
        amount: 30000,
        method: "Cash",
        reference: "CASH-2024-0910-002",
      },
      {
        id: "PAY003",
        date: "2024-10-15",
        paidFor: "Development Levy",
        amount: 20000,
        method: "POS",
        reference: "POS-2024-1015-003",
      },
    ],
    gpa: 3.8,
    gradeLevel: "A",
    academicPerformance: [
      {
        subject: "Mathematics",
        grade: "A",
        score: 90,
        classAverage: 78,
        assignment: 8,
        classwork: 18,
        classActivity: 9,
      },
      {
        subject: "English",
        grade: "A",
        score: 89,
        classAverage: 80,
        assignment: 8,
        classwork: 17,
        classActivity: 9,
      },
      {
        subject: "Science",
        grade: "A-",
        score: 85,
        classAverage: 76,
        assignment: 7,
        classwork: 16,
        classActivity: 8,
      },
      {
        subject: "Social Studies",
        grade: "A",
        score: 88,
        classAverage: 75,
        assignment: 8,
        classwork: 17,
        classActivity: 9,
      },
      {
        subject: "Physical Education",
        grade: "A+",
        score: 92,
        classAverage: 82,
        assignment: 9,
        classwork: 19,
        classActivity: 10,
      },
    ],
    cumulativePerformance: [
      {
        term: "Term 1",
        assignment: 8,
        classwork: 17,
        classActivity: 9,
        score: 89,
        grade: "A",
        gpa: 3.6,
        rank: 8,
        totalStudents: 45,
      },
      {
        term: "Term 2",
        assignment: 8,
        classwork: 18,
        classActivity: 9,
        score: 91,
        grade: "A",
        gpa: 3.8,
        rank: 5,
        totalStudents: 45,
      },
      {
        term: "Term 3",
        assignment: 8,
        classwork: 18,
        classActivity: 9,
        score: 90,
        grade: "A",
        gpa: 3.8,
        rank: 6,
        totalStudents: 45,
      },
    ],
  },
  "N1-004": {
    id: "N1-004",
    name: "Emeka Nwosu",
    admissionNo: "IG/2024/N004",
    gender: "Male",
    dateOfBirth: "2020-01-08",
    class: "Nursery 1",
    classId: "1",
    level: "Nursery",
    address: "8, Surulere, Lagos",
    parentName: "Mrs. Nwosu",
    parentPhone: "+234 803 456 7890",
    parentEmail: "nwosu@email.com",
    attendanceRate: 78,
    attendanceHistory: [
      { month: "September", rate: 75, present: 15, absent: 5, total: 20 },
      { month: "October", rate: 80, present: 16, absent: 4, total: 20 },
      { month: "November", rate: 75, present: 15, absent: 5, total: 20 },
      { month: "December", rate: 82, present: 9, absent: 2, total: 11 },
    ],
    totalFees: 75000,
    paidFees: 0,
    feesBreakdown: [
      { item: "Tuition Fee", amount: 50000 },
      { item: "Development Levy", amount: 10000 },
      { item: "Uniform Fee", amount: 8000 },
      { item: "Books & Materials", amount: 5000 },
      { item: "Sports Fee", amount: 2000 },
    ],
    paymentHistory: [],
    gpa: 3.4,
    gradeLevel: "B+",
    academicPerformance: [
      {
        subject: "Mathematics",
        grade: "B+",
        score: 82,
        classAverage: 78,
        assignment: 7,
        classwork: 16,
        classActivity: 8,
      },
      {
        subject: "English",
        grade: "A-",
        score: 85,
        classAverage: 80,
        assignment: 8,
        classwork: 17,
        classActivity: 9,
      },
      {
        subject: "Science",
        grade: "B",
        score: 80,
        classAverage: 76,
        assignment: 7,
        classwork: 15,
        classActivity: 8,
      },
      {
        subject: "Social Studies",
        grade: "B+",
        score: 83,
        classAverage: 75,
        assignment: 7,
        classwork: 16,
        classActivity: 8,
      },
      {
        subject: "Physical Education",
        grade: "A",
        score: 88,
        classAverage: 82,
        assignment: 8,
        classwork: 18,
        classActivity: 9,
      },
    ],
    cumulativePerformance: [
      {
        term: "Term 1",
        assignment: 7,
        classwork: 15,
        classActivity: 8,
        score: 80,
        grade: "B",
        gpa: 3.2,
        rank: 18,
        totalStudents: 45,
      },
      {
        term: "Term 2",
        assignment: 7,
        classwork: 16,
        classActivity: 8,
        score: 82,
        grade: "B+",
        gpa: 3.4,
        rank: 16,
        totalStudents: 45,
      },
      {
        term: "Term 3",
        assignment: 7,
        classwork: 16,
        classActivity: 8,
        score: 82,
        grade: "B+",
        gpa: 3.4,
        rank: 17,
        totalStudents: 45,
      },
    ],
  },
};

// Generate default student data for unknown IDs
const getStudentData = (studentId: string) => {
  if (studentsData[studentId]) return studentsData[studentId];

  return {
    id: studentId,
    name: "Student Name",
    admissionNo: `IG/2024/${studentId}`,
    gender: "Male",
    dateOfBirth: "2020-01-01",
    class: "Class",
    classId: "1",
    level: "Primary",
    address: "Lagos, Nigeria",
    parentName: "Parent Name",
    parentPhone: "+234 800 000 0000",
    parentEmail: "parent@email.com",
    attendanceRate: 85,
    attendanceHistory: [
      { month: "September", rate: 85, present: 17, absent: 3, total: 20 },
    ],
    totalFees: 100000,
    paidFees: 50000,
    feesBreakdown: [
      { item: "Tuition Fee", amount: 80000 },
      { item: "Other Fees", amount: 20000 },
    ],
    paymentHistory: [],
    gpa: 3.5,
    gradeLevel: "B+",
    academicPerformance: [
      {
        subject: "Mathematics",
        grade: "B+",
        score: 83,
        classAverage: 78,
        assignment: 8,
        classwork: 17,
        classActivity: 9,
      },
      {
        subject: "English",
        grade: "B",
        score: 80,
        classAverage: 80,
        assignment: 7,
        classwork: 16,
        classActivity: 8,
      },
      {
        subject: "Science",
        grade: "B+",
        score: 82,
        classAverage: 76,
        assignment: 8,
        classwork: 17,
        classActivity: 9,
      },
      {
        subject: "Social Studies",
        grade: "B",
        score: 79,
        classAverage: 75,
        assignment: 7,
        classwork: 15,
        classActivity: 8,
      },
      {
        subject: "Physical Education",
        grade: "A",
        score: 87,
        classAverage: 82,
        assignment: 8,
        classwork: 18,
        classActivity: 9,
      },
    ],
    cumulativePerformance: [
      {
        term: "Term 1",
        assignment: 8,
        classwork: 16,
        classActivity: 8,
        score: 83,
        grade: "B+",
        gpa: 3.3,
        rank: 15,
        totalStudents: 45,
      },
      {
        term: "Term 2",
        assignment: 8,
        classwork: 17,
        classActivity: 9,
        score: 85,
        grade: "B+",
        gpa: 3.5,
        rank: 12,
        totalStudents: 45,
      },
      {
        term: "Term 3",
        assignment: 8,
        classwork: 17,
        classActivity: 9,
        score: 85,
        grade: "B+",
        gpa: 3.5,
        rank: 13,
        totalStudents: 45,
      },
    ],
  };
};

const StudentDetail = () => {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentFor, setPaymentFor] = useState("");

  const student = getStudentData(studentId || "");
  const outstanding = student.totalFees - student.paidFees;
  const paymentProgress = (student.paidFees / student.totalFees) * 100;

  const getFeesStatus = () => {
    if (outstanding === 0)
      return { label: "Fully Paid", color: "bg-mint text-mint-foreground" };
    if (student.paidFees > 0)
      return {
        label: "Partial Payment",
        color: "bg-sunny text-sunny-foreground",
      };
    return { label: "Unpaid", color: "bg-coral text-coral-foreground" };
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-mint";
    if (rate >= 75) return "text-sunny";
    return "text-coral";
  };

  const getAttendanceBg = (rate: number) => {
    if (rate >= 90) return "bg-mint/20";
    if (rate >= 75) return "bg-sunny/20";
    return "bg-coral/20";
  };

  const handleRecordPayment = () => {
    // In real app, this would update the database
    console.log("Recording payment:", {
      payingFor: paymentFor,
      amount: paymentAmount,
      method: paymentMethod,
    });
    setPaymentDialogOpen(false);
    setPaymentAmount("");
    setPaymentMethod("");
    setPaymentFor("");
    // Show success toast here
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/portal/admin/classes/${classId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-admin rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-admin-foreground" />
            </div>
            <div>
              <h1 className="font-bold">Student Details</h1>
              <p className="text-xs text-muted-foreground">{student.class}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Link to="/portal/admin">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

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
              className="lg:col-span-1 playful-card p-6"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h2 className="font-bold text-xl">{student.name}</h2>
                <p className="text-muted-foreground">{student.admissionNo}</p>
                <Badge className="mt-2" variant="secondary">
                  {student.class}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Gender: {student.gender}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{student.address}</span>
                </div>
              </div>

              <hr className="my-6 border-border" />

              <h4 className="font-bold text-sm text-muted-foreground mb-4">
                PARENT/GUARDIAN
              </h4>
              <div className="space-y-3">
                <p className="font-medium">{student.parentName}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{student.parentPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{student.parentEmail}</span>
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
              <Tabs defaultValue="attendance" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="attendance"
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" /> Attendance
                  </TabsTrigger>
                  <TabsTrigger
                    value="academics"
                    className="flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" /> Academics
                  </TabsTrigger>
                  <TabsTrigger value="fees" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Fees & Payments
                  </TabsTrigger>
                </TabsList>

                {/* Attendance Tab */}
                <TabsContent value="attendance" className="space-y-6">
                  {/* Attendance Overview */}
                  <div className="playful-card p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" /> Attendance
                      Overview
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div
                        className={`p-4 rounded-xl ${getAttendanceBg(
                          student.attendanceRate
                        )}`}
                      >
                        <p className="text-sm text-muted-foreground mb-1">
                          Overall Rate
                        </p>
                        <p
                          className={`text-3xl font-bold ${getAttendanceColor(
                            student.attendanceRate
                          )}`}
                        >
                          {student.attendanceRate}%
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-mint/20">
                        <p className="text-sm text-muted-foreground mb-1">
                          Days Present
                        </p>
                        <p className="text-3xl font-bold text-mint">
                          {student.attendanceHistory.reduce(
                            (acc, m) => acc + m.present,
                            0
                          )}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-coral/20">
                        <p className="text-sm text-muted-foreground mb-1">
                          Days Absent
                        </p>
                        <p className="text-3xl font-bold text-coral">
                          {student.attendanceHistory.reduce(
                            (acc, m) => acc + m.absent,
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Breakdown */}
                  <div className="playful-card p-6">
                    <h3 className="font-bold text-lg mb-4">
                      Monthly Breakdown
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Absent</TableHead>
                          <TableHead>Total Days</TableHead>
                          <TableHead>Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.attendanceHistory.map((month) => (
                          <TableRow key={month.month}>
                            <TableCell className="font-medium">
                              {month.month}
                            </TableCell>
                            <TableCell className="text-mint">
                              {month.present}
                            </TableCell>
                            <TableCell className="text-coral">
                              {month.absent}
                            </TableCell>
                            <TableCell>{month.total}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={month.rate}
                                  className="w-16 h-2"
                                />
                                <span
                                  className={getAttendanceColor(month.rate)}
                                >
                                  {month.rate}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Academics Tab */}
                <TabsContent value="academics" className="space-y-6">
                  {/* GPA & Grade Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="playful-card p-6"
                  >
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" /> Academic Summary
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-primary/20">
                        <p className="text-sm text-muted-foreground mb-1">
                          Current GPA
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          {student.gpa.toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/20">
                        <p className="text-sm text-muted-foreground mb-1">
                          Grade
                        </p>
                        <p className="text-3xl font-bold text-secondary">
                          {student.gradeLevel}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-accent/20">
                        <p className="text-sm text-muted-foreground mb-1">
                          Class Rank
                        </p>
                        <p className="text-3xl font-bold text-accent-foreground">
                          {
                            student.cumulativePerformance[
                              student.cumulativePerformance.length - 1
                            ].rank
                          }
                          /
                          {
                            student.cumulativePerformance[
                              student.cumulativePerformance.length - 1
                            ].totalStudents
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Subject Performance */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="playful-card p-6"
                  >
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" /> Subject
                      Performance
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead className="text-center">Assignment</TableHead>
                          <TableHead className="text-center">Classwork</TableHead>
                          <TableHead className="text-center">Class Activity</TableHead>
                          <TableHead className="text-center">Avg Score</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.academicPerformance.map((performance) => (
                          <TableRow key={performance.subject}>
                            <TableCell className="font-medium">
                              {performance.subject}
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              {performance.assignment}/10
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              {performance.classwork}/20
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              {performance.classActivity}/10
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              {performance.score}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">
                                {performance.grade}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </motion.div>

                  {/* Cumulative Performance */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="playful-card p-6"
                  >
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" /> Performance by
                      Term
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Term</TableHead>
                          <TableHead className="text-center">Assignment</TableHead>
                          <TableHead className="text-center">Classwork</TableHead>
                          <TableHead className="text-center">Class Activity</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                          <TableHead className="text-center">GPA</TableHead>
                          <TableHead className="text-center">
                            Class Rank
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.cumulativePerformance.map((performance) => (
                          <TableRow key={performance.term}>
                            <TableCell className="font-medium">
                              {performance.term}
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              {performance.assignment}/10
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              {performance.classwork}/20
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              {performance.classActivity}/10
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">
                                {performance.grade}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              {performance.gpa.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                                {performance.rank}/
                                {performance.totalStudents}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </motion.div>
                </TabsContent>

                {/* Fees Tab */}
                <TabsContent value="fees" className="space-y-6">
                  {/* Fees Overview */}
                  <div className="playful-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />{" "}
                        Financial Overview
                      </h3>
                      <Dialog
                        open={paymentDialogOpen}
                        onOpenChange={setPaymentDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Record Payment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 -m-6 mb-6 p-6 rounded-t-lg border-b border-primary/20">
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              💳 Record Payment
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground mt-2">
                              Complete the payment details below
                            </p>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-6 py-2 px-4">
                            {/* Left Column - Info Cards */}
                            <div className="space-y-4">
                              {/* Student Info Card */}
                              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Student
                                </p>
                                <p className="font-bold text-sm">
                                  {student.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {student.admissionNo}
                                </p>
                              </div>

                              {/* Outstanding Balance Card */}
                              <div className="p-4 bg-coral/10 rounded-xl border border-coral/20">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Total Outstanding Balance
                                </p>
                                <p className="text-2xl font-bold text-coral">
                                  ₦{outstanding.toLocaleString()}
                                </p>
                              </div>

                              {/* Summary */}
                              {paymentFor && paymentAmount && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-4 bg-mint/10 rounded-xl border border-mint/20"
                                >
                                  <p className="text-xs text-muted-foreground mb-3 font-semibold">
                                    📋 Payment Summary
                                  </p>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Item:
                                      </span>
                                      <span className="font-semibold">
                                        {paymentFor}
                                      </span>
                                    </div>
                                    <div className="flex justify-between pb-2 border-b border-mint/20">
                                      <span className="text-muted-foreground">
                                        Amount:
                                      </span>
                                      <span className="font-bold text-mint">
                                        ₦{parseInt(paymentAmount || "0").toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                      <span className="text-muted-foreground">
                                        Method:
                                      </span>
                                      <span className="font-semibold capitalize">
                                        {paymentMethod
                                          .replace(/_/g, " ")
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>

                            {/* Right Column - Form Fields */}
                            <div className="space-y-4">
                              {/* Paying For */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="payingFor"
                                  className="font-semibold text-sm"
                                >
                                  What are you paying for?
                                </Label>
                                <Select
                                  value={paymentFor}
                                  onValueChange={setPaymentFor}
                                >
                                  <SelectTrigger className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50">
                                    <SelectValue placeholder="Select fee item" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all_outstanding">
                                      <span className="font-bold text-primary">
                                        All Outstanding
                                      </span>
                                      <span className="text-muted-foreground ml-2">
                                        - ₦{student.totalFees.toLocaleString()}
                                      </span>
                                    </SelectItem>
                                    {student.feesBreakdown.map((fee) => (
                                      <SelectItem
                                        key={fee.item}
                                        value={fee.item}
                                      >
                                        <span className="font-medium">
                                          {fee.item}
                                        </span>
                                        <span className="text-muted-foreground ml-2">
                                          - ₦{fee.amount.toLocaleString()}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Amount Paid */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="amount"
                                  className="font-semibold text-sm"
                                >
                                  Amount to Pay
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                                    ₦
                                  </span>
                                  <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50 pl-8"
                                    value={paymentAmount}
                                    onChange={(e) =>
                                      setPaymentAmount(e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              {/* Payment Method */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor="method"
                                  className="font-semibold text-sm"
                                >
                                  Payment Method
                                </Label>
                                <Select
                                  value={paymentMethod}
                                  onValueChange={setPaymentMethod}
                                >
                                  <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:border-secondary bg-background/50">
                                    <SelectValue placeholder="Select method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bank_transfer">
                                      🏦 Bank Transfer
                                    </SelectItem>
                                    <SelectItem value="cash">
                                      💵 Cash
                                    </SelectItem>
                                    <SelectItem value="pos">🪗 POS</SelectItem>
                                    <SelectItem value="online">
                                      💳 Online Payment
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Confirm Button */}
                              <Button
                                className="w-full gap-2 h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-lg shadow-lg mt-2"
                                onClick={handleRecordPayment}
                                disabled={
                                  !paymentFor ||
                                  !paymentAmount ||
                                  !paymentMethod
                                }
                              >
                                <Check className="w-4 h-4" /> Confirm Payment
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-muted">
                        <p className="text-sm text-muted-foreground mb-1">
                          Total Fees
                        </p>
                        <p className="text-2xl font-bold">
                          ₦{student.totalFees.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-mint/20">
                        <p className="text-sm text-muted-foreground mb-1">
                          Amount Paid
                        </p>
                        <p className="text-2xl font-bold text-mint">
                          ₦{student.paidFees.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-coral/20">
                        <p className="text-sm text-muted-foreground mb-1">
                          Outstanding
                        </p>
                        <p className="text-2xl font-bold text-coral">
                          ₦{outstanding.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Payment Progress
                        </span>
                        <Badge className={getFeesStatus().color}>
                          {getFeesStatus().label}
                        </Badge>
                      </div>
                      <Progress value={paymentProgress} className="h-3" />
                      <p className="text-sm text-muted-foreground text-right">
                        {paymentProgress.toFixed(0)}% completed
                      </p>
                    </div>
                  </div>

                  {/* Fees Breakdown */}
                  <div className="playful-card p-6">
                    <h3 className="font-bold text-lg mb-4">Fees Breakdown</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.feesBreakdown.map((item) => (
                          <TableRow key={item.item}>
                            <TableCell>{item.item}</TableCell>
                            <TableCell className="text-right font-medium">
                              ₦{item.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/50">
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">
                            ₦{student.totalFees.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Payment History */}
                  <div className="playful-card p-6">
                    <h3 className="font-bold text-lg mb-4">Payment History</h3>
                    {student.paymentHistory.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Paid For</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {student.paymentHistory.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {new Date(payment.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-medium">
                                {payment.paidFor}
                              </TableCell>
                              <TableCell>{payment.method}</TableCell>
                              <TableCell className="font-mono text-sm">
                                {payment.reference}
                              </TableCell>
                              <TableCell className="text-right font-medium text-mint">
                                ₦{payment.amount.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No payment records found</p>
                        <p className="text-sm">
                          Record a payment using the button above
                        </p>
                      </div>
                    )}
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

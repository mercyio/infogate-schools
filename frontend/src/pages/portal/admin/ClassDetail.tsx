import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  BookOpen,
  ArrowLeft,
  Search,
  Users,
  Clock,
  User,
  GraduationCap,
  Bell,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  Download,
  MoreVertical,
  CheckCircle2,
  Zap,
  Percent,
  Award,
  BookMarked,
  Activity,
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

// Mock data - in real app, this would come from database
const classesData: Record<
  string,
  {
    id: number;
    name: string;
    level: string;
    teacher: { name: string; phone: string; email: string; avatar: string };
    subjects: string[];
    students: Array<{
      id: string;
      name: string;
      admissionNo: string;
      gender: string;
      attendanceRate: number;
      feesStatus: "paid" | "partial" | "unpaid";
      totalFees: number;
      paidFees: number;
    }>;
  }
> = {
  "1": {
    id: 1,
    name: "Nursery 1",
    level: "Nursery",
    teacher: {
      name: "Mrs. Adebayo",
      phone: "+234 801 234 5678",
      email: "adebayo@infogate.edu",
      avatar: "A",
    },
    subjects: [
      "Numeracy",
      "Literacy",
      "Creative Arts",
      "Physical Education",
      "Social Habits",
      "Rhymes & Songs",
    ],
    students: [
      {
        id: "N1-001",
        name: "Adaeze Okonkwo",
        admissionNo: "IG/2024/N001",
        gender: "Female",
        attendanceRate: 95,
        feesStatus: "paid",
        totalFees: 75000,
        paidFees: 75000,
      },
      {
        id: "N1-002",
        name: "Chinedu Eze",
        admissionNo: "IG/2024/N002",
        gender: "Male",
        attendanceRate: 88,
        feesStatus: "partial",
        totalFees: 75000,
        paidFees: 50000,
      },
      {
        id: "N1-003",
        name: "Fatima Ibrahim",
        admissionNo: "IG/2024/N003",
        gender: "Female",
        attendanceRate: 92,
        feesStatus: "paid",
        totalFees: 75000,
        paidFees: 75000,
      },
      {
        id: "N1-004",
        name: "Emeka Nwosu",
        admissionNo: "IG/2024/N004",
        gender: "Male",
        attendanceRate: 78,
        feesStatus: "unpaid",
        totalFees: 75000,
        paidFees: 0,
      },
      {
        id: "N1-005",
        name: "Amara Okafor",
        admissionNo: "IG/2024/N005",
        gender: "Female",
        attendanceRate: 98,
        feesStatus: "paid",
        totalFees: 75000,
        paidFees: 75000,
      },
    ],
  },
  "2": {
    id: 2,
    name: "Nursery 2",
    level: "Nursery",
    teacher: {
      name: "Mrs. Okonkwo",
      phone: "+234 802 345 6789",
      email: "okonkwo@infogate.edu",
      avatar: "O",
    },
    subjects: [
      "Numeracy",
      "Literacy",
      "Creative Arts",
      "Physical Education",
      "Social Habits",
      "Rhymes & Songs",
    ],
    students: [
      {
        id: "N2-001",
        name: "Ngozi Adeleke",
        admissionNo: "IG/2023/N101",
        gender: "Female",
        attendanceRate: 91,
        feesStatus: "paid",
        totalFees: 80000,
        paidFees: 80000,
      },
      {
        id: "N2-002",
        name: "Tunde Bakare",
        admissionNo: "IG/2023/N102",
        gender: "Male",
        attendanceRate: 85,
        feesStatus: "partial",
        totalFees: 80000,
        paidFees: 40000,
      },
    ],
  },
  "3": {
    id: 3,
    name: "Primary 1",
    level: "Primary",
    teacher: {
      name: "Mr. Ibrahim",
      phone: "+234 803 456 7890",
      email: "ibrahim@infogate.edu",
      avatar: "I",
    },
    subjects: [
      "Mathematics",
      "English Language",
      "Basic Science",
      "Social Studies",
      "Civic Education",
      "Computer Studies",
      "Creative Arts",
      "Physical Education",
    ],
    students: [
      {
        id: "P1-001",
        name: "Oluwaseun Adeyemi",
        admissionNo: "IG/2024/P001",
        gender: "Male",
        attendanceRate: 94,
        feesStatus: "paid",
        totalFees: 95000,
        paidFees: 95000,
      },
      {
        id: "P1-002",
        name: "Chioma Ugwu",
        admissionNo: "IG/2024/P002",
        gender: "Female",
        attendanceRate: 89,
        feesStatus: "partial",
        totalFees: 95000,
        paidFees: 60000,
      },
      {
        id: "P1-003",
        name: "Abubakar Sani",
        admissionNo: "IG/2024/P003",
        gender: "Male",
        attendanceRate: 96,
        feesStatus: "paid",
        totalFees: 95000,
        paidFees: 95000,
      },
    ],
  },
  "6": {
    id: 6,
    name: "JSS 1",
    level: "Secondary",
    teacher: {
      name: "Mr. Okafor",
      phone: "+234 804 567 8901",
      email: "okafor@infogate.edu",
      avatar: "O",
    },
    subjects: [
      "Mathematics",
      "English Language",
      "Basic Science",
      "Basic Technology",
      "Social Studies",
      "Civic Education",
      "Computer Studies",
      "French",
      "Yoruba",
      "Agricultural Science",
      "Home Economics",
      "Physical Education",
    ],
    students: [
      {
        id: "J1-001",
        name: "Kehinde Oladipo",
        admissionNo: "IG/2024/J001",
        gender: "Female",
        attendanceRate: 97,
        feesStatus: "paid",
        totalFees: 120000,
        paidFees: 120000,
      },
      {
        id: "J1-002",
        name: "Mohammed Bello",
        admissionNo: "IG/2024/J002",
        gender: "Male",
        attendanceRate: 82,
        feesStatus: "unpaid",
        totalFees: 120000,
        paidFees: 0,
      },
      {
        id: "J1-003",
        name: "Grace Onyeka",
        admissionNo: "IG/2024/J003",
        gender: "Female",
        attendanceRate: 91,
        feesStatus: "partial",
        totalFees: 120000,
        paidFees: 80000,
      },
    ],
  },
};

// Add default class data for any class ID
const getClassData = (classId: string) => {
  if (classesData[classId]) return classesData[classId];

  // Generate mock data for other class IDs
  const classNames: Record<string, { name: string; level: string }> = {
    "4": { name: "Primary 2", level: "Primary" },
    "5": { name: "Primary 3", level: "Primary" },
    "7": { name: "JSS 2", level: "Secondary" },
    "8": { name: "SS 1", level: "Secondary" },
    "9": { name: "Vocational 1", level: "Vocational" },
  };

  const info = classNames[classId] || {
    name: `Class ${classId}`,
    level: "Primary",
  };

  return {
    id: parseInt(classId),
    name: info.name,
    level: info.level,
    teacher: {
      name: "Mr. Teacher",
      phone: "+234 800 000 0000",
      email: "teacher@infogate.edu",
      avatar: "T",
    },
    subjects: [
      "Mathematics",
      "English Language",
      "Basic Science",
      "Social Studies",
    ],
    students: [
      {
        id: `C${classId}-001`,
        name: "Sample Student",
        admissionNo: `IG/2024/C${classId}01`,
        gender: "Male",
        attendanceRate: 90,
        feesStatus: "paid" as const,
        totalFees: 100000,
        paidFees: 100000,
      },
    ],
  };
};

// Class color mapping - unique color per class
const getClassColor = (classId: string) => {
  const colorMap: Record<
    string,
    {
      primary: string;
      light: string;
      lighter: string;
      accent: string;
    }
  > = {
    "1": {
      primary: "#F97316",
      light: "from-orange-500 to-orange-600",
      lighter: "bg-orange/12",
      accent: "border-orange/30",
    },
    "2": {
      primary: "#EC4899",
      light: "from-pink-500 to-pink-600",
      lighter: "bg-pink/12",
      accent: "border-pink/30",
    },
    "3": {
      primary: "#06B6D4",
      light: "from-cyan-500 to-cyan-600",
      lighter: "bg-cyan/12",
      accent: "border-cyan/30",
    },
    "4": {
      primary: "#8B5CF6",
      light: "from-violet-500 to-violet-600",
      lighter: "bg-violet/12",
      accent: "border-violet/30",
    },
    "5": {
      primary: "#10B981",
      light: "from-emerald-500 to-emerald-600",
      lighter: "bg-emerald/12",
      accent: "border-emerald/30",
    },
    "6": {
      primary: "#F59E0B",
      light: "from-amber-500 to-amber-600",
      lighter: "bg-amber/12",
      accent: "border-amber/30",
    },
    "7": {
      primary: "#EF4444",
      light: "from-red-500 to-red-600",
      lighter: "bg-red/12",
      accent: "border-red/30",
    },
    "8": {
      primary: "#3B82F6",
      light: "from-blue-500 to-blue-600",
      lighter: "bg-blue/12",
      accent: "border-blue/30",
    },
    "9": {
      primary: "#14B8A6",
      light: "from-teal-500 to-teal-600",
      lighter: "bg-teal/12",
      accent: "border-teal/30",
    },
  };

  return (
    colorMap[classId] || {
      primary: "#6366F1",
      light: "from-indigo-500 to-indigo-600",
      lighter: "bg-indigo/12",
      accent: "border-indigo/30",
    }
  );
};

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const classData = getClassData(classId || "1");
  const classColor = getClassColor(classId || "1");

  const filteredStudents = classData.students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: "paid" | "partial" | "unpaid") => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-mint text-mint-foreground">
            <div className="w-2 h-2 rounded-full bg-current mr-2" />
            Paid
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-sunny text-sunny-foreground">
            <div className="w-2 h-2 rounded-full bg-current mr-2" />
            Partial
          </Badge>
        );
      case "unpaid":
        return (
          <Badge className="bg-coral text-coral-foreground">
            <div className="w-2 h-2 rounded-full bg-current mr-2" />
            Unpaid
          </Badge>
        );
    }
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-mint";
    if (rate >= 75) return "text-sunny";
    return "text-coral";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Nursery":
        return "from-coral to-coral/80";
      case "Primary":
        return "from-primary to-primary/80";
      case "Secondary":
        return "from-secondary to-secondary/80";
      case "Vocational":
        return "from-lavender to-lavender/80";
      default:
        return "from-muted to-muted/80";
    }
  };

  const totalFeesPaid = classData.students.reduce(
    (sum, s) => sum + s.paidFees,
    0
  );
  const totalFeesExpected = classData.students.reduce(
    (sum, s) => sum + s.totalFees,
    0
  );
  const feeCollectionRate = Math.round(
    (totalFeesPaid / totalFeesExpected) * 100
  );
  const avgAttendance = Math.round(
    classData.students.reduce((sum, s) => sum + s.attendanceRate, 0) /
      classData.students.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/portal/admin/classes")}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(to br, ${classColor.primary}, ${classColor.primary}cc)`,
              }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">{classData.name}</h1>
              <p className="text-xs text-muted-foreground">
                {classData.level} • {classData.students.length} students
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-muted/50">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-muted/50">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Section with Class Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${classColor.light} p-8 text-white shadow-lg`}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30">
                    {classData.level}
                  </Badge>
                  <h2 className="text-4xl font-bold mb-2">{classData.name}</h2>
                  <p className="text-white/80">
                    Managed by{" "}
                    <span className="font-semibold">
                      {classData.teacher.name}
                    </span>
                  </p>
                </div>
                <div className="flex gap-6 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                    <div className="text-3xl font-bold">
                      {classData.students.length}
                    </div>
                    <div className="text-sm text-white/80">Students</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                    <div className="text-3xl font-bold">
                      {classData.subjects.length}
                    </div>
                    <div className="text-sm text-white/80">Subjects</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Class Teacher Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="playful-card p-6 col-span-1 md:col-span-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    background: `linear-gradient(to br, ${classColor.primary}, ${classColor.primary}cc)`,
                  }}
                >
                  {classData.teacher.avatar}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                    Class Teacher
                  </p>
                  <p className="font-bold text-sm">{classData.teacher.name}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{classData.teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{classData.teacher.email}</span>
                </div>
              </div>
            </motion.div>

            {/* Attendance Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="playful-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                    Avg Attendance
                  </p>
                  <p className="text-3xl font-bold text-mint">
                    {avgAttendance}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-mint opacity-20" />
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-mint to-mint/60 rounded-full"
                  style={{ width: `${avgAttendance}%` }}
                />
              </div>
            </motion.div>

            {/* Fee Collection Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="playful-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                    Fee Collection
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: classColor.primary }}
                  >
                    {feeCollectionRate}%
                  </p>
                </div>
                <Calendar
                  className="w-8 h-8 opacity-20"
                  style={{ color: classColor.primary }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                ₦{totalFeesPaid.toLocaleString()} of ₦
                {totalFeesExpected.toLocaleString()}
              </div>
            </motion.div>

            {/* Student Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="playful-card p-6"
            >
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-4">
                Fee Status
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Paid</span>
                  <Badge className="bg-mint text-mint-foreground text-xs">
                    {
                      classData.students.filter((s) => s.feesStatus === "paid")
                        .length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Partial</span>
                  <Badge className="bg-sunny text-sunny-foreground text-xs">
                    {
                      classData.students.filter(
                        (s) => s.feesStatus === "partial"
                      ).length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Unpaid</span>
                  <Badge
                    className="text-xs"
                    style={{
                      backgroundColor: `${classColor.primary}20`,
                      color: classColor.primary,
                      border: `1px solid ${classColor.primary}40`,
                    }}
                  >
                    {
                      classData.students.filter(
                        (s) => s.feesStatus === "unpaid"
                      ).length
                    }
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Subjects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="playful-card p-6"
          >
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <BookOpen
                className="w-5 h-5"
                style={{ color: classColor.primary }}
              />
              Curriculum
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {classData.subjects.map((subject) => (
                <motion.div
                  key={subject}
                  whileHover={{ translateY: -2 }}
                  className="px-4 py-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl text-sm font-medium text-center border border-muted hover:border-primary/50 transition-colors"
                >
                  {subject}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Students Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-2xl flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${classColor.primary}15`,
                    }}
                  >
                    <Users
                      className="w-6 h-6"
                      style={{ color: classColor.primary }}
                    />
                  </div>
                  Students
                  <Badge
                    className="ml-2 text-lg px-3 py-1"
                    style={{
                      backgroundColor: `${classColor.primary}20`,
                      color: classColor.primary,
                      border: `1px solid ${classColor.primary}40`,
                    }}
                  >
                    {classData.students.length}
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and monitor student performance
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none md:w-72">
                  <style>{`
                     .search-input-${classId}:focus-visible {
                       border-color: ${classColor.primary}80 !important;
                       box-shadow: 0 0 0 3px ${classColor.primary}15 !important;
                       outline: none;
                     }
                   `}</style>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or admission number..."
                    className={`pl-10 bg-muted/50 border-2 search-input-${classId}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      borderColor: `${classColor.primary}30`,
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  className="gap-2 whitespace-nowrap text-white"
                  style={{
                    backgroundColor: `${classColor.primary}`,
                    borderColor: `${classColor.primary}`,
                    color: "white",
                  }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student, index) => {
                  const outstanding = student.totalFees - student.paidFees;
                  const feePercentage = Math.round(
                    (student.paidFees / student.totalFees) * 100
                  );
                  const statusColor =
                    student.feesStatus === "paid"
                      ? "from-mint/10 to-mint/5 border-mint/20"
                      : student.feesStatus === "partial"
                      ? "from-sunny/10 to-sunny/5 border-sunny/20"
                      : "from-coral/10 to-coral/5 border-coral/20";

                  return (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{ translateY: -8 }}
                      onClick={() =>
                        navigate(
                          `/portal/admin/classes/${classId}/students/${student.id}`
                        )
                      }
                      className="group relative cursor-pointer"
                    >
                      {/* Premium card container with gradient border effect */}
                      <div
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-2xl group-hover:shadow-3xl transition-all duration-300 backdrop-blur-sm`}
                        style={{
                          borderColor: `${classColor.primary}20`,
                        }}
                      >
                        {/* Gradient top accent */}
                        <div
                          className="h-0.5 w-full"
                          style={{
                            background: `linear-gradient(to right, ${classColor.primary} 0%, ${classColor.primary}70 50%, transparent 100%)`,
                          }}
                        />

                        {/* Animated subtle background */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
                          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/2 rounded-full blur-3xl" />
                        </div>

                        <div className="relative z-10 p-6 space-y-5">
                          {/* Student Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <motion.div
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
                                style={{
                                  background: `linear-gradient(to br, ${classColor.primary}, ${classColor.primary}cc)`,
                                  color: "white",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  lineHeight: "1",
                                }}
                              >
                                {student.name
                                  .split(" ")
                                  .slice(0, 2)
                                  .map((n) => n.charAt(0).toUpperCase())
                                  .join("")}
                              </motion.div>
                              <div className="min-w-0 flex-1">
                                <h3
                                  className="font-bold text-base leading-tight truncate transition-colors duration-200"
                                  style={{
                                    color: "currentColor",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.color = classColor.primary;
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.color = "currentColor";
                                  }}
                                >
                                  {student.name}
                                </h3>
                                <p className="text-xs text-muted-foreground font-medium truncate mt-0.5">
                                  {student.admissionNo}
                                </p>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 8 }}
                              className="flex-shrink-0"
                            >
                              {getStatusBadge(student.feesStatus)}
                            </motion.div>
                          </div>

                          {/* Key Info - Gender & Attendance */}
                          <div className="grid grid-cols-2 gap-3">
                            <div
                              className="rounded-lg p-4 text-center"
                              style={{
                                backgroundColor: `${classColor.primary}15`,
                              }}
                            >
                              <p className="text-xs text-muted-foreground font-semibold mb-2">
                                Gender
                              </p>
                              <p
                                className="text-lg font-bold"
                                style={{
                                  color: classColor.primary,
                                }}
                              >
                                {student.gender}
                              </p>
                            </div>
                            <div className="bg-muted/40 rounded-lg p-4 text-center">
                              <p className="text-xs text-muted-foreground font-semibold mb-2">
                                Attendance
                              </p>
                              <p
                                className={`text-lg font-bold ${getAttendanceColor(
                                  student.attendanceRate
                                )}`}
                              >
                                {student.attendanceRate}%
                              </p>
                            </div>
                          </div>

                          {/* View Profile Button */}
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/portal/admin/classes/${classId}/students/${student.id}`
                              );
                            }}
                            className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white shadow-lg transition-all duration-200 border-0"
                            style={{
                              background: `linear-gradient(to right, ${classColor.primary}, ${classColor.primary}cc)`,
                              boxShadow: `0 8px 16px ${classColor.primary}40`,
                            }}
                          >
                            View Profile
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="playful-card p-12 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 rounded-xl bg-muted">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">
                      No students found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search terms
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassDetail;

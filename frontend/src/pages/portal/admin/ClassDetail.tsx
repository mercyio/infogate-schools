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
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

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

  // 1. Fetch Class Data
  const { data: classData, isLoading: isLoadingClass, isError: isClassError } = useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      const res = await api.get(`/classes/${classId}`);
      return res.data;
    }
  });

  // 2. Fetch Students
  const { data: students = [], isLoading: isLoadingStudents, isError: isStudentsError } = useQuery({
    queryKey: ['students', classId],
    queryFn: async () => {
      const res = await api.get(`/users/students?class_id=${classId}`);
      return res.data || [];
    }
  });

  // 3. Fetch Subjects
  const { data: subjects = [], isLoading: isLoadingSubjects, isError: isSubjectsError } = useQuery({
    queryKey: ['subjects', classId],
    queryFn: async () => {
      const res = await api.get(`/subjects/class/${classId}`);
      return res.data || [];
    }
  });

  if (isLoadingClass || isLoadingStudents || isLoadingSubjects) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="playful-card p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-coral mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">Class Not Found</h2>
          <p className="text-center text-muted-foreground mb-6">
            Unable to find the requested class. Please try again or select a different class.
          </p>
          <Button 
            onClick={() => navigate('/portal/admin/classes')}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  if (isClassError || isStudentsError || isSubjectsError) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="playful-card p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-coral mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">Unable to Load Class</h2>
          <p className="text-center text-muted-foreground mb-6">
            {isClassError && "Failed to load class details. "}
            {isStudentsError && "Failed to load students. "}
            {isSubjectsError && "Failed to load subjects. "}
            Please check your connection and try again.
          </p>
          <Button 
            onClick={() => navigate('/portal/admin/classes')}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="playful-card p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-coral mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">Class Not Found</h2>
          <p className="text-center text-muted-foreground mb-6">
            The requested class does not exist. It may have been deleted or the ID is invalid.
          </p>
          <Button 
            onClick={() => navigate('/portal/admin/classes')}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    if (!filteredStudents.length) return;
    const headers = ["Name", "Admission Number", "Gender", "Attendance", "Fee Status"];
    const rows = filteredStudents.map(s => {
      const totalFees = classData.fee_structure?.total || 0;
      const paidFees = s.paid_fees || 0;
      const feeStatus = totalFees === 0 ? "Paid" : paidFees >= totalFees ? "Paid" : paidFees > 0 ? "Partial" : "Unpaid";
      return [
        sf(s, 'full_name'),
        s.admission_number,
        sf(s, 'gender'),
        `${s.attendance_rate || 90}%`,
        feeStatus
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${classData.name}_students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exporting student list...");
  };

  const classColor = getClassColor(classId || "1");
  const sf = (obj: any, field: string) =>
    obj?.[field] ?? obj?.user_id?.[field];

  const filteredStudents = students.filter(
    (student: any) =>
      sf(student, 'full_name')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-mint/10 text-mint hover:bg-mint/20 border-none">
            Paid
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-sunny/10 text-sunny hover:bg-sunny/20 border-none">
            Partial
          </Badge>
        );
      case "unpaid":
        return (
          <Badge className="bg-coral/10 text-coral hover:bg-coral/20 border-none">
            Unpaid
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-500 border-none">
            N/A
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

  const totalFeesPaid = students.reduce(
    (sum: number, s: any) => sum + (s.paid_fees || 0),
    0
  );

  const totalFeesExpected = students.length * (classData.fee_structure?.total || 0);

  const feeCollectionRate = totalFeesExpected > 0 ? Math.round(
    (totalFeesPaid / totalFeesExpected) * 100
  ) : 0;

  const avgAttendance = students.length > 0 ? Math.round(
    students.reduce((sum: number, s: any) => sum + (s.attendance_rate || 90), 0) /
    students.length
  ) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">

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
                      {classData.class_teacher_id?.user_id?.full_name || classData.class_teacher_id?.full_name || 'Not assigned'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-6 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                    <div className="text-3xl font-bold">
                      {students.length}
                    </div>
                    <div className="text-sm text-white/80">Students</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                    <div className="text-3xl font-bold">
                      {subjects.length}
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
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{
                    background: "linear-gradient(to bottom right, #4f46e5, #7c3aed)",
                    color: "white"
                  }}
                >
                  {(classData.class_teacher_id?.user_id?.full_name || classData.class_teacher_id?.full_name || 'Teacher')
                    .split(' ')
                    .slice(0, 2)
                    .map((n: string) => n.charAt(0).toUpperCase())
                    .join('')}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                    Class Teacher
                  </p>
                  <p className="font-bold text-sm">{classData.class_teacher_id?.user_id?.full_name || classData.class_teacher_id?.full_name || 'Not assigned'}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{classData.class_teacher_id?.user_id?.phone || classData.class_teacher_id?.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{classData.class_teacher_id?.user_id?.email || classData.class_teacher_id?.email || 'N/A'}</span>
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
                      students.filter((s: any) => {
                        const tf = classData.fee_structure?.total || 0;
                        return tf > 0 && (s.paid_fees || 0) >= tf;
                      }).length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Partial</span>
                  <Badge className="bg-sunny text-sunny-foreground text-xs">
                    {
                      students.filter((s: any) => {
                        const tf = classData.fee_structure?.total || 0;
                        const pf = s.paid_fees || 0;
                        return pf > 0 && pf < tf;
                      }).length
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
                      students.filter((s: any) => {
                        const pf = s.paid_fees || 0;
                        return pf === 0;
                      }).length
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
              {subjects.map((subject: any) => (
                <motion.div
                  key={subject._id}
                  whileHover={{ translateY: -2 }}
                  className="px-4 py-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl text-sm font-medium text-center border border-muted hover:border-primary/50 transition-colors"
                >
                  {subject.name}
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
                    {students.length}
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
                  variant="default"
                  onClick={handleExport}
                  className="gap-2 whitespace-nowrap text-white bg-primary hover:bg-primary/90"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student: any, index: number) => {
                  const totalFees = classData.fee_structure?.total || 0;
                  const paidFees = student.paid_fees || 0;
                  const outstanding = totalFees - paidFees;
                  const feePercentage = totalFees > 0 ? Math.round((paidFees / totalFees) * 100) : 0;
                  const feesStatus = totalFees === 0 ? "paid" : paidFees >= totalFees ? "paid" : paidFees > 0 ? "partial" : "unpaid";
                  const attendanceRate = student.attendance_rate || 90;

                  return (
                    <motion.div
                      key={student._id}
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
                          `/portal/admin/students/${student._id}`
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
                                  className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                >
                                  {(sf(student, 'full_name') || 'N A')
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((n: string) => n[0].toUpperCase())
                                    .join("")}
                                </motion.div>
                                <div className="min-w-0 flex-1">
                                  <h3
                                    className="font-bold text-base leading-tight truncate transition-colors duration-200 group-hover:text-primary"
                                  >
                                    {sf(student, 'full_name')}
                                  </h3>
                                <p className="text-xs text-muted-foreground font-medium truncate mt-0.5">
                                  {student.admission_number}
                                </p>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 8 }}
                              className="flex-shrink-0"
                            >
                              {getStatusBadge(feesStatus)}
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
                                {sf(student, 'gender') || 'N/A'}
                              </p>
                            </div>
                            <div className="bg-muted/40 rounded-lg p-4 text-center">
                              <p className="text-xs text-muted-foreground font-semibold mb-2">
                                Attendance
                              </p>
                              <p
                                className={`text-lg font-bold ${getAttendanceColor(
                                  attendanceRate
                                )}`}
                              >
                                {attendanceRate}%
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
                                `/portal/admin/students/${student._id}`
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

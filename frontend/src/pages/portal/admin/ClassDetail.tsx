import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  ArrowLeft,
  Search,
  Users,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  Download,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";


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

  // 4. Fetch Fee records
  const { data: allFees = [] } = useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const res = await api.get('/fees');
      return res.data || [];
    },
    enabled: !!classId
  });

  // Build per-student fee status from real Fee records
  const studentFeeMap = (() => {
    const studentIds = new Set((students as any[]).map((s: any) => s._id));
    const map: Record<string, { paid: number; pending: number; overdue: number }> = {};
    for (const fee of allFees as any[]) {
      const sid = fee.student_id?._id || fee.student_id;
      if (!sid || !studentIds.has(sid)) continue;
      if (!map[sid]) map[sid] = { paid: 0, pending: 0, overdue: 0 };
      const status: 'paid' | 'pending' | 'overdue' = fee.status;
      if (status === 'paid' || status === 'pending' || status === 'overdue') {
        map[sid][status] += fee.amount || 0;
      }
    }
    return map;
  })();

  const getStudentFeeStatus = (studentId: string): 'paid' | 'partial' | 'unpaid' => {
    const entry = studentFeeMap[studentId];
    if (!entry) return 'unpaid';
    const { paid, pending, overdue } = entry;
    const owed = pending + overdue;
    if (owed === 0 && paid > 0) return 'paid';
    if (paid > 0 && owed > 0) return 'partial';
    return 'unpaid';
  };

  // 5. Fetch Attendance records for this class
  const { data: attendanceRecords = [] } = useQuery({
    queryKey: ['attendance', classId],
    queryFn: async () => {
      const res = await api.get(`/attendance?class_id=${classId}`);
      return res.data || [];
    },
    enabled: !!classId
  });

  // Compute per-student attendance rate from real records
  const studentAttendanceMap = (() => {
    const map: Record<string, { total: number; present: number }> = {};
    for (const r of attendanceRecords as any[]) {
      const sid = r.student_id?._id || r.student_id;
      if (!sid) continue;
      if (!map[sid]) map[sid] = { total: 0, present: 0 };
      map[sid].total++;
      if (r.status === 'present' || r.status === 'late') map[sid].present++;
    }
    return map;
  })();

  const getStudentAttendanceRate = (studentId: string) => {
    const entry = studentAttendanceMap[studentId];
    if (!entry || entry.total === 0) return 0;
    return Math.round((entry.present / entry.total) * 100);
  };

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
      const feeStatus = { paid: "Paid", partial: "Partial", unpaid: "Unpaid" }[getStudentFeeStatus(s._id)];
      return [
        sf(s, 'full_name'),
        s.admission_number,
        sf(s, 'gender'),
        `${getStudentAttendanceRate(s._id)}%`,
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

  const sf = (obj: any, field: string) =>
    obj?.[field] ?? obj?.user_id?.[field];

  const filteredStudents = students.filter(
    (student: any) =>
      sf(student, 'full_name')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFeesPaid = students.reduce(
    (sum: number, s: any) => sum + (s.paid_fees || 0),
    0
  );

  const totalFeesExpected = students.length * (classData.fee_structure?.total || 0);

  const feeCollectionRate = totalFeesExpected > 0 ? Math.round(
    (totalFeesPaid / totalFeesExpected) * 100
  ) : 0;

  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum: number, s: any) => sum + getStudentAttendanceRate(s._id), 0) / students.length)
    : 0;

  const teacherName = classData.class_teacher_id?.user_id?.full_name || classData.class_teacher_id?.full_name || 'Not assigned';
  const teacherInitials = teacherName.split(' ').slice(0, 2).map((n: string) => n[0]?.toUpperCase()).join('');

  const NAVY = "#0a2342";
  const feeChip: Record<string, string> = {
    paid:    "bg-green-100 text-green-700 hover:bg-green-100 border-none",
    partial: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none",
    unpaid:  "bg-red-100 text-red-600 hover:bg-red-100 border-none",
  };
  const feeLabel: Record<string, string> = { paid: "Paid", partial: "Partial", unpaid: "Unpaid" };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] p-8 text-white shadow-lg"
          >
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <button onClick={() => navigate('/portal/admin/classes')} className="flex items-center gap-2 mb-5 text-white/70 hover:text-white text-sm font-semibold transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Classes
              </button>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <Badge className="mb-4 bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                    {classData.level}
                  </Badge>
                  <h2 className="text-4xl font-bold mb-2">{classData.name}</h2>
                  <p className="text-white/80">
                    Managed by <span className="font-semibold">{teacherName}</span>
                  </p>
                </div>
                <div className="flex gap-6 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                    <div className="text-3xl font-bold">{students.length}</div>
                    <div className="text-sm text-white/80">Students</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                    <div className="text-3xl font-bold">{subjects.length}</div>
                    <div className="text-sm text-white/80">Subjects</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Class Teacher */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="playful-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {teacherInitials}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Class Teacher</p>
                  <p className="font-bold text-sm">{teacherName}</p>
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

            {/* Attendance */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="playful-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Avg Attendance</p>
                  <p className={`text-3xl font-bold ${avgAttendance >= 90 ? 'text-green-500' : avgAttendance >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
                    {avgAttendance}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#0a2342] opacity-20" />
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${avgAttendance >= 90 ? 'bg-green-400' : avgAttendance >= 75 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${avgAttendance}%` }} />
              </div>
            </motion.div>

            {/* Fee Collection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="playful-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Fee Collection</p>
                  <p className="text-3xl font-bold" style={{ color: NAVY }}>{feeCollectionRate}%</p>
                </div>
                <Calendar className="w-8 h-8 opacity-20" style={{ color: NAVY }} />
              </div>
              <div className="text-xs text-muted-foreground">
                ₦{totalFeesPaid.toLocaleString()} of ₦{totalFeesExpected.toLocaleString()}
              </div>
            </motion.div>

            {/* Fee Status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="playful-card p-6">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-4">Fee Status</p>
              <div className="space-y-2">
                {[
                  { label: "Paid",    status: "paid",    chip: "bg-green-100 text-green-700" },
                  { label: "Partial", status: "partial", chip: "bg-yellow-100 text-yellow-700" },
                  { label: "Unpaid",  status: "unpaid",  chip: "bg-red-100 text-red-600" },
                ].map(({ label, status, chip }) => (
                  <div key={label} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <Badge className={`${chip} border-none`}>
                      {students.filter((s: any) => getStudentFeeStatus(s._id) === status).length}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Subjects */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="playful-card p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: NAVY }} />
              Curriculum
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {subjects.map((subject: any) => (
                <motion.div
                  key={subject._id}
                  whileHover={{ translateY: -2 }}
                  className="px-4 py-3 bg-gradient-to-br from-[#0a2342]/5 to-[#0a2342]/10 rounded-xl text-sm font-medium text-center border border-[#0a2342]/10 hover:border-yellow-400/50 hover:bg-yellow-50 transition-colors"
                >
                  {subject.name}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Students */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-2xl flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${NAVY}15` }}>
                    <Users className="w-6 h-6" style={{ color: NAVY }} />
                  </div>
                  Students
                  <Badge className="ml-2 text-lg px-3 py-1 bg-yellow-400 text-gray-900 hover:bg-yellow-400 border-none">
                    {students.length}
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Manage and monitor student performance</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or admission number..."
                    className="pl-10 bg-muted/50 border-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button size="sm" onClick={handleExport} className="gap-2 whitespace-nowrap text-white bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 border-none">
                  <Download className="w-4 h-4" /> Export
                </Button>
              </div>
            </div>

            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student: any, index: number) => {
                  const feesStatus = getStudentFeeStatus(student._id);
                  const attendanceRate = getStudentAttendanceRate(student._id);

                  return (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                      whileHover={{ translateY: -8 }}
                      onClick={() => navigate(`/portal/admin/students/${student._id}`)}
                      className="group relative cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-2xl group-hover:shadow-3xl transition-all duration-300 backdrop-blur-sm" style={{ borderColor: `${NAVY}20` }}>
                        <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${NAVY} 0%, #1a5276 50%, transparent 100%)` }} />

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#0a2342]/3 rounded-full blur-3xl" />
                          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#0a2342]/2 rounded-full blur-3xl" />
                        </div>

                        <div className="relative z-10 p-6 space-y-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <motion.div
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                              >
                                {(sf(student, 'full_name') || 'N A').split(" ").slice(0, 2).map((n: string) => n[0].toUpperCase()).join("")}
                              </motion.div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-base leading-tight truncate transition-colors duration-200 group-hover:text-[#0a2342]">
                                  {sf(student, 'full_name')}
                                </h3>
                                <p className="text-xs text-muted-foreground font-medium truncate mt-0.5">{student.admission_number}</p>
                              </div>
                            </div>
                            <motion.div whileHover={{ scale: 1.1, rotate: 8 }} className="flex-shrink-0">
                              <Badge className={feeChip[feesStatus]}>{feeLabel[feesStatus]}</Badge>
                            </motion.div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${NAVY}15` }}>
                              <p className="text-xs text-muted-foreground font-semibold mb-2">Gender</p>
                              <p className="text-lg font-bold" style={{ color: NAVY }}>{sf(student, 'gender') || 'N/A'}</p>
                            </div>
                            <div className="bg-muted/40 rounded-lg p-4 text-center">
                              <p className="text-xs text-muted-foreground font-semibold mb-2">Attendance</p>
                              <p className={`text-lg font-bold ${attendanceRate >= 90 ? 'text-green-500' : attendanceRate >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
                                {attendanceRate}%
                              </p>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/portal/admin/students/${student._id}`); }}
                            className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white shadow-lg transition-all duration-200 border-0"
                            style={{ background: `linear-gradient(to right, ${NAVY}, #1a5276)`, boxShadow: `0 8px 16px ${NAVY}40` }}
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
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="playful-card p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 rounded-xl bg-muted">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground mb-1">No students found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
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

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  GraduationCap,
  ClipboardCheck,
  FileText,
  TrendingUp,
  Bell,
  Search,
  Filter,
  Eye,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  BarChart3,
  Users,
} from "lucide-react";
import { useState } from "react";

interface Teacher {
  id: number;
  name: string;
  subject: string;
  attendanceRate: number;
  assignmentsGiven: number;
  gradesSubmitted: number;
  performance: "excellent" | "good" | "average" | "needs improvement";
  studentCount: number;
  lessonsPrepared: number;
  classesHeld: number;
}

const TEACHERS: Teacher[] = [
  {
    id: 1,
    name: "Mrs. Adebayo",
    subject: "Mathematics",
    attendanceRate: 98,
    assignmentsGiven: 12,
    gradesSubmitted: 85,
    performance: "excellent",
    studentCount: 45,
    lessonsPrepared: 48,
    classesHeld: 47,
  },
  {
    id: 2,
    name: "Mr. Ibrahim",
    subject: "English",
    attendanceRate: 95,
    assignmentsGiven: 15,
    gradesSubmitted: 100,
    performance: "excellent",
    studentCount: 52,
    lessonsPrepared: 50,
    classesHeld: 49,
  },
  {
    id: 3,
    name: "Mrs. Johnson",
    subject: "Science",
    attendanceRate: 92,
    assignmentsGiven: 10,
    gradesSubmitted: 78,
    performance: "good",
    studentCount: 48,
    lessonsPrepared: 45,
    classesHeld: 42,
  },
  {
    id: 4,
    name: "Mr. Okafor",
    subject: "Social Studies",
    attendanceRate: 88,
    assignmentsGiven: 8,
    gradesSubmitted: 65,
    performance: "average",
    studentCount: 44,
    lessonsPrepared: 40,
    classesHeld: 38,
  },
  {
    id: 5,
    name: "Mrs. Bello",
    subject: "Civic Education",
    attendanceRate: 96,
    assignmentsGiven: 11,
    gradesSubmitted: 90,
    performance: "excellent",
    studentCount: 38,
    lessonsPrepared: 46,
    classesHeld: 45,
  },
  {
    id: 6,
    name: "Mr. Eze",
    subject: "Computer Studies",
    attendanceRate: 85,
    assignmentsGiven: 6,
    gradesSubmitted: 50,
    performance: "needs improvement",
    studentCount: 40,
    lessonsPrepared: 35,
    classesHeld: 32,
  },
  {
    id: 7,
    name: "Mrs. Okonkwo",
    subject: "Creative Arts",
    attendanceRate: 94,
    assignmentsGiven: 14,
    gradesSubmitted: 88,
    performance: "good",
    studentCount: 50,
    lessonsPrepared: 47,
    classesHeld: 46,
  },
];

const PageHeader = () => (
  <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-slate-200/50 shadow-sm">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900">Teacher Monitoring</h1>
          <p className="text-xs text-slate-500">Performance & Activity Tracking</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-all"
        >
          <Bell className="w-5 h-5" />
        </Button>
        <Link to="/portal/admin">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  </header>
);

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  trend?: string;
  index: number;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  bgColor,
  trend,
  index,
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`${bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
          <TrendingUp className="w-4 h-4" />
          {trend}
        </div>
      )}
    </div>
    <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
  </motion.div>
);

interface PerformanceIndicatorProps {
  performance: "excellent" | "good" | "average" | "needs improvement";
}

const PerformanceIndicator = ({ performance }: PerformanceIndicatorProps) => {
  const config = {
    excellent: {
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
      icon: CheckCircle,
    },
    good: {
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      icon: Star,
    },
    average: {
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
      icon: AlertCircle,
    },
    "needs improvement": {
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
      icon: AlertCircle,
    },
  };

  const { color, bgColor, icon: IconComponent } = config[performance];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${bgColor}`}
    >
      <IconComponent className={`w-4 h-4 ${color}`} />
      <span className={`text-sm font-semibold capitalize ${color}`}>
        {performance}
      </span>
    </div>
  );
};

interface TeacherDetailModalProps {
  teacher: Teacher | null;
  onClose: () => void;
}

const TeacherDetailModal = ({ teacher, onClose }: TeacherDetailModalProps) => {
  if (!teacher) return null;

  return (
    <AnimatePresence>
      {teacher && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200/50"
          >
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {teacher.name}
                  </h2>
                  <p className="text-slate-600 mt-1">{teacher.subject}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Attendance Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {teacher.attendanceRate}%
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {teacher.studentCount}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Assignments Given</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {teacher.assignmentsGiven}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Lessons Prepared</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {teacher.lessonsPrepared}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Grades Submitted</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {teacher.gradesSubmitted}%
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">Classes Held</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {teacher.classesHeld}
                  </p>
                </div>
              </div>

              {/* Performance */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm font-semibold text-slate-600 mb-3">
                  Performance Status
                </p>
                <PerformanceIndicator performance={teacher.performance} />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 border-t border-slate-200 pt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  View Reports
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface TeacherRowProps {
  teacher: Teacher;
  index: number;
  onView: (teacher: Teacher) => void;
}

const TeacherRow = ({ teacher, index, onView }: TeacherRowProps) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    onClick={() => onView(teacher)}
    className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer group"
  >
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{teacher.name}</p>
          <p className="text-xs text-slate-500">{teacher.subject}</p>
        </div>
      </div>
    </td>
    <td className="py-4 px-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg">
        <span className="font-semibold text-emerald-700">
          {teacher.attendanceRate}%
        </span>
      </div>
    </td>
    <td className="py-4 px-6 text-center">
      <span className="font-semibold text-slate-900">{teacher.studentCount}</span>
    </td>
    <td className="py-4 px-6 text-center">
      <span className="font-semibold text-slate-900">
        {teacher.assignmentsGiven}
      </span>
    </td>
    <td className="py-4 px-6 text-center">
      <span className="font-semibold text-slate-900">
        {teacher.gradesSubmitted}%
      </span>
    </td>
    <td className="py-4 px-6 text-center">
      <span className="font-semibold text-slate-900">
        {teacher.lessonsPrepared}
      </span>
    </td>
    <td className="py-4 px-6">
      <PerformanceIndicator performance={teacher.performance} />
    </td>
    <td className="py-4 px-6 text-right">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onView(teacher);
        }}
        className="group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors"
      >
        <Eye className="w-4 h-4 mr-2" />
        View
      </Button>
    </td>
  </motion.tr>
);

const TeacherMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = TEACHERS.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      label: "Total Teachers",
      value: TEACHERS.length,
      icon: Users,
      bgColor: "bg-purple-600",
      trend: "+2",
    },
    {
      label: "Avg Attendance",
      value: `${Math.round(TEACHERS.reduce((acc, t) => acc + t.attendanceRate, 0) / TEACHERS.length)}%`,
      icon: ClipboardCheck,
      bgColor: "bg-emerald-600",
      trend: "+3%",
    },
    {
      label: "Assignments Given",
      value: TEACHERS.reduce((acc, t) => acc + t.assignmentsGiven, 0),
      icon: FileText,
      bgColor: "bg-blue-600",
      trend: "+12",
    },
    {
      label: "Avg Grade Submission",
      value: `${Math.round(TEACHERS.reduce((acc, t) => acc + t.gradesSubmitted, 0) / TEACHERS.length)}%`,
      icon: BarChart3,
      bgColor: "bg-orange-600",
      trend: "+5%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <PageHeader />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Teacher Performance Dashboard
            </h2>
            <p className="text-slate-600 mt-2">
              Monitor and track teacher performance metrics across all subjects
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                {...stat}
                index={index}
              />
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search by teacher name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-11 rounded-lg border-slate-200 focus:border-purple-600 focus:ring-purple-600"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 border-slate-200 hover:bg-slate-100"
            >
              <Filter className="w-5 h-5 text-slate-600" />
            </Button>
          </div>

          {/* Teachers Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">
                      Teacher
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-900">
                      Attendance
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-900">
                      Students
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-900">
                      Assignments
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-900">
                      Grades
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-900">
                      Lessons
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher, index) => (
                        <TeacherRow
                          key={teacher.id}
                          teacher={teacher}
                          index={index}
                          onView={setSelectedTeacher}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <div className="text-slate-500">
                            <p className="font-semibold mb-1">No teachers found</p>
                            <p className="text-sm">Try adjusting your search</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Teacher Detail Modal */}
      <TeacherDetailModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
    </div>
  );
};

export default TeacherMonitoring;

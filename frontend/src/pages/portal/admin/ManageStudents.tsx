import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, Search, Plus, Filter, Eye, Edit, Trash2,
  Mail, Phone, Calendar, ChevronRight, ChevronDown, ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";

// ── Section definitions ────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "preparatory",
    label: "Preparatory / KG",
    emoji: "🧸",
    gradient: "from-yellow-400 to-amber-500",
    lightBg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-amber-700",
    keywords: ["prep", "kg", "kindergarten", "pre-nursery", "creche"],
  },
  {
    id: "nursery",
    label: "Nursery",
    emoji: "🌱",
    gradient: "from-emerald-500 to-green-600",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    keywords: ["nursery"],
  },
  {
    id: "primary",
    label: "Primary School",
    emoji: "📖",
    gradient: "from-sky-500 to-blue-600",
    lightBg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    keywords: ["primary", "pry", "basic"],
  },
  {
    id: "jss",
    label: "Junior Secondary",
    emoji: "🔬",
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    keywords: ["jss", "junior", "jhs"],
  },
  {
    id: "ss",
    label: "Senior Secondary",
    emoji: "🎓",
    gradient: "from-[#0a2342] to-[#1a5276]",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-900",
    keywords: ["ss ", "ss1", "ss2", "ss3", "senior", "shs"],
  },
  {
    id: "other",
    label: "Other / Unassigned",
    emoji: "📋",
    gradient: "from-gray-400 to-gray-600",
    lightBg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
    keywords: [],
  },
];

const getSectionId = (className: string): string => {
  const lower = (className || "").toLowerCase();
  for (const s of SECTIONS.slice(0, -1)) {
    if (s.keywords.some((k) => lower.includes(k))) return s.id;
  }
  return "other";
};

// ── Helpers ────────────────────────────────────────────────────────────────
const sf = (student: any, field: string) =>
  student[field] ?? student.user_id?.[field];

const getClassName = (student: any) =>
  student.class_id?.name || student.grade || "";

// ── Student card ───────────────────────────────────────────────────────────
const StudentCard = ({
  student,
  onView,
  onEdit,
  onDeactivate,
}: {
  student: any;
  onView: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -3 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden"
  >
    {/* Top band */}
    <div className="h-1.5 bg-gradient-to-r from-[#0a2342] to-yellow-400" />
      {/* Card Header */}
      <div className="p-6 bg-gradient-to-r from-primary/15 to-secondary/15 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {(sf(student, "full_name") || "NA").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Filter className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>{sf(student, "full_name")}</DialogTitle></DialogHeader>
              <div className="space-y-3 py-4">
                <Button className="w-full gap-2 justify-start" variant="outline" onClick={onView}><Eye className="w-4 h-4" /> View Profile</Button>
                <Button className="w-full gap-2 justify-start" variant="outline" onClick={onEdit}><Edit className="w-4 h-4" /> Edit Details</Button>
                <Button className="w-full gap-2 justify-start text-destructive" variant="outline" onClick={onDeactivate}><Trash2 className="w-4 h-4" /> Deactivate</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {sf(student, "full_name") || "Unknown Student"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {student.admission_number || sf(student, "reg_number")} • {sf(student, "status") || "Active"}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground font-medium">Class</p>
            <p className="text-sm font-bold text-primary mt-1">{getClassName(student) || "N/A"}</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-lg">
            <p className="text-xs text-muted-foreground font-medium">Program</p>
            <p className="text-sm font-bold text-secondary mt-1">{student.program || "N/A"}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg col-span-2">
            <p className="text-xs text-muted-foreground font-medium">Admission No.</p>
            <p className="text-sm font-bold mt-1">{student.admission_number || sf(student, "reg_number") || "N/A"}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs pt-2 border-t border-primary/10">
          {(student.parent_email || sf(student, "email")) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span className="truncate">{student.parent_email || sf(student, "email")}</span>
            </div>
          )}
          {(student.parent_phone || sf(student, "phone")) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{student.parent_phone || sf(student, "phone")}</span>
            </div>
          )}
        </div>

        <Button onClick={onView} className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 mt-2">
          <Eye className="w-4 h-4" /> View Full Profile
        </Button>
      </div>
  </motion.div>
);

// ── Section card ───────────────────────────────────────────────────────────
const SectionCard = ({
  section,
  count,
  expanded,
  onToggle,
  students,
  onView,
  onEdit,
  onDeactivate,
}: any) => (
  <motion.div layout className="overflow-hidden">
    {/* Header card */}
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full text-left rounded-2xl border-2 ${section.border} ${section.lightBg} p-5 flex items-center gap-4 transition-all hover:shadow-md`}
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center shadow-md text-2xl shrink-0`}>
        {section.emoji}
      </div>
      <div className="flex-1">
        <h3 className={`font-extrabold text-lg text-gray-900`}>{section.label}</h3>
        <p className={`text-sm font-semibold ${section.text}`}>{count} student{count !== 1 ? "s" : ""} enrolled</p>
      </div>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border ${section.border}`}>
        <span className={`text-sm font-extrabold ${section.text}`}>{count}</span>
        {expanded
          ? <ChevronDown className={`w-4 h-4 ${section.text}`} />
          : <ChevronRight className={`w-4 h-4 ${section.text}`} />}
      </div>
    </motion.button>

    {/* Expanded students */}
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {students.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">No students in this section.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 pb-2">
              {students.map((student: any) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onView={() => onView(student)}
                  onEdit={() => onEdit(student)}
                  onDeactivate={() => onDeactivate(student)}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// ── Main component ─────────────────────────────────────────────────────────
const ManageStudents = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");
const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students = [], isLoading, isError } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await api.get("/users/students");
      return res.data || [];
    },
  });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await api.get("/classes");
      return res.data || [];
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/users/students/${id}`, { status: "inactive" });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student Deactivated", description: "Account marked as inactive." });
    },
    onError: (error: any) => {
      toast({ title: "Action Failed", description: error.response?.data?.message || "Could not deactivate.", variant: "destructive" });
    },
  });

  const handleView = (student: any) => navigate(`/portal/admin/students/${student._id}`);
  const handleEdit = (student: any) => navigate(`/portal/admin/students/register?edit=true&id=${student._id}`);
  const handleDeactivate = (student: any) => {
    if (window.confirm(`Deactivate ${sf(student, "full_name")}?`)) deactivateMutation.mutate(student._id);
  };

  const filteredStudents = students.filter((s: any) => {
    const name = sf(s, "full_name") || "";
    const reg = sf(s, "reg_number") || s.admission_number || "";
    const className = getClassName(s);
    const matchSearch = !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase()) || reg.toLowerCase().includes(searchQuery.toLowerCase()) || className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = filterGrade === "all" || className === filterGrade;
    const matchProgram = filterProgram === "all" || s.program === filterProgram;
    return matchSearch && matchGrade && matchProgram;
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const stats = [
    { label: "Total Students", value: students.length, gradient: "from-[#0a2342] to-[#1a5276]" },
    { label: "Male", value: students.filter((s: any) => sf(s, "gender") === "male").length, gradient: "from-sky-500 to-blue-600" },
    { label: "Female", value: students.filter((s: any) => sf(s, "gender") === "female").length, gradient: "from-violet-500 to-purple-600" },
    { label: "New This Month", value: students.filter((s: any) => new Date(s.createdAt) > thirtyDaysAgo).length, gradient: "from-yellow-400 to-amber-500" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Student Directory</h1>
          <p className="text-sm text-gray-400 mt-0.5">{students.length} students across all sections</p>
        </div>
        <Link to="/portal/admin/students/register">
          <Button className="bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 text-white font-bold gap-2 shadow-md">
            <Plus className="w-4 h-4" /> Enroll Student
          </Button>
        </Link>
      </div>

      {/* ── Stats ── */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Search & Filter ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, reg number or class..."
            className="pl-10 h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-11 rounded-xl font-semibold gap-2 border-gray-200">
              <Filter className="w-4 h-4" /> Filters
              {(filterGrade !== "all" || filterProgram !== "all") && (
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Filter Students</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Class</Label>
                <Select value={filterGrade} onValueChange={setFilterGrade}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls: any) => (
                      <SelectItem key={cls._id} value={cls.name}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Program</Label>
                <Select value={filterProgram} onValueChange={setFilterProgram}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="pre-school">Pre-School / Nursery</SelectItem>
                    <SelectItem value="primary">Primary School</SelectItem>
                    <SelectItem value="junior-secondary">Junior Secondary (JSS)</SelectItem>
                    <SelectItem value="senior-secondary">Senior Secondary (SS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => { setFilterGrade("all"); setFilterProgram("all"); }} className="w-full" variant="outline">
                Reset Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <p className="text-center text-destructive py-12">Failed to load students. Please try again.</p>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No students found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredStudents.map((student: any) => (
              <StudentCard
                key={student._id}
                student={student}
                onView={() => handleView(student)}
                onEdit={() => handleEdit(student)}
                onDeactivate={() => handleDeactivate(student)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;

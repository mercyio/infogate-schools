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
  GraduationCap, Search, Plus, Filter, Eye, Edit, Trash2,
  Mail, Phone, BookOpen, Users, Award, Briefcase,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";

const roleLabel: Record<string, string> = {
  classTeacher: "Class Teacher",
  subjectTeacher: "Subject Teacher",
  both: "Class & Subject",
};

const roleBadge: Record<string, string> = {
  classTeacher: "bg-yellow-100 text-yellow-700",
  subjectTeacher: "bg-blue-100 text-blue-700",
  both: "bg-violet-100 text-violet-700",
};

const tf = (teacher: any, field: string) =>
  teacher[field] ?? teacher.user_id?.[field];

// ── Teacher Card (mirrors StudentCard) ────────────────────────────────────
const TeacherCard = ({
  teacher, onView, onEdit, onDeactivate,
}: {
  teacher: any;
  onView: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
}) => {
  const name = teacher.user_id?.full_name || teacher.full_name || "Unknown";
  const email = teacher.user_id?.email || teacher.email || "";
  const phone = teacher.user_id?.phone || teacher.phone || "";
  const subject = teacher.assigned_subject;
  const cls = teacher.assigned_class?.name;
  const role = teacher.role || "";

  return (
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
            {name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Filter className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>{name}</DialogTitle></DialogHeader>
              <div className="space-y-3 py-4">
                <Button className="w-full gap-2 justify-start" variant="outline" onClick={onView}><Eye className="w-4 h-4" /> View Profile</Button>
                <Button className="w-full gap-2 justify-start" variant="outline" onClick={onEdit}><Edit className="w-4 h-4" /> Edit Details</Button>
                <Button className="w-full gap-2 justify-start text-destructive" variant="outline" onClick={onDeactivate}><Trash2 className="w-4 h-4" /> Remove Teacher</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {teacher.employee_id || teacher.reg_number || "—"} •{" "}
            <span className={`font-semibold ${roleBadge[role] ? roleBadge[role].split(" ")[1] : "text-gray-500"}`}>
              {roleLabel[role] || "Staff"}
            </span>
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-xs text-muted-foreground font-medium">Subject</p>
            <p className="text-sm font-bold text-primary mt-1 truncate">{subject || "N/A"}</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-lg">
            <p className="text-xs text-muted-foreground font-medium">Class</p>
            <p className="text-sm font-bold text-secondary mt-1 truncate">{cls || "N/A"}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg col-span-2">
            <p className="text-xs text-muted-foreground font-medium">Qualification</p>
            <p className="text-sm font-bold mt-1 truncate">{teacher.qualification || "N/A"}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs pt-2 border-t border-primary/10">
          {email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{phone}</span>
            </div>
          )}
        </div>

        <Button onClick={onView} className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 mt-2">
          <Eye className="w-4 h-4" /> View Full Profile
        </Button>
      </div>
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const ManageTeachers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterClass, setFilterClass] = useState("all");

  const { data: teachers = [], isLoading, isError } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => (await api.get("/users/teachers")).data || [],
  });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => (await api.get("/classes")).data || [],
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/users/teachers/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher Removed", description: "Teacher has been removed." });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.response?.data?.message || "Could not remove.", variant: "destructive" }),
  });

  const handleView = (t: any) => navigate(`/portal/admin/teachers/${t._id}`);
  const handleEdit = (t: any) => navigate(`/portal/admin/teachers/register?edit=true&id=${t._id}`);
  const handleDeactivate = (t: any) => {
    if (window.confirm(`Remove ${t.user_id?.full_name || t.full_name || "this teacher"}? This cannot be undone.`))
      deactivateMutation.mutate(t._id);
  };

  const filteredTeachers = teachers.filter((t: any) => {
    const name = t.user_id?.full_name || t.full_name || "";
    const subject = t.assigned_subject || "";
    const cls = t.assigned_class?.name || "";
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery || name.toLowerCase().includes(q) || subject.toLowerCase().includes(q) || cls.toLowerCase().includes(q);
    const matchRole = filterRole === "all" || t.role === filterRole;
    const matchClass = filterClass === "all" || t.assigned_class?._id === filterClass || t.assigned_class === filterClass;
    return matchSearch && matchRole && matchClass;
  });

  const stats = [
    { label: "Total Teachers", value: teachers.length, gradient: "from-[#0a2342] to-[#1a5276]" },
    { label: "Class Teachers", value: teachers.filter((t: any) => t.role === "classTeacher" || t.role === "both").length, gradient: "from-yellow-400 to-amber-500" },
    { label: "Subject Teachers", value: teachers.filter((t: any) => t.role === "subjectTeacher" || t.role === "both").length, gradient: "from-sky-500 to-blue-600" },
    { label: "Unassigned", value: teachers.filter((t: any) => !t.role).length, gradient: "from-gray-400 to-gray-600" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Teacher Directory</h1>
          <p className="text-sm text-gray-400 mt-0.5">{teachers.length} teachers on staff</p>
        </div>
        <Link to="/portal/admin/teachers/register">
          <Button className="bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 text-white font-bold gap-2 shadow-md">
            <Plus className="w-4 h-4" /> Add Teacher
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
                <GraduationCap className="w-5 h-5 text-white" />
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
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, subject or class..."
            className="pl-10 h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-11 rounded-xl font-semibold gap-2 border-gray-200">
              <Filter className="w-4 h-4" /> Filters
              {(filterRole !== "all" || filterClass !== "all") && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Filter Teachers</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Role</Label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="classTeacher">Class Teacher</SelectItem>
                    <SelectItem value="subjectTeacher">Subject Teacher</SelectItem>
                    <SelectItem value="both">Class & Subject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Class</Label>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls: any) => (
                      <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => { setFilterRole("all"); setFilterClass("all"); }} className="w-full" variant="outline">
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
        <p className="text-center text-destructive py-12">Failed to load teachers. Please try again.</p>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-16">
          <GraduationCap className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No teachers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTeachers.map((teacher: any) => (
              <TeacherCard
                key={teacher._id}
                teacher={teacher}
                onView={() => handleView(teacher)}
                onEdit={() => handleEdit(teacher)}
                onDeactivate={() => handleDeactivate(teacher)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ManageTeachers;

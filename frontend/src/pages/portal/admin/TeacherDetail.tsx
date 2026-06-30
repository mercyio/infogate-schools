import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Bell,
  LogOut,
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Award,
  Clock,
  Save,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";

const TeacherDetail = () => {
  const { teacherId } = useParams();
  const queryClient = useQueryClient();
  
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: realTeacher, isLoading, isError } = useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: async () => {
      const res = await api.get(`/users/teachers/${teacherId}`);
      return res.data;
    },
    enabled: !!teacherId
  });

  const { data: attendanceRecords = [] } = useQuery({
    queryKey: ['teacher-attendance', teacherId],
    queryFn: async () => {
      const res = await api.get(`/attendance/teachers?teacher_id=${teacherId}`);
      return res.data;
    },
    enabled: !!teacherId
  });

  interface TeacherEditForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    subject: string;
    class: string;
    qualification: string;
    specialization: string;
    experience: string;
    status: string;
  }

  const [editForm, setEditForm] = useState<TeacherEditForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    subject: "",
    class: "",
    qualification: "",
    specialization: "",
    experience: "",
    status: "",
  });

  // Update edit form when data arrives
  useEffect(() => {
    if (realTeacher) {
      setEditForm({
        name: realTeacher.user_id?.full_name || "",
        email: realTeacher.user_id?.email || "",
        phone: realTeacher.user_id?.phone || "",
        address: realTeacher.address || "",
        role: realTeacher.role || "subjectTeacher",
        subject: realTeacher.assigned_subject || "",
        class: realTeacher.assigned_class?._id || realTeacher.assigned_class || "",
        qualification: realTeacher.qualification || "",
        specialization: realTeacher.specialization || "",
        experience: realTeacher.experience || "",
        status: realTeacher.status || "active",
      });
    }
  }, [realTeacher]);

  const updateTeacherMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        assigned_class: data.class,
        assigned_subject: data.subject,
        qualification: data.qualification,
        specialization: data.specialization,
        experience: data.experience,
        address: data.address,
        status: data.status.toLowerCase()
      };
      return api.put(`/users/teachers/${teacherId}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', teacherId] });
      toast.success("Teacher profile updated successfully!");
      setIsEditOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading teacher profile...</div>;
  if (isError || !realTeacher) return <div className="flex items-center justify-center min-h-screen text-destructive">Error loading teacher profile.</div>;

  const teacher = {
    id: realTeacher._id,
    name: realTeacher.user_id?.full_name || "N/A",
    regNumber: realTeacher.user_id?.reg_number || "N/A",
    subject: realTeacher.assigned_subject || "N/A",
    classes: realTeacher.assigned_class ? [realTeacher.assigned_class?.name || realTeacher.assigned_class] : [],
    experience: realTeacher.experience || "N/A",
    status: realTeacher.status === 'active' ? "Active" : "Inactive",
    email: realTeacher.user_id?.email || "N/A",
    phone: realTeacher.user_id?.phone || "N/A",
    address: realTeacher.address || "N/A",
    dateJoined: realTeacher.date_of_joining || realTeacher.createdAt,
    qualification: realTeacher.qualification || "N/A",
    specialization: realTeacher.specialization || "N/A",
    password: realTeacher.user_id?.password || "********", // Display plain text password if available
    attendance: 0,
    assignmentsUploaded: 0,
    gradesSubmitted: 0
  };

  const handleSaveChanges = () => {
    updateTeacherMutation.mutate(editForm);
  };

  const initials = teacher.name.split(" ").filter((n: string) => !n.includes(".")).map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navy header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Back */}
          <button onClick={() => window.history.back()} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Profile hero */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-xl border-4 border-white/10 shrink-0"
              style={{ background: "linear-gradient(135deg, #0d3460 0%, #1a5276 100%)" }}
            >
              {initials}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-extrabold text-white">{teacher.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                {teacher.classes.length > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-gray-900 text-xs font-extrabold">
                    <Users className="w-3 h-3" /> {teacher.classes[0]} Class Teacher
                  </span>
                )}
                {teacher.subject && teacher.subject !== "N/A" && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
                    <BookOpen className="w-3 h-3" /> {teacher.subject}
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-mono font-semibold border border-white/20">
                  <Shield className="w-3 h-3" /> {teacher.regNumber}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${teacher.status === "Active" ? "bg-green-400/20 text-green-300 border border-green-400/30" : "bg-red-400/20 text-red-300 border border-red-400/30"}`}>
                  {teacher.status}
                </span>
              </div>
            </div>
            {/* Edit button */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-sm font-extrabold transition-colors shadow-md shrink-0">
                  <Edit className="w-4 h-4" /> Edit Teacher
                </button>
              </DialogTrigger>

              {/* ── Edit Dialog ── */}
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] -m-6 mb-5 p-6 rounded-t-xl">
                    <DialogTitle className="text-white font-extrabold text-lg flex items-center gap-2">
                      <Edit className="w-5 h-5 text-yellow-400" /> Edit Teacher Information
                    </DialogTitle>
                    <p className="text-white/50 text-xs mt-1">Update profile and assignment details</p>
                  </div>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                  {/* Personal */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#0a2342] flex items-center justify-center"><Users className="w-3 h-3 text-white" /></span> Personal Information
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "name",    label: "Full Name", type: "text",  key: "name" as const },
                        { id: "email",   label: "Email",     type: "email", key: "email" as const },
                        { id: "phone",   label: "Phone",     type: "text",  key: "phone" as const },
                        { id: "address", label: "Address",   type: "text",  key: "address" as const },
                      ].map(({ id, label, type, key }) => (
                        <div key={id} className="space-y-1">
                          <Label htmlFor={id} className="text-xs font-bold text-gray-600">{label}</Label>
                          <Input id={id} type={type} value={editForm[key]} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} className="rounded-xl" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assignment */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-yellow-400 flex items-center justify-center"><Briefcase className="w-3 h-3 text-gray-900" /></span> Assignment
                    </p>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-gray-600">Professional Role</Label>
                      <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v, subject: "", class: "" })}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose a role" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classTeacher">Class Teacher</SelectItem>
                          <SelectItem value="subjectTeacher">Subject Teacher</SelectItem>
                          <SelectItem value="both">Class & Subject Teacher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(editForm.role === "subjectTeacher" || editForm.role === "both") && (
                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-gray-600">Assigned Subject</Label>
                          <Input value={editForm.subject} onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })} placeholder="e.g. Mathematics" className="rounded-xl" />
                        </div>
                      )}
                      {(editForm.role === "classTeacher" || editForm.role === "both") && (
                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-gray-600">Assigned Class</Label>
                          <Select value={editForm.class} onValueChange={(v) => setEditForm({ ...editForm, class: v })}>
                            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent>
                              {["Daycare","Preparatory","KG 1","KG 2","Nursery 1","Nursery 2","Basic 1","Basic 2","Basic 3","Basic 4","Basic 5","JSS 1","JSS 2","JSS 3","SS 1","SS 2","SS 3","Vocational Training"].map((cls) => (
                                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details & Status */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#0a2342] flex items-center justify-center"><Award className="w-3 h-3 text-white" /></span> Details & Status
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Qualification",  key: "qualification" as const },
                        { label: "Specialization", key: "specialization" as const },
                        { label: "Experience",     key: "experience" as const },
                      ].map(({ label, key }) => (
                        <div key={key} className="space-y-1">
                          <Label className="text-xs font-bold text-gray-600">{label}</Label>
                          <Input value={editForm[key]} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} className="rounded-xl" />
                        </div>
                      ))}
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-600">Status</Label>
                        <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-1">
                    <button onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSaveChanges} disabled={updateTeacherMutation.isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white text-sm font-extrabold hover:opacity-90 transition-opacity disabled:opacity-50">
                      <Save className="w-4 h-4" /> {updateTeacherMutation.isPending ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-5">

        {/* ── Contact chips ── */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Mail,  label: "Email",   value: teacher.email,   bg: "bg-[#0a2342]/10", iconCls: "text-[#0a2342]" },
            { icon: Phone, label: "Phone",   value: teacher.phone,   bg: "bg-yellow-50",    iconCls: "text-amber-600" },
            { icon: MapPin,label: "Address", value: teacher.address, bg: "bg-[#0a2342]/10", iconCls: "text-[#0a2342]" },
          ].map(({ icon: Icon, label, value, bg, iconCls }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${iconCls}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="overview" className="space-y-5">
          <TabsList className="grid w-full grid-cols-3 rounded-xl p-1 bg-white border border-gray-100 shadow-sm h-11">
            <TabsTrigger value="overview" className="rounded-lg text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0a2342] data-[state=active]:to-[#1a5276] data-[state=active]:text-white flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="classes" className="rounded-lg text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0a2342] data-[state=active]:to-[#1a5276] data-[state=active]:text-white flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Classes
            </TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-lg text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0a2342] data-[state=active]:to-[#1a5276] data-[state=active]:text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Attendance
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Professional info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center">
                    <Briefcase className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-sm">Professional Information</h3>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { label: "Qualification",  value: teacher.qualification },
                    { label: "Specialization", value: teacher.specialization },
                    { label: "Experience",     value: teacher.experience },
                    { label: "Date Joined",    value: new Date(teacher.dateJoined).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-400 font-semibold">{label}</span>
                      <span className="text-sm font-bold text-gray-800">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-2 border-t border-dashed border-gray-200 mt-1">
                    <span className="text-xs text-gray-400 font-semibold flex items-center gap-1"><Shield className="w-3 h-3" /> Reg Number</span>
                    <span className="font-mono text-xs bg-[#0a2342]/5 text-[#0a2342] px-2.5 py-1 rounded-lg font-extrabold">{teacher.regNumber}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-gray-400 font-semibold flex items-center gap-1"><Shield className="w-3 h-3" /> Login Password</span>
                    <span className="font-mono text-xs bg-[#0a2342]/5 text-[#0a2342] px-2.5 py-1 rounded-lg font-extrabold">{teacher.password}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Award className="w-3 h-3 text-gray-900" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-sm">Quick Stats</h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-xl p-4 text-center text-white">
                    <p className="text-3xl font-extrabold">{teacher.classes.length}</p>
                    <p className="text-white/60 text-xs font-semibold mt-0.5">Classes Assigned</p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-amber-600">{teacher.classes.length}</p>
                    <p className="text-amber-500/80 text-xs font-semibold mt-0.5">Active Classes</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center col-span-2">
                    <p className="text-3xl font-extrabold text-green-600">100%</p>
                    <p className="text-green-500/80 text-xs font-semibold mt-0.5">Records Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Classes */}
          <TabsContent value="classes">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm">Assigned Classes</h3>
              </div>
              <div className="p-5">
                {teacher.classes.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teacher.classes.map((cls: string, i: number) => (
                      <motion.div
                        key={cls}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-2xl p-5 group"
                      >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                          <BookOpen className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-xl font-extrabold text-white mb-1 relative z-10">{cls}</p>
                        {teacher.subject && teacher.subject !== "N/A" && (
                          <div className="flex items-center gap-1.5 relative z-10">
                            <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-gray-900 text-xs font-extrabold">{teacher.subject}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="font-bold text-gray-400">No classes assigned yet</p>
                    <p className="text-xs text-gray-300 mt-1 max-w-xs mx-auto">Contact the administrator to assign this teacher to a class.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Attendance */}
          <TabsContent value="attendance">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-sm">Attendance Records</h3>
                </div>
                {attendanceRecords.length > 0 && (
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {attendanceRecords.filter((r: any) => r.status === 'present').length} Present
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {attendanceRecords.filter((r: any) => r.status === 'late').length} Late
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle className="w-3.5 h-3.5" />
                      {attendanceRecords.filter((r: any) => r.status === 'absent').length} Absent
                    </span>
                  </div>
                )}
              </div>

              {attendanceRecords.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {[...attendanceRecords]
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record: any, i: number) => {
                      const date = new Date(record.date);
                      const statusMap: Record<string, { label: string; icon: any; cls: string }> = {
                        present: { label: "Present", icon: CheckCircle, cls: "text-green-600 bg-green-50 border-green-100" },
                        late:    { label: "Late",    icon: AlertCircle, cls: "text-amber-600 bg-amber-50 border-amber-100" },
                        absent:  { label: "Absent",  icon: XCircle,     cls: "text-red-600 bg-red-50 border-red-100" },
                      };
                      const s = statusMap[record.status] || statusMap.absent;
                      const Icon = s.icon;
                      return (
                        <motion.div
                          key={record._id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0a2342]/5 to-[#1a5276]/10 flex flex-col items-center justify-center shrink-0">
                              <span className="text-[10px] font-extrabold text-[#0a2342] leading-none">
                                {date.toLocaleDateString("en-GB", { day: "2-digit" })}
                              </span>
                              <span className="text-[8px] font-bold text-[#0a2342]/60 uppercase">
                                {date.toLocaleDateString("en-GB", { month: "short" })}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                              </p>
                              {record.remarks && <p className="text-xs text-gray-400 mt-0.5">{record.remarks}</p>}
                            </div>
                          </div>
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${s.cls}`}>
                            <Icon className="w-3.5 h-3.5" /> {s.label}
                          </span>
                        </motion.div>
                      );
                    })}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="font-bold text-gray-400">No attendance records found</p>
                  <p className="text-xs text-gray-300 mt-1">Attendance will appear here once it has been marked.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDetail;

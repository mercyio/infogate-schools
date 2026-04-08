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
        class: realTeacher.assigned_class || "",
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
    subject: realTeacher.assigned_subject || "N/A",
    classes: realTeacher.assigned_class ? [realTeacher.assigned_class] : [],
    experience: realTeacher.experience || "N/A",
    status: realTeacher.status === 'active' ? "Active" : "Inactive",
    email: realTeacher.user_id?.email || "N/A",
    phone: realTeacher.user_id?.phone || "N/A",
    address: realTeacher.address || "N/A",
    dateJoined: realTeacher.date_of_joining || realTeacher.createdAt,
    qualification: realTeacher.qualification || "N/A",
    specialization: realTeacher.specialization || "N/A",
    attendance: 0,
    assignmentsUploaded: 0,
    gradesSubmitted: 0
  };

  const handleSaveChanges = () => {
    updateTeacherMutation.mutate(editForm);
  };

  return (
    <div className="min-h-screen bg-transparent">

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Teacher Profile Header */}
          <div className="playful-card p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center border border-secondary/20 shadow-inner">
                  <span className="text-3xl font-extrabold text-secondary">
                    {teacher.name
                      .split(" ")
                      .filter(n => !n.includes('.'))
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground tracking-tight">{teacher.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {teacher.classes.length > 0 && (
                      <span className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-semibold border border-secondary/20">
                        <Users className="w-4 h-4" />
                        {teacher.classes[0]} Class Teacher
                      </span>
                    )}
                    {teacher.subject && teacher.subject !== "N/A" && (
                      <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold border border-primary/20">
                        <BookOpen className="w-4 h-4" />
                        {teacher.subject}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        teacher.status === "Active"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {teacher.status}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      • {teacher.experience} experience
                    </span>
                  </div>
                </div>
              </div>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="gap-2 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-lg">
                      <Edit className="w-4 h-4" />
                      Edit Teacher
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card via-card to-muted/20">
                  <DialogHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 -m-6 mb-6 p-6 rounded-t-lg border-b border-primary/20">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                      ✏️ Edit Teacher Information
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Update teacher profile and assignment
                    </p>
                  </DialogHeader>

                  <div className="grid gap-6 py-4 px-2">
                    {/* Personal Information Section */}
                    <div className="space-y-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground border-b border-primary/10 pb-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name" className="font-semibold flex items-center gap-1 text-sm">
                            Full Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="h-11 rounded-lg border-primary/30 focus:ring-2 focus:ring-primary/20 bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-email" className="font-semibold flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" /> Email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="h-11 rounded-lg border-primary/30 focus:ring-2 focus:ring-primary/20 bg-background/50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-phone" className="font-semibold flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" /> Phone <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="h-11 rounded-lg border-primary/30 focus:ring-2 focus:ring-primary/20 bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-address" className="font-semibold flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" /> Address
                          </Label>
                          <Input
                            id="edit-address"
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            className="h-11 rounded-lg border-primary/30 focus:ring-2 focus:ring-primary/20 bg-background/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Assignment Section */}
                    <div className="space-y-4 p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground border-b border-secondary/10 pb-2">
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                          <span className="text-sm">👨‍🏫</span>
                        </div>
                        Assignment Info
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-role" className="font-semibold flex items-center gap-1 text-sm">
                            <Briefcase className="w-3 h-3" /> Professional Role <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={editForm.role}
                            onValueChange={(value) => setEditForm({ ...editForm, role: value, subject: "", class: "" })}
                          >
                            <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:ring-2 focus:ring-secondary/20 bg-background/50">
                              <SelectValue placeholder="Choose a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="classTeacher">Class Teacher</SelectItem>
                              <SelectItem value="subjectTeacher">Subject Teacher</SelectItem>
                              <SelectItem value="both">Class & Subject Teacher</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {(editForm.role === 'subjectTeacher' || editForm.role === 'both') && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                              <Label htmlFor="edit-subject" className="font-semibold flex items-center gap-2 text-sm">
                                <BookOpen className="w-3 h-3 text-primary" />
                                Assigned Subject
                              </Label>
                              <Input
                                id="edit-subject"
                                value={editForm.subject}
                                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                                className="h-11 rounded-lg border-primary/30 focus:ring-2 focus:ring-primary/20 bg-background/50"
                                placeholder="e.g. Mathematics"
                              />
                            </motion.div>
                          )}
                          
                          {(editForm.role === 'classTeacher' || editForm.role === 'both') && (
                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                              <Label htmlFor="edit-class" className="font-semibold flex items-center gap-2 text-sm">
                                <Users className="w-3 h-3 text-secondary" />
                                Assigned Class
                              </Label>
                              <Select
                                value={editForm.class}
                                onValueChange={(value) => setEditForm({ ...editForm, class: value })}
                              >
                                <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:ring-2 focus:ring-secondary/20 bg-background/50">
                                  <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                  {["Daycare", "Preparatory", "KG 1", "KG 2", "Nursery 1", "Nursery 2", "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3", "Vocational Training"].map((cls) => (
                                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Professional Section */}
                    <div className="space-y-4 p-4 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground border-b border-accent/10 pb-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                          <span className="text-sm">🎓</span>
                        </div>
                        Details & Status
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-qualification" className="font-semibold flex items-center gap-1 text-sm">
                            <Award className="w-3 h-3" /> Qualification
                          </Label>
                          <Input
                            id="edit-qualification"
                            value={editForm.qualification}
                            onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                            className="h-11 rounded-lg border-accent/30 focus:ring-2 focus:ring-accent/20 bg-background/50"
                          />
                        </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-specialization" className="font-semibold flex items-center gap-1 text-sm">
                              🎯 Specialization
                            </Label>
                            <Input
                              id="edit-specialization"
                              value={editForm.specialization}
                              onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:ring-2 focus:ring-accent/20 bg-background/50"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-2">
                            <Label htmlFor="edit-experience" className="font-semibold flex items-center gap-1 text-sm">
                              ⭐ Experience
                            </Label>
                            <Input
                              id="edit-experience"
                              value={editForm.experience}
                              onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:ring-2 focus:ring-accent/20 bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-status" className="font-semibold flex items-center gap-1 text-sm">
                              Profile Status
                            </Label>
                            <Select
                              value={editForm.status}
                              onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                            >
                              <SelectTrigger className="h-11 rounded-lg border-accent/30 focus:ring-2 focus:ring-accent/20 bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                  <div className="flex justify-end gap-3 px-4 pb-4 pt-3 border-t border-muted/20">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" onClick={() => setIsEditOpen(false)} className="h-11 px-6 rounded-xl border-muted-foreground/20">
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={handleSaveChanges} disabled={updateTeacherMutation.isPending} className="gap-2 h-11 px-8 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 rounded-xl shadow-md font-bold">
                        {updateTeacherMutation.isPending ? "Saving..." : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Contact & Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="playful-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{teacher.email}</p>
                </div>
              </div>
            </div>
            <div className="playful-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm">{teacher.phone}</p>
                </div>
              </div>
            </div>
            <div className="playful-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium text-sm">{teacher.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-muted/50 h-12">
              <TabsTrigger value="overview" className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Award className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="classes" className="gap-2 rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <Users className="w-4 h-4" />
                Classes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="playful-card p-6">
                  <h3 className="font-semibold mb-4">
                    Professional Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Qualification
                      </span>
                      <span className="font-medium">
                        {teacher.qualification}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Specialization
                      </span>
                      <span className="font-medium">
                        {teacher.specialization}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-medium">{teacher.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date Joined</span>
                      <span className="font-medium">
                        {new Date(teacher.dateJoined).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="playful-card p-6">
                  <h3 className="font-semibold mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {teacher.classes.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Classes Assigned
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center border border-border/50">
                      <p className="text-3xl font-bold text-primary">
                        {teacher.classes.length}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                        Active Classes
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center border border-border/50">
                      <p className="text-3xl font-bold text-secondary">
                        100%
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                        Records Verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="classes" className="space-y-4">
              <div className="playful-card p-6 border-t-4 border-t-secondary shadow-md">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-foreground">
                  <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  Assigned Classes
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teacher.classes.length > 0 ? (
                    teacher.classes.map((className, index) => (
                      <motion.div
                        key={className}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6 relative overflow-hidden group hover:bg-secondary/10 transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                          <BookOpen className="w-12 h-12 text-secondary" />
                        </div>
                        <div className="relative z-10">
                          <p className="text-2xl font-bold text-secondary mb-1">
                            {className}
                          </p>
                          {teacher.subject && teacher.subject !== "N/A" && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                              <Briefcase className="w-4 h-4" />
                              <span>{teacher.subject}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-muted/50">
                      <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                      <p className="text-xl font-bold text-muted-foreground">No classes assigned yet</p>
                      <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto mt-2">
                        Contact the administrator to assign this teacher to a specific class or group.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDetail;

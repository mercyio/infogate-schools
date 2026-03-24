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

const mockTeachers: Record<
  string,
  {
    id: number;
    name: string;
    subject: string;
    classes: string[];
    experience: string;
    status: string;
    email: string;
    phone: string;
    address: string;
    dateJoined: string;
    qualification: string;
    specialization: string;
    attendance: number;
    assignmentsUploaded: number;
    gradesSubmitted: number;
  }
> = {
  "1": {
    id: 1,
    name: "Mrs. Sarah Johnson",
    subject: "Mathematics",
    classes: ["Nursery 1", "Nursery 2", "Primary 1", "Primary 2"],
    experience: "10 years",
    status: "Active",
    email: "sarah.johnson@infogate.edu",
    phone: "+234 801 234 5678",
    address: "12 Oak Street, Lagos",
    dateJoined: "2014-09-01",
    qualification: "M.Ed Mathematics",
    specialization: "Early Childhood Mathematics",
    attendance: 98,
    assignmentsUploaded: 45,
    gradesSubmitted: 120,
  },
  "2": {
    id: 2,
    name: "Mr. David Chen",
    subject: "Science",
    classes: ["Primary 3", "Primary 4", "Primary 5"],
    experience: "8 years",
    status: "Active",
    email: "david.chen@infogate.edu",
    phone: "+234 802 345 6789",
    address: "45 Maple Avenue, Lagos",
    dateJoined: "2016-01-15",
    qualification: "B.Sc Biology",
    specialization: "General Science",
    attendance: 95,
    assignmentsUploaded: 38,
    gradesSubmitted: 90,
  },
  "3": {
    id: 3,
    name: "Ms. Emily Rodriguez",
    subject: "Arts",
    classes: ["Nursery 1", "Nursery 2", "Primary 1", "Primary 2", "Primary 3"],
    experience: "6 years",
    status: "Active",
    email: "emily.rodriguez@infogate.edu",
    phone: "+234 803 456 7890",
    address: "78 Pine Road, Lagos",
    dateJoined: "2018-09-01",
    qualification: "B.A Fine Arts",
    specialization: "Visual Arts & Crafts",
    attendance: 92,
    assignmentsUploaded: 52,
    gradesSubmitted: 150,
  },
};

const TeacherDetail = () => {
  const { teacherId } = useParams();
  const teacher = mockTeachers[teacherId || "1"] || mockTeachers["1"];

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: teacher.name,
    email: teacher.email,
    phone: teacher.phone,
    address: teacher.address,
    role: "subjectTeacher",
    subject: teacher.subject,
    qualification: teacher.qualification,
    experience: teacher.experience,
    status: teacher.status,
  });

  const handleSaveChanges = () => {
    console.log("Saving teacher changes:", editForm);
    setIsEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-admin rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-admin-foreground" />
            </div>
            <div>
              <h1 className="font-bold">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">Infogate Schools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <Link
            to="/portal/admin/teachers"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Teachers
          </Link>

          {/* Teacher Profile Header */}
          <div className="playful-card p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-secondary/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary">
                    {teacher.name
                      .split(" ")
                      .slice(1)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{teacher.name}</h2>
                  <p className="text-muted-foreground">
                    {teacher.subject} Teacher
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        teacher.status === "Active"
                          ? "bg-accent/20 text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {teacher.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
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

                  <div className="grid gap-4 py-2 px-4">
                    {/* Personal Information Section */}
                    <div className="space-y-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-name"
                            className="font-semibold flex items-center gap-1"
                          >
                            Full Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-name"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-email"
                            className="font-semibold flex items-center gap-1"
                          >
                            <Mail className="w-4 h-4" /> Email{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-phone"
                            className="font-semibold flex items-center gap-1"
                          >
                            <Phone className="w-4 h-4" /> Phone{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-phone"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                phone: e.target.value,
                              })
                            }
                            className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-address"
                            className="font-semibold flex items-center gap-1"
                          >
                            <MapPin className="w-4 h-4" /> Address
                          </Label>
                          <Input
                            id="edit-address"
                            value={editForm.address}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                address: e.target.value,
                              })
                            }
                            className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Teacher Role & Assignment Section */}
                    <div className="space-y-4 p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                          <span className="text-sm">👨‍🏫</span>
                        </div>
                        Assignment
                      </h3>
                      <div className="space-y-2">
                        <Label
                          htmlFor="edit-subject"
                          className="font-semibold flex items-center gap-1"
                        >
                          <BookOpen className="w-4 h-4" /> Subject{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={editForm.subject}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, subject: value })
                          }
                        >
                          <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:border-secondary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mathematics">
                              Mathematics
                            </SelectItem>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Arts">Arts</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Physical Ed">
                              Physical Education
                            </SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Computer">
                              Computer Science
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Qualifications Section */}
                    <div className="space-y-4 p-4 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20">
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                          <span className="text-sm">🎓</span>
                        </div>
                        Qualifications
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-qualification"
                            className="font-semibold flex items-center gap-1"
                          >
                            <Award className="w-4 h-4" /> Qualification{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-qualification"
                            value={editForm.qualification}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                qualification: e.target.value,
                              })
                            }
                            className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-experience"
                            className="font-semibold flex items-center gap-1"
                          >
                            ⭐ Experience{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-experience"
                            value={editForm.experience}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                experience: e.target.value,
                              })
                            }
                            className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Role & Assignment Section */}
                  <div className="space-y-4 p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <span className="text-sm">👨‍🏫</span>
                      </div>
                      Teacher Role
                    </h3>
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-role"
                        className="font-semibold flex items-center gap-1"
                      >
                        <Briefcase className="w-4 h-4" /> Role{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={editForm.role}
                        onValueChange={(value) =>
                          setEditForm({ ...editForm, role: value })
                        }
                      >
                        <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:border-secondary">
                          <SelectValue placeholder="Choose a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classTeacher">
                            Class Teacher
                          </SelectItem>
                          <SelectItem value="subjectTeacher">
                            Subject Teacher
                          </SelectItem>
                          <SelectItem value="both">
                            Class & Subject Teacher
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject Assignment - Show for Subject Teacher and Both */}
                    {(editForm.role === "subjectTeacher" ||
                      editForm.role === "both") && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2 p-4 bg-gradient-to-br from-secondary/8 to-secondary/5 rounded-lg border border-secondary/30"
                      >
                        <Label
                          htmlFor="edit-subject"
                          className="font-semibold flex items-center gap-2"
                        >
                          <BookOpen className="w-4 h-4 text-secondary" />
                          Subject Specialty{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="edit-subject"
                          value={editForm.subject}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              subject: e.target.value,
                            })
                          }
                          className="h-11 rounded-lg border-secondary/30 focus:border-secondary bg-background/50"
                          placeholder="e.g., Mathematics, Science"
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 px-4 pb-4 pt-3 border-t border-primary/10">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => setIsEditOpen(false)}
                        className="h-11 px-6 rounded-lg"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleSaveChanges}
                        className="gap-2 h-11 px-6 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 rounded-lg shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
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
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="overview" className="gap-2">
                <Award className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="classes" className="gap-2">
                <Users className="w-4 h-4" />
                Classes
              </TabsTrigger>
              <TabsTrigger value="performance" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Performance
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
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-secondary">
                        {teacher.attendance}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Attendance
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-accent-foreground">
                        {teacher.assignmentsUploaded}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Assignments
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-admin">
                        {teacher.gradesSubmitted}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Grades Submitted
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="classes" className="space-y-4">
              <div className="playful-card p-6">
                <h3 className="font-semibold mb-4">Assigned Classes</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teacher.classes.map((className, index) => (
                    <motion.div
                      key={className}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-muted/50 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{className}</p>
                          <p className="text-xs text-muted-foreground">
                            {teacher.subject}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="playful-card p-6">
                <h3 className="font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Attendance Rate
                      </span>
                      <span className="font-semibold">
                        {teacher.attendance}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${teacher.attendance}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Assignment Completion
                      </span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all"
                        style={{ width: "92%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Grade Submission Rate
                      </span>
                      <span className="font-semibold">88%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: "88%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="playful-card p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    {
                      action: "Uploaded assignment for Nursery 1",
                      time: "2 hours ago",
                    },
                    {
                      action: "Marked attendance for Primary 2",
                      time: "3 hours ago",
                    },
                    {
                      action: "Submitted grades for Primary 1",
                      time: "1 day ago",
                    },
                    { action: "Added learning resources", time: "2 days ago" },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
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

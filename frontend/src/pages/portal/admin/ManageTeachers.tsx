import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  GraduationCap, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Save,
  BookOpen,
  Award,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const ManageTeachers = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [newTeacher, setNewTeacher] = useState({
    name: "", email: "", phone: "", role: "", class: "", subject: "", qualification: "", experience: "", address: ""
  });
  const [editTeacher, setEditTeacher] = useState({
    name: "", email: "", phone: "", role: "", class: "", subject: "", qualification: "", experience: "", address: ""
  });

  const { data: teachers = [], isLoading, isError } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await api.get('/users/teachers');
      return res.data || [];
    }
  });

  const filteredTeachers = teachers.filter((teacher: any) =>
    teacher.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTeacher = () => {
    console.log("Adding new teacher:", newTeacher);
    setIsAddDialogOpen(false);
    setNewTeacher({ name: "", email: "", phone: "", role: "", class: "", subject: "", qualification: "", experience: "", address: "" });
  };

  const handleEditTeacher = (teacher: any) => {
    setEditingTeacherId(teacher._id);
    setEditTeacher({
      name: teacher.full_name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      role: "",
      class: "",
      subject: teacher.subject || "",
      qualification: "",
      experience: teacher.experience || "",
      address: ""
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveTeacher = () => {
    console.log("Saving teacher:", editingTeacherId, editTeacher);
    setIsEditDialogOpen(false);
    setEditTeacher({ name: "", email: "", phone: "", role: "", class: "", subject: "", qualification: "", experience: "", address: "" });
    setEditingTeacherId(null);
  };

  const handleViewTeacher = (teacherId: string) => {
    navigate(`/portal/admin/teachers/${teacherId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10 border-b border-primary/20 sticky top-0 z-50 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-admin to-admin/70 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-5 h-5 text-admin-foreground" />
            </motion.div>
            <div>
              <h1 className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">Infogate Schools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Link to="/login"><Button variant="ghost" size="icon"><LogOut className="w-5 h-5" /></Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back Button */}
          <Link to="/portal/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header Section */}
          <div className="mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-secondary via-secondary/80 to-secondary/60 rounded-2xl flex items-center justify-center shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <GraduationCap className="w-8 h-8 text-secondary-foreground" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Manage Teachers</h2>
                  <p className="text-muted-foreground mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    {teachers.length} total teachers • {teachers.filter((t: any) => t.status !== 'inactive').length} active
                  </p>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="gap-2 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-lg">
                        <Plus className="w-4 h-4" />
                        Add New Teacher
                      </Button>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card via-card to-muted/20">
                    <DialogHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 -m-6 mb-6 p-6 rounded-t-lg border-b border-primary/20">
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                        ✏️ Add New Teacher
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground mt-2">Fill in the information to add a new teacher to the system</p>
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
                            <Label htmlFor="name" className="font-semibold flex items-center gap-1">
                              Full Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="name"
                              value={newTeacher.name}
                              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                              className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold flex items-center gap-1">
                              <Mail className="w-4 h-4" /> Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={newTeacher.email}
                              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                              className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="font-semibold flex items-center gap-1">
                              <Phone className="w-4 h-4" /> Phone Number <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="phone"
                              value={newTeacher.phone}
                              onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                              className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address" className="font-semibold flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> Address
                            </Label>
                            <Input
                              id="address"
                              value={newTeacher.address}
                              onChange={(e) => setNewTeacher({ ...newTeacher, address: e.target.value })}
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
                          Teacher Role
                        </h3>
                        <div className="space-y-2">
                          <Label htmlFor="role" className="font-semibold flex items-center gap-1">
                            <Briefcase className="w-4 h-4" /> Select Role <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={newTeacher.role}
                            onValueChange={(value) => setNewTeacher({ ...newTeacher, role: value, class: "", subject: "" })}
                          >
                            <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:border-secondary">
                              <SelectValue placeholder="Choose a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="classTeacher">Class Teacher</SelectItem>
                              <SelectItem value="subjectTeacher">Subject Teacher</SelectItem>
                              <SelectItem value="both">Class & Subject Teacher</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Class Assignment - Show for Class Teacher and Both */}
                        {(newTeacher.role === "classTeacher" || newTeacher.role === "both") && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2 p-4 bg-gradient-to-br from-primary/8 to-primary/5 rounded-lg border border-primary/30"
                          >
                            <Label htmlFor="class" className="font-semibold flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-primary" />
                              Assign to Class <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={newTeacher.class}
                              onValueChange={(value) => setNewTeacher({ ...newTeacher, class: value })}
                            >
                              <SelectTrigger className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nursery">Nursery</SelectItem>
                                <SelectItem value="kg">Kindergarten</SelectItem>
                                <SelectItem value="class1">Class 1</SelectItem>
                                <SelectItem value="class2">Class 2</SelectItem>
                                <SelectItem value="class3">Class 3</SelectItem>
                                <SelectItem value="class4">Class 4</SelectItem>
                                <SelectItem value="class5">Class 5</SelectItem>
                                <SelectItem value="class6">Class 6</SelectItem>
                                <SelectItem value="jss1">JSS 1</SelectItem>
                                <SelectItem value="jss2">JSS 2</SelectItem>
                                <SelectItem value="jss3">JSS 3</SelectItem>
                                <SelectItem value="ss1">SS 1</SelectItem>
                                <SelectItem value="ss2">SS 2</SelectItem>
                                <SelectItem value="ss3">SS 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}

                        {/* Subject Assignment - Show for Subject Teacher and Both */}
                        {(newTeacher.role === "subjectTeacher" || newTeacher.role === "both") && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2 p-4 bg-gradient-to-br from-secondary/8 to-secondary/5 rounded-lg border border-secondary/30"
                          >
                            <Label htmlFor="subject" className="font-semibold flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-secondary" />
                              Assign Subject <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={newTeacher.subject}
                              onValueChange={(value) => setNewTeacher({ ...newTeacher, subject: value })}
                            >
                              <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:border-secondary bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Science">Science</SelectItem>
                                <SelectItem value="Arts">Arts</SelectItem>
                                <SelectItem value="History">History</SelectItem>
                                <SelectItem value="Physical Ed">Physical Education</SelectItem>
                                <SelectItem value="Music">Music</SelectItem>
                                <SelectItem value="Computer">Computer Science</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="Arabic">Arabic</SelectItem>
                                <SelectItem value="Biology">Biology</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Physics">Physics</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}
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
                            <Label htmlFor="qualification" className="font-semibold flex items-center gap-1">
                              <Award className="w-4 h-4" /> Qualification <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="qualification"
                              value={newTeacher.qualification}
                              onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="experience" className="font-semibold flex items-center gap-1">
                              ⭐ Years of Experience <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="experience"
                              value={newTeacher.experience}
                              onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 px-4 pb-4 pt-3 border-t border-primary/10">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddDialogOpen(false)}
                          className="h-11 px-6 rounded-lg"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={handleAddTeacher} 
                          className="gap-2 h-11 px-6 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 rounded-lg shadow-lg"
                        >
                          <Save className="w-4 h-4" />
                          Add Teacher
                        </Button>
                      </motion.div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Edit Teacher Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card via-card to-muted/20">
                    <DialogHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 -m-6 mb-6 p-6 rounded-t-lg border-b border-primary/20">
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                        ✏️ Edit Teacher
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground mt-2">Update teacher information</p>
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
                            <Label htmlFor="edit-name" className="font-semibold flex items-center gap-1">
                              Full Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="edit-name"
                              value={editTeacher.name}
                              onChange={(e) => setEditTeacher({ ...editTeacher, name: e.target.value })}
                              className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-email" className="font-semibold flex items-center gap-1">
                              <Mail className="w-4 h-4" /> Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editTeacher.email}
                              onChange={(e) => setEditTeacher({ ...editTeacher, email: e.target.value })}
                              className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-phone" className="font-semibold flex items-center gap-1">
                              <Phone className="w-4 h-4" /> Phone Number <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="edit-phone"
                              value={editTeacher.phone}
                              onChange={(e) => setEditTeacher({ ...editTeacher, phone: e.target.value })}
                              className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-address" className="font-semibold flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> Address
                            </Label>
                            <Input
                              id="edit-address"
                              value={editTeacher.address}
                              onChange={(e) => setEditTeacher({ ...editTeacher, address: e.target.value })}
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
                          Teacher Role
                        </h3>
                        <div className="space-y-2">
                          <Label htmlFor="edit-role" className="font-semibold flex items-center gap-1">
                            <Briefcase className="w-4 h-4" /> Select Role <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={editTeacher.role}
                            onValueChange={(value) => setEditTeacher({ ...editTeacher, role: value, class: "", subject: "" })}
                          >
                            <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:border-secondary">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="classTeacher">Class Teacher</SelectItem>
                              <SelectItem value="subjectTeacher">Subject Teacher</SelectItem>
                              <SelectItem value="both">Class & Subject Teacher</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Class Assignment - Show for Class Teacher and Both */}
                        {(editTeacher.role === "classTeacher" || editTeacher.role === "both") && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2 p-4 bg-gradient-to-br from-primary/8 to-primary/5 rounded-lg border border-primary/30"
                          >
                            <Label htmlFor="edit-class" className="font-semibold flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-primary" />
                              Assign to Class <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={editTeacher.class}
                              onValueChange={(value) => setEditTeacher({ ...editTeacher, class: value })}
                            >
                              <SelectTrigger className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nursery">Nursery</SelectItem>
                                <SelectItem value="kg">Kindergarten</SelectItem>
                                <SelectItem value="class1">Class 1</SelectItem>
                                <SelectItem value="class2">Class 2</SelectItem>
                                <SelectItem value="class3">Class 3</SelectItem>
                                <SelectItem value="class4">Class 4</SelectItem>
                                <SelectItem value="class5">Class 5</SelectItem>
                                <SelectItem value="class6">Class 6</SelectItem>
                                <SelectItem value="jss1">JSS 1</SelectItem>
                                <SelectItem value="jss2">JSS 2</SelectItem>
                                <SelectItem value="jss3">JSS 3</SelectItem>
                                <SelectItem value="ss1">SS 1</SelectItem>
                                <SelectItem value="ss2">SS 2</SelectItem>
                                <SelectItem value="ss3">SS 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}

                        {/* Subject Assignment - Show for Subject Teacher and Both */}
                        {(editTeacher.role === "subjectTeacher" || editTeacher.role === "both") && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2 p-4 bg-gradient-to-br from-secondary/8 to-secondary/5 rounded-lg border border-secondary/30"
                          >
                            <Label htmlFor="edit-subject" className="font-semibold flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-secondary" />
                              Assign Subject <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={editTeacher.subject}
                              onValueChange={(value) => setEditTeacher({ ...editTeacher, subject: value })}
                            >
                              <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:border-secondary bg-background/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Science">Science</SelectItem>
                                <SelectItem value="Arts">Arts</SelectItem>
                                <SelectItem value="History">History</SelectItem>
                                <SelectItem value="Physical Ed">Physical Education</SelectItem>
                                <SelectItem value="Music">Music</SelectItem>
                                <SelectItem value="Computer">Computer Science</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="Arabic">Arabic</SelectItem>
                                <SelectItem value="Biology">Biology</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Physics">Physics</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        )}
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
                            <Label htmlFor="edit-qualification" className="font-semibold flex items-center gap-1">
                              <Award className="w-4 h-4" /> Qualification <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="edit-qualification"
                              value={editTeacher.qualification}
                              onChange={(e) => setEditTeacher({ ...editTeacher, qualification: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-experience" className="font-semibold flex items-center gap-1">
                              ⭐ Years of Experience <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="edit-experience"
                              value={editTeacher.experience}
                              onChange={(e) => setEditTeacher({ ...editTeacher, experience: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 px-4 pb-4 pt-3 border-t border-primary/10">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditDialogOpen(false)}
                          className="h-11 px-6 rounded-lg"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={handleSaveTeacher} 
                          className="gap-2 h-11 px-6 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 rounded-lg shadow-lg"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </motion.div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="playful-card p-6 mb-8 bg-gradient-to-r from-card/50 to-card/80 border border-primary/20 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search teachers by name or subject..."
                  className="pl-12 h-12 rounded-2xl border-primary/30 focus:border-primary bg-background/50"
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="gap-2 bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary/80 h-12 rounded-2xl">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Teachers Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : isError ? (
              <p className="text-center text-destructive py-12">Failed to load teachers. Please try again.</p>
            ) : filteredTeachers.length > 0 ? (
              <div className="grid gap-6 mb-8">
                {filteredTeachers.map((teacher: any, index: number) => (
                  <motion.div
                    key={teacher._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="playful-card p-6 bg-gradient-to-br from-card to-card/80 border border-primary/20 cursor-pointer group hover:shadow-2xl transition-all"
                    onClick={() => handleViewTeacher(teacher._id)}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      {/* Teacher Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <motion.div 
                          className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/60 rounded-2xl flex items-center justify-center text-card font-bold text-lg shadow-lg flex-shrink-0"
                          whileHover={{ scale: 1.1 }}
                        >
                          {(teacher.full_name || 'N A').split(' ').map((n: string) => n[0]).join('')}
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">{teacher.full_name}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                              <BookOpen className="w-4 h-4 text-primary" />
                              {teacher.subject || 'No subject assigned'}
                            </span>
                            <span className="flex items-center gap-1 bg-secondary/10 px-3 py-1 rounded-full">
                              <Award className="w-4 h-4 text-secondary" />
                              {teacher.reg_number}
                            </span>
                            {teacher.email && (
                              <span className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                                <Mail className="w-4 h-4 text-accent" />
                                {teacher.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status + Actions */}
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:flex px-3 py-2 bg-accent/20 text-accent-foreground rounded-full text-sm font-semibold items-center gap-2 w-fit">
                          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                          Active
                        </span>
                        <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => { e.stopPropagation(); handleEditTeacher(teacher); }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">No teachers yet. Add a teacher to get started.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageTeachers;

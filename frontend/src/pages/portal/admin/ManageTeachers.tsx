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
  Briefcase,
  Users
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";

const ManageTeachers = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [newTeacher, setNewTeacher] = useState({
    name: "", email: "", phone: "", role: "", class: "", subject: "", qualification: "", specialization: "", experience: "", address: ""
  });
  const [editTeacher, setEditTeacher] = useState({
    name: "", email: "", phone: "", role: "", class: "", subject: "", qualification: "", specialization: "", experience: "", address: ""
  });

  const { data: teachers = [], isLoading, isError } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await api.get('/users/teachers');
      return res.data || [];
    }
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data || [];
    }
  });

  const filteredTeachers = teachers.filter((teacher: any) => {
    const fullName = teacher.user_id?.full_name || teacher.full_name || "";
    const subject = teacher.assigned_subject || teacher.subject || "No subject assigned";
    const className = teacher.assigned_class?.name || teacher.class || "";
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
           className.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const queryClient = useQueryClient();

  const addTeacherMutation = useMutation({
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
        address: data.address
      };
      return api.post('/users/teachers', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success("Teacher added successfully!");
      setIsAddDialogOpen(false);
      setNewTeacher({ name: "", email: "", phone: "", role: "", class: "", subject: "", qualification: "", specialization: "", experience: "", address: "" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add teacher");
    }
  });

  const updateTeacherMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
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
        address: data.address
      };
      return api.put(`/users/teachers/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success("Teacher updated successfully!");
      setIsEditDialogOpen(false);
      setEditingTeacherId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update teacher");
    }
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/teachers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success("Teacher deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete teacher");
    }
  });

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.phone || !newTeacher.role) {
      toast.error("Please fill all required fields");
      return;
    }
    addTeacherMutation.mutate(newTeacher);
  };

  const handleEditTeacher = (teacher: any) => {
    setEditingTeacherId(teacher._id);
    setEditTeacher({
      name: teacher.user_id?.full_name || teacher.full_name || "",
      email: teacher.user_id?.email || teacher.email || "",
      phone: teacher.user_id?.phone || teacher.phone || "",
      role: teacher.role || "",
      class: teacher.assigned_class?._id || teacher.assigned_class || "",
      subject: teacher.assigned_subject || "",
      qualification: teacher.qualification || "",
      specialization: teacher.specialization || "",
      experience: teacher.experience || "",
      address: teacher.address || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveTeacher = () => {
    if (!editingTeacherId) return;
    updateTeacherMutation.mutate({ id: editingTeacherId, data: editTeacher });
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm("Are you sure you want to delete this teacher? This action cannot be undone.")) {
      deleteTeacherMutation.mutate(id);
    }
  };

  const handleViewTeacher = (teacherId: string) => {
    navigate(`/portal/admin/teachers/${teacherId}`);
  };

  return (
    <div className="py-8 px-4">

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

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
                              placeholder="John Doe"
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
                              placeholder="john@example.com"
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
                              placeholder="080XXXXXXXX"
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
                              placeholder="Residential Address"
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
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="role" className="font-semibold flex items-center gap-1">
                              <Briefcase className="w-4 h-4" /> Teacher Role <span className="text-destructive">*</span>
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

                          <div className="grid grid-cols-2 gap-4">
                            {(newTeacher.role === 'subjectTeacher' || newTeacher.role === 'both') && (
                              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                                <Label htmlFor="subject" className="font-semibold flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-primary" />
                                  Assigned Subject
                                </Label>
                                <Input
                                  id="subject"
                                  value={newTeacher.subject}
                                  onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                                  className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                                  placeholder="e.g. Mathematics"
                                />
                              </motion.div>
                            )}
                            
                            {(newTeacher.role === 'classTeacher' || newTeacher.role === 'both') && (
                              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                                <Label htmlFor="class" className="font-semibold flex items-center gap-2">
                                  <Users className="w-4 h-4 text-secondary" />
                                  Assigned Class
                                </Label>
                                <Select
                                  value={newTeacher.class}
                                  onValueChange={(value) => setNewTeacher({ ...newTeacher, class: value })}
                                >
                                  <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:border-secondary bg-background/50">
                                    <SelectValue placeholder="Select Class" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {classes.map((cls: any) => (
                                      <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </motion.div>
                            )}
                          </div>
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
                            <Label htmlFor="qualification" className="font-semibold flex items-center gap-1">
                              <Award className="w-4 h-4" /> Qualification <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="qualification"
                              value={newTeacher.qualification}
                              onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                              placeholder="e.g. B.Sc. Education"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="specialization" className="font-semibold flex items-center gap-1">
                              🎯 Specialization
                            </Label>
                            <Input
                              id="specialization"
                              value={newTeacher.specialization}
                              onChange={(e) => setNewTeacher({ ...newTeacher, specialization: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                              placeholder="e.g. Mathematics, Science"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="experience" className="font-semibold flex items-center gap-1">
                              ⭐ Years of Experience <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="experience"
                              value={newTeacher.experience}
                              onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                              placeholder="e.g. 5 years"
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
                          disabled={addTeacherMutation.isPending}
                          className="gap-2 h-11 px-6 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 rounded-lg shadow-lg"
                        >
                          {addTeacherMutation.isPending ? "Adding..." : (
                            <>
                              <Save className="w-4 h-4" />
                              Add Teacher
                            </>
                          )}
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
                          Assignment
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-role" className="font-semibold flex items-center gap-1">
                              <Briefcase className="w-4 h-4" /> Teacher Role <span className="text-destructive">*</span>
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

                          <div className="grid grid-cols-2 gap-4">
                            {(editTeacher.role === 'subjectTeacher' || editTeacher.role === 'both') && (
                              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                                <Label htmlFor="edit-subject" className="font-semibold flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-primary" />
                                  Assigned Subject
                                </Label>
                                <Input
                                  id="edit-subject"
                                  value={editTeacher.subject}
                                  onChange={(e) => setEditTeacher({ ...editTeacher, subject: e.target.value })}
                                  className="h-11 rounded-lg border-primary/30 focus:border-primary bg-background/50"
                                />
                              </motion.div>
                            )}
                            
                            {(editTeacher.role === 'classTeacher' || editTeacher.role === 'both') && (
                              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                                <Label htmlFor="edit-class" className="font-semibold flex items-center gap-2">
                                  <Users className="w-4 h-4 text-secondary" />
                                  Assigned Class
                                </Label>
                                <Select
                                  value={editTeacher.class}
                                  onValueChange={(value) => setEditTeacher({ ...editTeacher, class: value })}
                                >
                                  <SelectTrigger className="h-11 rounded-lg border-secondary/30 focus:border-secondary bg-background/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {classes.map((cls: any) => (
                                      <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </motion.div>
                            )}
                          </div>
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
                            <Label htmlFor="edit-qualification" className="font-semibold flex items-center gap-1">
                              <Award className="w-4 h-4" /> Qualification
                            </Label>
                            <Input
                              id="edit-qualification"
                              value={editTeacher.qualification}
                              onChange={(e) => setEditTeacher({ ...editTeacher, qualification: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-specialization" className="font-semibold flex items-center gap-1">
                              🎯 Specialization
                            </Label>
                            <Input
                              id="edit-specialization"
                              value={editTeacher.specialization}
                              onChange={(e) => setEditTeacher({ ...editTeacher, specialization: e.target.value })}
                              className="h-11 rounded-lg border-accent/30 focus:border-accent bg-background/50"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-4">
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
                          disabled={updateTeacherMutation.isPending}
                          className="gap-2 h-11 px-6 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 rounded-lg shadow-lg"
                        >
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
                          {(teacher.user_id?.full_name || teacher.full_name || 'N A').split(' ').map((n: string) => n[0]).join('')}
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                            {teacher.user_id?.full_name || teacher.full_name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                            {(teacher.assigned_class || teacher.assigned_subject) ? (
                              <>
                                {teacher.assigned_class && (
                                  <span className="flex items-center gap-1 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                                    <Users className="w-4 h-4 text-secondary" />
                                    {teacher.assigned_class.name || teacher.assigned_class}
                                  </span>
                                )}
                                {teacher.assigned_subject && (
                                  <span className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    {teacher.assigned_subject}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="flex items-center gap-1 bg-muted/30 px-3 py-1 rounded-full border border-muted/50 italic">
                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                No Assignment
                              </span>
                            )}
                            <span className="flex items-center gap-1 bg-accent/5 px-3 py-1 rounded-full border border-accent/20">
                              <Award className="w-4 h-4 text-accent-foreground" />
                              {teacher.employee_id || teacher.reg_number}
                            </span>
                            {(teacher.user_id?.email || teacher.email) && (
                              <span className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                                <Mail className="w-4 h-4 text-accent" />
                                {teacher.user_id?.email || teacher.email}
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
                        <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                          onClick={(e) => { e.stopPropagation(); handleDeleteTeacher(teacher._id); }}
                        >
                          <Trash2 className="w-4 h-4" />
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

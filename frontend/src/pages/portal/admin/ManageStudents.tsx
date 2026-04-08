import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
  Users,
  Search,
  Plus,
  Filter,
  BookOpen,
  Zap,
  TrendingUp,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";



const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case "Excellent":
      return "from-green-500/20 to-green-500/10";
    case "Very Good":
      return "from-blue-500/20 to-blue-500/10";
    case "Good":
      return "from-yellow-500/20 to-yellow-500/10";
    default:
      return "from-gray-500/20 to-gray-500/10";
  }
};

const getPerformanceTextColor = (performance: string) => {
  switch (performance) {
    case "Excellent":
      return "text-green-600";
    case "Very Good":
      return "text-blue-600";
    case "Good":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

const ManageStudents = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");

  const { data: students = [], isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await api.get('/users/students');
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

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Backend returns Student docs with user data nested under `user_id`
  // This helper reads from both the flat level and the nested user_id
  const sf = (student: any, field: string) =>
    student[field] ?? student.user_id?.[field];

  const handleViewStudent = (student: any) => {
    navigate(`/portal/admin/students/${student._id}`);
  };

  const handleEditStudent = (student: any) => {
    navigate(`/portal/admin/students/register?edit=true&id=${student._id}`);
  };

  const deactivateMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const res = await api.put(`/users/students/${studentId}`, { status: 'inactive' });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student Deactivated",
        description: "The student account has been marked as inactive.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Action Failed",
        description: error.response?.data?.message || "Could not deactivate student.",
        variant: "destructive"
      });
    }
  });

  const handleDeactivate = (student: any) => {
    if (window.confirm(`Are you sure you want to deactivate ${sf(student, 'full_name')}?`)) {
      deactivateMutation.mutate(student._id);
    }
  };

  const filteredStudents = students.filter((student: any) => {
    const name = sf(student, 'full_name') || '';
    const regNum = sf(student, 'reg_number') || student.admission_number || '';
    const matchesSearch = !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      regNum.toLowerCase().includes(searchQuery.toLowerCase());
    const studentClassName = student.class_id?.name || student.grade || "";
    const matchesGrade = filterGrade === 'all' || studentClassName === filterGrade;
    const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
    return matchesSearch && matchesGrade && matchesProgram;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const maleCount = students.filter((s: any) => sf(s, "gender") === "male").length;
  const femaleCount = students.filter((s: any) => sf(s, "gender") === "female").length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentCount = students.filter(
    (s: any) => new Date(s.createdAt) > thirtyDaysAgo
  ).length;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header Section */}
          <div className="mb-8 pt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary via-secondary/80 to-primary/60 rounded-2xl flex items-center justify-center shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Student Directory
                  </h2>
                  <p className="text-muted-foreground mt-1 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    {filteredStudents.length} students •{" "}
                    {filteredStudents.filter((s: any) => sf(s, 'status') === 'active' || !sf(s, 'status')).length} active
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link to="/portal/admin/students/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                      <Plus className="w-4 h-4" />
                      Enroll Student
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="col-span-4 flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid sm:grid-cols-4 gap-4 mb-8"
            >
              {[
                {
                  label: "Total Students",
                  value: students.length,
                  icon: Users,
                  color: "primary",
                },
                {
                  label: "Male Students",
                  value: maleCount,
                  icon: Users,
                  color: "secondary",
                },
                {
                  label: "Female Students",
                  value: femaleCount,
                  icon: Users,
                  color: "accent",
                },
                {
                  label: "New This Month",
                  value: recentCount,
                  icon: Calendar,
                  color: "green",
                },
              ].map((stat, index) => {
                const Icon = stat.icon;
                // Use standard theme color variables that exist in index.css
                const themeColors: Record<string, string> = {
                  primary: "from-primary/20 to-primary/10 border-primary/30 text-primary",
                  secondary: "from-secondary/20 to-secondary/10 border-secondary/30 text-secondary",
                  accent: "from-accent/20 to-accent/10 border-accent/30 text-accent",
                  green: "from-student/20 to-student/10 border-student/30 text-student"
                };
                const colorToken = stat.color as keyof typeof themeColors;
                const colorStyles = themeColors[colorToken] || themeColors.primary;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "playful-card p-6 bg-gradient-to-br transition-all hover:shadow-lg border",
                      colorStyles.split(' ').slice(0, 3).join(' ')
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">
                          {stat.label}
                        </p>
                        <p className={cn("text-2xl font-bold mt-2", colorStyles.split(' ').pop())}>
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          colorStyles.split(' ').slice(0, 1).join(' ').replace('/20', '/10')
                        )}
                      >
                        <Icon className={cn("w-6 h-6", colorStyles.split(' ').pop())} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="playful-card p-6 mb-8 bg-gradient-to-br from-card to-card/50 border border-primary/20 shadow-lg space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search by student name or grade..."
                  className="pl-12 h-12 rounded-2xl border-primary/30 focus:border-primary bg-background/70"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="gap-2 bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary/80 h-12 rounded-2xl">
                      <Filter className="w-4 h-4" />
                      Advanced Filters
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      Filter Students
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Grade</Label>
                      <Select
                        value={filterGrade}
                        onValueChange={setFilterGrade}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
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
                      <Select
                        value={filterProgram}
                        onValueChange={setFilterProgram}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Programs</SelectItem>
                          <SelectItem value="pre-school">Pre-School / Nursery</SelectItem>
                          <SelectItem value="primary">Primary School (Basic)</SelectItem>
                          <SelectItem value="junior-secondary">Junior Secondary (JSS)</SelectItem>
                          <SelectItem value="senior-secondary">Senior Secondary (SS)</SelectItem>
                          <SelectItem value="vocational">Vocational Training</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => {
                        setFilterGrade("all");
                        setFilterProgram("all");
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Grid View */}
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : isError ? (
            <p className="text-center text-destructive py-12">Failed to load students. Please try again.</p>
          ) : filteredStudents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredStudents.map((student: any, index: number) => (
                  <motion.div
                    key={student._id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <div className="playful-card overflow-hidden h-full bg-gradient-to-br from-card to-card/80 border border-primary/20 hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all cursor-pointer">
                      {/* Card Header */}
                      <div className="p-6 bg-gradient-to-r from-primary/15 to-secondary/15 relative">
                        <div className="flex items-start justify-between mb-4">
                          <motion.div
                            className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {(sf(student, 'full_name') || 'N A').split(' ').map((n: string) => n[0]).join('')}
                          </motion.div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader><DialogTitle>{sf(student, 'full_name')}</DialogTitle></DialogHeader>
                              <div className="space-y-3 py-4">
                                <Button className="w-full gap-2 justify-start" variant="outline" onClick={() => handleViewStudent(student)}>
                                  <Eye className="w-4 h-4" /> View Profile
                                </Button>
                                <Button className="w-full gap-2 justify-start" variant="outline" onClick={() => handleEditStudent(student)}>
                                  <Edit className="w-4 h-4" /> Edit Details
                                </Button>
                                <Button className="w-full gap-2 justify-start text-destructive" variant="outline" onClick={() => handleDeactivate(student)}>
                                  <Trash2 className="w-4 h-4" /> Deactivate
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {sf(student, 'full_name') || 'Unknown Student'}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {student.admission_number || sf(student, 'reg_number')} • {sf(student, 'status') || 'Active'}
                          </p>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 space-y-4">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium">Class</p>
                            <p className="text-sm font-bold text-primary mt-1">{student.class_id?.name || student.grade || 'N/A'}</p>
                          </div>
                          <div className="p-3 bg-secondary/10 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium">Program</p>
                            <p className="text-sm font-bold text-secondary mt-1">{student.program || 'N/A'}</p>
                          </div>
                          <div className="p-3 bg-accent/10 rounded-lg col-span-2">
                            <p className="text-xs text-muted-foreground font-medium">Admission No.</p>
                            <p className="text-sm font-bold mt-1">{student.admission_number || sf(student, 'reg_number') || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs pt-2 border-t border-primary/10">
                          {(student.parent_email || sf(student, 'email')) && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{student.parent_email || sf(student, 'email')}</span>
                            </div>
                          )}
                          {(student.parent_phone || sf(student, 'phone')) && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{student.parent_phone || sf(student, 'phone')}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => handleViewStudent(student)}
                            className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 mt-4"
                          >
                            <Eye className="w-4 h-4" />
                            View Full Profile
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No students found. Enroll students to get started.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManageStudents;

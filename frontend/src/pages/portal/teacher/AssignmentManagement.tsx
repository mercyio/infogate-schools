import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, Plus, Calendar, Clock, Upload, Eye, Edit, Trash2, Bell, ChevronLeft, Users } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GroupedStudent {
  class: { _id: string; name: string; level: string };
  subject: { _id: string; name: string; code?: string };
  students: any[];
}

const AssignmentManagement = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Fetch grouped students
  const { data: groupedStudents = [], isLoading } = useQuery({
    queryKey: ['teacher-students-grouped'],
    queryFn: async () => {
      const res = await api.get('/users/teacher/students/grouped');
      return res.data as GroupedStudent[];
    }
  });

  // Auto-select first class if available
  React.useEffect(() => {
    if (groupedStudents?.length > 0 && !selectedClass) {
      setSelectedClass(groupedStudents[0].class._id);
      setSelectedSubject(groupedStudents[0].subject._id);
    }
  }, [groupedStudents, selectedClass]);

  const selectedGroupData = groupedStudents.find(g => g.class._id === selectedClass);

  if (isLoading) return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
        <p className="text-muted-foreground">Loading your classes...</p>
      </div>
    </div>
  );

  if (!groupedStudents || groupedStudents.length === 0) return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="text-center">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
        <h3 className="text-xl font-bold text-muted-foreground">No Classes Assigned</h3>
        <p className="text-muted-foreground max-w-xs mx-auto mt-2">You have no classes assigned yet.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/portal/teacher" className="p-2 hover:bg-muted rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-muted-foreground" />
            </Link>
            <div className="w-10 h-10 bg-teacher rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teacher-foreground" />
            </div>
            <div><h1 className="font-bold">Assignments</h1><p className="text-xs text-muted-foreground">Manage class assignments</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowCreate(!showCreate)} className="gap-2">
              <Plus className="w-4 h-4" /> New Assignment
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Your Assignments</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Classes Sidebar */}
            <div className="playful-card p-4">
              <h3 className="font-bold text-lg mb-4">Your Classes</h3>
              <div className="space-y-2">
                {groupedStudents.map((group) => (
                  <button
                    key={`${group.class._id}`}
                    onClick={() => {
                      setSelectedClass(group.class._id);
                      setSelectedSubject(group.subject._id);
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all border",
                      selectedClass === group.class._id
                        ? "bg-primary text-primary-foreground border-primary shadow-lg"
                        : "bg-muted/40 hover:bg-muted/60 border-transparent hover:border-primary/20"
                    )}
                  >
                    <div className="font-semibold text-sm truncate">{group.class.name}</div>
                    <div className="text-xs opacity-75 truncate">{group.subject.name}</div>
                    <div className="text-xs opacity-60">{group.students.length} students</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Create Form */}
              {showCreate && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="playful-card p-6 mb-8">
                  <h3 className="font-bold text-lg mb-4">Create New Assignment</h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input placeholder="Assignment title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Class</label>
                      <div className="px-4 py-2 bg-muted rounded-xl font-medium">
                        {selectedGroupData?.class.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <div className="px-4 py-2 bg-muted rounded-xl font-medium">
                        {selectedGroupData?.subject.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Due Date</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Instructions</label>
                    <Textarea placeholder="Assignment instructions..." rows={4} />
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Attachments</label>
                    <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => {
                      toast.success("Assignment created!");
                      setShowCreate(false);
                    }}>Create Assignment</Button>
                    <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                  </div>
                </motion.div>
              )}

              {/* Assignments List */}
              <div className="space-y-4">
                {selectedGroupData && (
                  <div className="playful-card p-6">
                    <h3 className="font-bold text-lg mb-2">{selectedGroupData.class.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{selectedGroupData.subject.name} • {selectedGroupData.students.length} students</p>
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>No assignments yet for this class</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setShowCreate(true)}
                      >
                        Create First Assignment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignmentManagement;

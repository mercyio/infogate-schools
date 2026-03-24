import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, Plus, Calendar, Clock, Upload, Eye, Edit, Trash2, Bell } from "lucide-react";
import { useState } from "react";

const assignments = [
  { id: 1, title: "Chapter 5 Exercises", subject: "Mathematics", class: "Grade 5A", dueDate: "2024-01-25", submissions: 18, total: 25, status: "active" },
  { id: 2, title: "Essay: My Favorite Book", subject: "English", class: "Grade 5A", dueDate: "2024-01-28", submissions: 22, total: 25, status: "active" },
  { id: 3, title: "Science Project", subject: "Science", class: "Grade 5B", dueDate: "2024-02-01", submissions: 15, total: 28, status: "active" },
  { id: 4, title: "Times Tables Quiz", subject: "Mathematics", class: "Grade 4A", dueDate: "2024-01-20", submissions: 32, total: 32, status: "completed" },
  { id: 5, title: "Creative Writing", subject: "English", class: "Grade 5B", dueDate: "2024-01-22", submissions: 26, total: 28, status: "completed" },
];

const AssignmentManagement = () => {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teacher rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teacher-foreground" />
            </div>
            <div><h1 className="font-bold">Assignments</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Link to="/portal/teacher"><Button variant="ghost" size="sm">Dashboard</Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Manage Assignments</h2>
            <Button onClick={() => setShowCreate(!showCreate)}>
              <Plus className="w-4 h-4 mr-2" /> Create Assignment
            </Button>
          </div>

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
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <select className="w-full px-4 py-2 bg-card border rounded-xl">
                    <option>Mathematics</option>
                    <option>English</option>
                    <option>Science</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Class</label>
                  <select className="w-full px-4 py-2 bg-card border rounded-xl">
                    <option>Grade 5A</option>
                    <option>Grade 5B</option>
                    <option>Grade 4A</option>
                  </select>
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
                <div className="border-2 border-dashed rounded-xl p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button>Create Assignment</Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </motion.div>
          )}

          {/* Assignments List */}
          <div className="space-y-4">
            {assignments.map((assignment, i) => (
              <motion.div key={assignment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="playful-card p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${assignment.status === 'active' ? 'bg-primary' : 'bg-secondary'}`}>
                      <FileText className="w-6 h-6 text-card" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{assignment.subject} • {assignment.class}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Due: {assignment.dueDate}</span>
                        <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {assignment.submissions}/{assignment.total} submitted</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${assignment.status === 'active' ? 'bg-coral/20 text-coral' : 'bg-secondary/20 text-secondary'}`}>
                      {assignment.status}
                    </span>
                    <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1" /> View</Button>
                    <Button variant="outline" size="sm"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignmentManagement;

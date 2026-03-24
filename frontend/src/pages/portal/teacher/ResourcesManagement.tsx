import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Upload, Plus, Video, File, Download, Eye, Trash2, Bell, FolderOpen } from "lucide-react";
import { useState } from "react";

const resources = [
  { id: 1, title: "Algebra Basics - Notes", type: "document", subject: "Mathematics", class: "Grade 5A", size: "2.4 MB", date: "2024-01-15" },
  { id: 2, title: "Introduction to Fractions", type: "video", subject: "Mathematics", class: "Grade 5A", size: "45 MB", date: "2024-01-14" },
  { id: 3, title: "Grammar Rules Worksheet", type: "document", subject: "English", class: "Grade 5B", size: "1.2 MB", date: "2024-01-13" },
  { id: 4, title: "Science Experiment Guide", type: "document", subject: "Science", class: "Grade 5A", size: "3.8 MB", date: "2024-01-12" },
  { id: 5, title: "Past Questions - Maths", type: "document", subject: "Mathematics", class: "All Classes", size: "5.1 MB", date: "2024-01-10" },
  { id: 6, title: "Creative Writing Tips", type: "video", subject: "English", class: "Grade 5B", size: "62 MB", date: "2024-01-08" },
];

const ResourcesManagement = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teacher rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teacher-foreground" />
            </div>
            <div><h1 className="font-bold">Resources</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
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
            <h2 className="text-2xl font-bold">Learning Resources</h2>
            <Button onClick={() => setShowUpload(!showUpload)}>
              <Upload className="w-4 h-4 mr-2" /> Upload Resource
            </Button>
          </div>

          {/* Upload Form */}
          {showUpload && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="playful-card p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Upload New Resource</h3>
              <div className="border-2 border-dashed rounded-xl p-12 text-center mb-4">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground mb-4">PDF, DOC, PPT, MP4 up to 100MB</p>
                <Button variant="outline">Choose Files</Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <select className="px-4 py-2 bg-card border rounded-xl">
                  <option>Select Subject</option>
                  <option>Mathematics</option>
                  <option>English</option>
                  <option>Science</option>
                </select>
                <select className="px-4 py-2 bg-card border rounded-xl">
                  <option>Select Class</option>
                  <option>Grade 5A</option>
                  <option>Grade 5B</option>
                  <option>All Classes</option>
                </select>
                <Button>Upload</Button>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Documents", value: "24", icon: FileText, color: "bg-primary" },
              { label: "Videos", value: "8", icon: Video, color: "bg-coral" },
              { label: "Total Size", value: "1.2 GB", icon: FolderOpen, color: "bg-lavender" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="playful-card p-6">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-card" />
                </div>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, i) => (
              <motion.div key={resource.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="playful-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resource.type === 'video' ? 'bg-coral' : 'bg-primary'}`}>
                    {resource.type === 'video' ? <Video className="w-6 h-6 text-card" /> : <FileText className="w-6 h-6 text-card" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{resource.size}</span>
                </div>
                <h3 className="font-bold mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{resource.subject} • {resource.class}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"><Eye className="w-4 h-4 mr-1" /> View</Button>
                  <Button variant="outline" size="sm"><Download className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourcesManagement;

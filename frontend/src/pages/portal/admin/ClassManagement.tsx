import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  BookOpen,
  Plus,
  Search,
  Users,
  Clock,
  Edit,
  Trash2,
  Bell,
  MoreVertical,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Class color mapping - unique color per class
const getClassColor = (classId: number) => {
  const colorMap: Record<number, string> = {
    1: "#F97316",
    2: "#EC4899",
    3: "#06B6D4",
    4: "#8B5CF6",
    5: "#10B981",
    6: "#F59E0B",
    7: "#EF4444",
    8: "#3B82F6",
    9: "#14B8A6",
  };

  return colorMap[classId] || "#6366F1";
};

interface Teacher {
  id: number;
  name: string;
  isClassTeacher: boolean;
  subjectSpecialty?: string;
}

interface Class {
  id: number;
  name: string;
  level: "Nursery" | "Primary" | "Secondary" | "Vocational";
  students: number;
  teacherId: number;
  teacherName: string;
  subjectIds: string[];
}

const ClassMenu = ({ classId }: { classId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-slate-600" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-50"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100 rounded-t-lg"
          >
            <Edit className="w-4 h-4" />
            Edit Class
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
          >
            <Trash2 className="w-4 h-4" />
            Delete Class
          </button>
        </motion.div>
      )}
    </div>
  );
};

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (classData: Class) => void;
  availableSubjects: string[];
  availableTeachers: Teacher[];
}

const AddClassModal = ({
  isOpen,
  onClose,
  onAdd,
  availableSubjects,
  availableTeachers,
}: AddClassModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    level: "Nursery" as "Nursery" | "Primary" | "Secondary" | "Vocational",
  });

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.name && selectedSubjects.length > 0) {
      const newClass: Class = {
        id: Date.now(),
        name: formData.name,
        level: formData.level,
        teacherId: 0,
        teacherName: "To be assigned",
        students: 0,
        subjectIds: selectedSubjects,
      };
      onAdd(newClass);
      setFormData({ name: "", level: "Nursery" });
      setSelectedSubjects([]);
      onClose();
    }
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden"
          >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 px-8 py-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Create New Class
                </h2>
                <p className="text-cyan-50 text-sm mt-1">
                  Set up a new class with subjects
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-8 max-h-[70vh] overflow-y-auto"
            >
              {/* Class Name Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Class Name
                </label>
                <Input
                  placeholder="e.g., Primary 1, JSS 2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </motion.div>

              {/* Class Level Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Class Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "Nursery", label: "Nursery" },
                    { value: "Primary", label: "Primary" },
                    { value: "Secondary", label: "Secondary" },
                    { value: "Vocational", label: "Vocational" },
                  ].map((level) => (
                    <motion.button
                      key={level.value}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          level: level.value as
                            | "Nursery"
                            | "Primary"
                            | "Secondary"
                            | "Vocational",
                        })
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`py-3 px-4 rounded-xl font-medium transition-all border-2 ${
                        formData.level === level.value
                          ? "bg-cyan-500 text-white border-cyan-500 shadow-lg"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50"
                      }`}
                    >
                      {level.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Subjects Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-slate-900">
                    Select Subjects
                  </label>
                  {selectedSubjects.length > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {selectedSubjects.length} selected
                    </span>
                  )}
                </div>

                <div className="space-y-2 bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-xl border-2 border-slate-200">
                  {availableSubjects.length > 0 ? (
                    availableSubjects.map((subject) => (
                      <motion.label
                        key={subject}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 cursor-pointer hover:bg-white p-3 rounded-lg transition-all group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(subject)}
                          onChange={() => toggleSubject(subject)}
                          className="w-5 h-5 rounded-lg border-2 border-slate-300 text-cyan-500 cursor-pointer accent-cyan-500 transition-all"
                        />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                          {subject}
                        </span>
                      </motion.label>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-600">
                        No subjects available
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Please create subjects first
                      </p>
                    </div>
                  )}
                </div>

                {availableSubjects.length > 0 &&
                  selectedSubjects.length === 0 && (
                    <p className="text-xs text-slate-500 mt-3">
                      At least one subject is required
                    </p>
                  )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 pt-6 border-t border-slate-200"
              >
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!formData.name || selectedSubjects.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Create Class
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subject: string) => void;
}

const AddSubjectModal = ({ isOpen, onClose, onAdd }: AddSubjectModalProps) => {
  const [subjectName, setSubjectName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjectName.trim()) {
      onAdd(subjectName);
      setSubjectName("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full border border-slate-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Add New Subject
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Subject Name
                </label>
                <Input
                  placeholder="e.g., Literature"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ClassManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLevel, setActiveLevel] = useState("All");
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // Mock teacher data - In a real app, this would come from teacher management
  const [teacherList] = useState<Teacher[]>([
    {
      id: 1,
      name: "Mrs. Adebayo",
      isClassTeacher: true,
      subjectSpecialty: "Mathematics",
    },
    {
      id: 2,
      name: "Mr. Ibrahim",
      isClassTeacher: true,
      subjectSpecialty: "English",
    },
    {
      id: 3,
      name: "Mrs. Johnson",
      isClassTeacher: true,
      subjectSpecialty: "Science",
    },
    {
      id: 4,
      name: "Mr. Okafor",
      isClassTeacher: true,
      subjectSpecialty: "Social Studies",
    },
    {
      id: 5,
      name: "Mrs. Bello",
      isClassTeacher: true,
      subjectSpecialty: "Civic Education",
    },
    {
      id: 6,
      name: "Mr. Eze",
      isClassTeacher: false,
      subjectSpecialty: "Computer Studies",
    },
    {
      id: 7,
      name: "Mrs. Okonkwo",
      isClassTeacher: true,
      subjectSpecialty: "Creative Arts",
    },
    {
      id: 8,
      name: "Mr. Adeleke",
      isClassTeacher: true,
      subjectSpecialty: "Physics",
    },
    {
      id: 9,
      name: "Mr. Adamu",
      isClassTeacher: true,
      subjectSpecialty: "Agriculture",
    },
  ]);

  const [classList, setClassList] = useState<Class[]>([
    {
      id: 1,
      name: "Nursery 1",
      level: "Nursery",
      students: 25,
      teacherId: 1,
      teacherName: "Mrs. Adebayo",
      subjectIds: [
        "Mathematics",
        "English Language",
        "Basic Science",
        "Social Studies",
        "Creative Arts",
        "Physical Education",
      ],
    },
    {
      id: 2,
      name: "Nursery 2",
      level: "Nursery",
      students: 28,
      teacherId: 7,
      teacherName: "Mrs. Okonkwo",
      subjectIds: [
        "Mathematics",
        "English Language",
        "Basic Science",
        "Social Studies",
        "Creative Arts",
        "Physical Education",
      ],
    },
    {
      id: 3,
      name: "Primary 1",
      level: "Primary",
      students: 32,
      teacherId: 2,
      teacherName: "Mr. Ibrahim",
      subjectIds: [
        "Mathematics",
        "English Language",
        "Basic Science",
        "Social Studies",
        "Civic Education",
        "Computer Studies",
        "Creative Arts",
        "Physical Education",
      ],
    },
    {
      id: 4,
      name: "Primary 2",
      level: "Primary",
      students: 30,
      teacherId: 3,
      teacherName: "Mrs. Johnson",
      subjectIds: [
        "Mathematics",
        "English Language",
        "Basic Science",
        "Social Studies",
        "Civic Education",
        "Computer Studies",
        "Creative Arts",
        "Physical Education",
      ],
    },
    {
      id: 5,
      name: "Primary 3",
      level: "Primary",
      students: 35,
      teacherId: 8,
      teacherName: "Mr. Adeleke",
      subjectIds: [
        "Mathematics",
        "English Language",
        "Basic Science",
        "Social Studies",
        "Civic Education",
        "Computer Studies",
        "Agriculture",
        "Creative Arts",
        "Physical Education",
      ],
    },
    {
      id: 6,
      name: "JSS 1",
      level: "Secondary",
      students: 40,
      teacherId: 4,
      teacherName: "Mr. Okafor",
      subjectIds: [
        "Mathematics",
        "English Language",
        "Basic Science",
        "Social Studies",
        "Civic Education",
        "Computer Studies",
        "Physical Education",
        "Creative Arts",
        "Agriculture",
        "Home Economics",
        "Physics",
        "Chemistry",
      ],
    },
    {
      id: 7,
      name: "JSS 2",
      level: "Secondary",
      students: 38,
      teacherId: 5,
      teacherName: "Mrs. Bello",
      subjectIds: [
        "Mathematics",
        "English Language",
        "Basic Science",
        "Social Studies",
        "Civic Education",
        "Computer Studies",
        "Physical Education",
        "Creative Arts",
        "Agriculture",
        "Home Economics",
        "Physics",
        "Chemistry",
      ],
    },
    {
      id: 8,
      name: "SS 1",
      level: "Secondary",
      students: 42,
      teacherId: 6,
      teacherName: "Mr. Eze",
      subjectIds: [
        "Mathematics",
        "English Language",
        "Basic Science",
        "Social Studies",
        "Computer Studies",
        "Physical Education",
        "Creative Arts",
        "Agriculture",
        "Physics",
        "Chemistry",
      ],
    },
    {
      id: 9,
      name: "Vocational 1",
      level: "Vocational",
      students: 20,
      teacherId: 9,
      teacherName: "Mr. Adamu",
      subjectIds: [
        "Computer Studies",
        "Creative Arts",
        "Agriculture",
        "Home Economics",
        "Physical Education",
        "Mathematics",
        "English Language",
        "Basic Science",
      ],
    },
  ]);

  const [subjectList, setSubjectList] = useState([
    "Mathematics",
    "English Language",
    "Basic Science",
    "Social Studies",
    "Civic Education",
    "Computer Studies",
    "Physical Education",
    "Creative Arts",
    "Agriculture",
    "Home Economics",
  ]);

  const filteredClasses = classList.filter(
    (cls) =>
      (activeLevel === "All" || cls.level === activeLevel) &&
      (cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClass = (newClass: Class) => {
    setClassList([...classList, newClass]);
  };

  const handleAddSubject = (newSubject: string) => {
    if (!subjectList.includes(newSubject)) {
      setSubjectList([...subjectList, newSubject]);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-admin rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-admin-foreground" />
            </div>
            <div>
              <h1 className="font-bold">Class Management</h1>
              <p className="text-xs text-muted-foreground">Infogate Schools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Link to="/portal/admin">
              <Button variant="ghost" size="sm">
                Dashboard
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
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {["All", "Nursery", "Primary", "Secondary", "Vocational"].map(
                  (level) => (
                    <Button
                      key={level}
                      variant={activeLevel === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveLevel(level)}
                    >
                      {level}
                    </Button>
                  )
                )}
              </div>
            </div>
            <Button onClick={() => setShowAddClassModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Class
            </Button>
          </div>

          {/* Classes Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredClasses.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="playful-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  (window.location.href = `/portal/admin/classes/${cls.id}`)
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: getClassColor(cls.id),
                    }}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-muted rounded-full text-xs font-semibold">
                      {cls.level}
                    </span>
                    <ClassMenu classId={cls.id} />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{cls.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Class Teacher: {cls.teacherName}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {cls.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" /> {cls.subjectIds.length}{" "}
                    subjects
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Subjects Section */}
          <div className="playful-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Subjects
              </h3>
              <Button size="sm" onClick={() => setShowAddSubjectModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Subject
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjectList.map((subject) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative px-4 py-2 bg-muted rounded-xl text-sm font-medium hover:bg-primary hover:text-card cursor-pointer transition-colors"
                >
                  {subject}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSubjectList(subjectList.filter((s) => s !== subject));
                    }}
                    className="absolute -top-2 -right-2 hidden group-hover:flex items-center justify-center w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
                    title="Delete subject"
                  >
                    ✕
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddClassModal
        isOpen={showAddClassModal}
        onClose={() => setShowAddClassModal(false)}
        onAdd={handleAddClass}
        availableSubjects={subjectList}
        availableTeachers={teacherList}
      />
      <AddSubjectModal
        isOpen={showAddSubjectModal}
        onClose={() => setShowAddSubjectModal(false)}
        onAdd={handleAddSubject}
      />
    </div>
  );
};

export default ClassManagement;

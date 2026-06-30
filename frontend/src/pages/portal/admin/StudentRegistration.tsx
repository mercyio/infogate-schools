import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Bell,
  LogOut,
  ArrowLeft,
  User,
  Save,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Users,
  GraduationCap,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const studentId = searchParams.get("id");

  const [parentSearch, setParentSearch] = useState("");
  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);
  const parentDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (parentDropdownRef.current && !parentDropdownRef.current.contains(e.target as Node)) {
        setParentDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    program: "",
    class_id: "",
    parent_id: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    emergencyContact: "",
    medicalInfo: "",
  });

  // Fetch student data if in edit mode
  const { isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const res = await api.get(`/users/students/${studentId}`);
      const student = res.data;
      const [firstName = "", ...lastNameParts] = (student.user_id?.full_name || student.full_name || "").split(" ");
      
      setFormData({
        firstName,
        lastName: lastNameParts.join(" "),
        dateOfBirth: student.date_of_birth?.split('T')[0] || "",
        gender: student.gender || "",
        address: student.address || "",
        program: student.program || "",
        class_id: student.class_id?._id || student.class_id || "",
        parent_id: student.parent_id?._id || student.parent_id || "",
        parentName: student.parent_name || "",
        parentEmail: student.parent_email || "",
        parentPhone: student.parent_phone || "",
        emergencyContact: student.emergency_contact || "",
        medicalInfo: student.medical_info || "",
      });
      return student;
    },
    enabled: isEdit && !!studentId,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data || [];
    }
  });

  const { data: parents = [] } = useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      const res = await api.get('/users/parents');
      return res.data || [];
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        full_name: `${data.firstName} ${data.lastName}`.trim(),
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        program: data.program,
        class_id: data.class_id,
        parent_id: data.parent_id || undefined,
        parent_name: data.parentName,
        parent_email: data.parentEmail,
        parent_phone: data.parentPhone,
        emergency_contact: data.emergencyContact,
        medical_info: data.medicalInfo,
      };
      
      if (isEdit) {
        const res = await api.put(`/users/students/${studentId}`, payload);
        return res.data;
      } else {
        const res = await api.post('/users/students', payload);
        return res.data;
      }
    },
    onSuccess: (data) => {
      if (isEdit) {
        toast({
          title: "✅ Student Updated!",
          description: "The student information has been updated successfully.",
        });
      } else {
        const creds = data.credentials || data;
        toast({
          title: "✅ Student Registered!",
          description: `Reg No: ${creds.reg_number} | Temp Password: ${creds.password}. Share these login details with the student.`,
        });
      }
      navigate('/portal/admin/students');
    },
    onError: (error: any) => {
      toast({
        title: isEdit ? "Update Failed" : "Registration Failed",
        description: error.response?.data?.message || `Could not ${isEdit ? 'update' : 'register'} student. Please try again.`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="py-8 px-4">

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8 pt-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{isEdit ? 'Edit Student Details' : 'Register New Student'}</h2>
              <p className="text-muted-foreground">{isEdit ? 'Update the student information below' : 'Fill in the student details below'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Information */}
            <div className="playful-card p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Student Information
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">First Name *</label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Last Name *</label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Date of Birth *</label>
                  <Input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-sm font-semibold mb-2 block">Address *</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="playful-card p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-secondary" />
                Academic Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Program *</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select program</option>
                    <option value="pre-school">Pre-School / Nursery</option>
                    <option value="primary">Primary School (Basic)</option>
                    <option value="junior-secondary">Junior Secondary (JSS)</option>
                    <option value="senior-secondary">Senior Secondary (SS)</option>
                    <option value="vocational">Vocational Training</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Grade/Class *</label>
                  <select
                    name="class_id"
                    value={formData.class_id}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select class</option>
                    {classes.map((cls: any) => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="playful-card p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-parent" />
                Parent/Guardian Information
              </h3>
              <div className="mb-4">
                <label className="text-sm font-semibold mb-2 block">Link to Parent Account</label>
                <div className="relative" ref={parentDropdownRef}>
                  {/* Display selected parent or search input */}
                  <div
                    className="flex items-center h-12 rounded-xl border border-input bg-background px-3 gap-2 cursor-pointer"
                    onClick={() => setParentDropdownOpen((o) => !o)}
                  >
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    {formData.parent_id ? (
                      <>
                        <span className="text-sm flex-1 truncate">
                          {(() => {
                            const p = parents.find((p: any) => p._id === formData.parent_id) as any;
                            return p ? `${p.user_id?.full_name}${p.relationship ? ` (${p.relationship})` : ""}` : "Selected";
                          })()}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, parent_id: "" }); setParentSearch(""); }}
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                          placeholder="Search parent by name or email…"
                          value={parentSearch}
                          onChange={(e) => { setParentSearch(e.target.value); setParentDropdownOpen(true); }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      </>
                    )}
                  </div>

                  {/* Dropdown list */}
                  {parentDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-background border border-input rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      <div
                        className="px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted cursor-pointer"
                        onClick={() => { setFormData({ ...formData, parent_id: "" }); setParentSearch(""); setParentDropdownOpen(false); }}
                      >
                        — None (unlink parent) —
                      </div>
                      {parents
                        .filter((p: any) => {
                          const q = parentSearch.toLowerCase();
                          return (
                            p.user_id?.full_name?.toLowerCase().includes(q) ||
                            p.user_id?.email?.toLowerCase().includes(q) ||
                            p.relationship?.toLowerCase().includes(q)
                          );
                        })
                        .map((p: any) => (
                          <div
                            key={p._id}
                            className="px-4 py-2.5 hover:bg-muted cursor-pointer"
                            onClick={() => {
                              setFormData({ ...formData, parent_id: p._id });
                              setParentSearch("");
                              setParentDropdownOpen(false);
                            }}
                          >
                            <p className="text-sm font-medium">{p.user_id?.full_name} {p.relationship ? <span className="text-muted-foreground font-normal">({p.relationship})</span> : null}</p>
                            <p className="text-xs text-muted-foreground">{p.user_id?.email}</p>
                          </div>
                        ))}
                      {parents.filter((p: any) => {
                        const q = parentSearch.toLowerCase();
                        return p.user_id?.full_name?.toLowerCase().includes(q) || p.user_id?.email?.toLowerCase().includes(q);
                      }).length === 0 && (
                        <p className="px-4 py-3 text-sm text-muted-foreground">No parents found.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Parent/Guardian Name *</label>
                  <Input
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Parent Email *</label>
                  <Input
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    placeholder="parent@email.com"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Parent Phone *</label>
                  <Input
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-sm font-semibold mb-2 block">Emergency Contact</label>
                  <Input
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Emergency contact name and phone"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="playful-card p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-coral" />
                Medical Information (Optional)
              </h3>
              <div>
                <label className="text-sm font-semibold mb-2 block">Allergies / Medical Conditions</label>
                <textarea
                  name="medicalInfo"
                  value={formData.medicalInfo}
                  onChange={handleChange}
                  placeholder="List any allergies, medical conditions, or special needs..."
                  className="w-full min-h-[100px] rounded-xl border border-input bg-background px-4 py-3 text-sm resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link to="/portal/admin">
                <Button variant="outline" size="lg">Cancel</Button>
              </Link>
              <Button type="submit" variant="admin" size="lg" className="gap-2" disabled={registerMutation.isPending || isLoadingStudent}>
                <Save className="w-5 h-5" />
                {registerMutation.isPending ? (isEdit ? 'Updating...' : 'Registering...') : (isEdit ? 'Update Student' : 'Register Student')}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegistration;

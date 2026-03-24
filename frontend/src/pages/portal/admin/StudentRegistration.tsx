import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
  GraduationCap
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    program: "",
    grade: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    emergencyContact: "",
    medicalInfo: "",
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        full_name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        program: data.program,
        grade: data.grade,
        parent_name: data.parentName,
        parent_email: data.parentEmail,
        parent_phone: data.parentPhone,
        emergency_contact: data.emergencyContact,
        medical_info: data.medicalInfo,
      };
      const res = await api.post('/users/students', payload);
      return res.data;
    },
    onSuccess: (data) => {
      const creds = data.credentials || data;
      toast({
        title: "✅ Student Registered!",
        description: `Reg No: ${creds.reg_number} | Temp Password: ${creds.password}. Share these login details with the student.`,
      });
      navigate('/portal/admin/students');
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Could not register student. Please try again.",
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
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Link to="/login"><Button variant="ghost" size="icon"><LogOut className="w-5 h-5" /></Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back Button */}
          <Link to="/portal/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Register New Student</h2>
              <p className="text-muted-foreground">Fill in the student details below</p>
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

                <div>
                  <label className="text-sm font-semibold mb-2 block">Phone</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="h-12 rounded-xl"
                  />
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
                    <option value="nursery">Nursery (Ages 2-5)</option>
                    <option value="primary">Primary School (Ages 6-11)</option>
                    <option value="secondary">Secondary School (Ages 12-17)</option>
                    <option value="vocational">Vocational Training (Ages 16+)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Grade/Class *</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select grade</option>
                    <option value="nursery-1">Nursery 1</option>
                    <option value="nursery-2">Nursery 2</option>
                    <option value="kg-1">KG 1</option>
                    <option value="kg-2">KG 2</option>
                    <option value="grade-1">Grade 1</option>
                    <option value="grade-2">Grade 2</option>
                    <option value="grade-3">Grade 3</option>
                    <option value="grade-4">Grade 4</option>
                    <option value="grade-5">Grade 5</option>
                    <option value="grade-6">Grade 6</option>
                    <option value="grade-7">Grade 7</option>
                    <option value="grade-8">Grade 8</option>
                    <option value="grade-9">Grade 9</option>
                    <option value="grade-10">Grade 10</option>
                    <option value="grade-11">Grade 11</option>
                    <option value="grade-12">Grade 12</option>
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
              <Button type="submit" variant="admin" size="lg" className="gap-2" disabled={registerMutation.isPending}>
                <Save className="w-5 h-5" />
                {registerMutation.isPending ? 'Registering...' : 'Register Student'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegistration;

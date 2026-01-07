import { Routes, Route } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import AdminHome from './AdminHome';
import StudentsManagement from './StudentsManagement';
import TeachersManagement from './TeachersManagement';
import ClassesManagement from './ClassesManagement';

const AdminDashboard = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: GraduationCap, label: 'Teachers', path: '/admin/teachers' },
    { icon: BookOpen, label: 'Classes', path: '/admin/classes' },
    { icon: FileText, label: 'Assignments', path: '/admin/assignments' },
    { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Admin Portal">
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="students" element={<StudentsManagement />} />
        <Route path="teachers" element={<TeachersManagement />} />
        <Route path="classes" element={<ClassesManagement />} />
        <Route path="*" element={<div className="text-center py-20">Coming Soon</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;

import { Routes, Route } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Award,
  Calendar,
  MessageSquare,
  FileText,
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ParentHome from './ParentHome';

const ParentDashboard = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/parent' },
    { icon: Users, label: 'My Children', path: '/parent/children' },
    { icon: Award, label: 'Academic Progress', path: '/parent/progress' },
    { icon: Calendar, label: 'Attendance', path: '/parent/attendance' },
    { icon: FileText, label: 'Assignments', path: '/parent/assignments' },
    { icon: MessageSquare, label: 'Messages', path: '/parent/messages' },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Parent Portal">
      <Routes>
        <Route index element={<ParentHome />} />
        <Route path="*" element={<div className="text-center py-20">Coming Soon</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default ParentDashboard;

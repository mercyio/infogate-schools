import { Routes, Route } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BookOpen,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import TeacherHome from './TeacherHome';

const TeacherDashboard = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher' },
    { icon: Users, label: 'My Classes', path: '/teacher/classes' },
    { icon: ClipboardList, label: 'Attendance', path: '/teacher/attendance' },
    { icon: BookOpen, label: 'Assignments', path: '/teacher/assignments' },
    { icon: Calendar, label: 'Timetable', path: '/teacher/timetable' },
    { icon: MessageSquare, label: 'Messages', path: '/teacher/messages' },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Teacher Portal">
      <Routes>
        <Route index element={<TeacherHome />} />
        <Route path="*" element={<div className="text-center py-20">Coming Soon</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default TeacherDashboard;

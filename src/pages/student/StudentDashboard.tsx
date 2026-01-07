import { Routes, Route } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Calendar,
  Award,
  HelpCircle,
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StudentHome from './StudentHome';

const StudentDashboard = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
    { icon: BookOpen, label: 'My Assignments', path: '/student/assignments' },
    { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
    { icon: Award, label: 'My Grades', path: '/student/grades' },
    { icon: ClipboardList, label: 'Attendance', path: '/student/attendance' },
    { icon: HelpCircle, label: 'Ask Question', path: '/student/questions' },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Student Portal">
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="*" element={<div className="text-center py-20">Coming Soon</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;

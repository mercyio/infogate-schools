import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, Award } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRate: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, teachersRes, classesRes] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('teachers').select('*', { count: 'exact', head: true }),
        supabase.from('classes').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalStudents: studentsRes.count || 0,
        totalTeachers: teachersRes.count || 0,
        totalClasses: classesRes.count || 0,
        attendanceRate: 94.5,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: 'Total Students',
      value: stats.totalStudents,
      change: '+12%',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: GraduationCap,
      label: 'Total Teachers',
      value: stats.totalTeachers,
      change: '+5%',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: BookOpen,
      label: 'Total Classes',
      value: stats.totalClasses,
      change: '+8%',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: TrendingUp,
      label: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      change: '+2.5%',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  const enrollmentData = [
    { month: 'Jan', students: 450 },
    { month: 'Feb', students: 480 },
    { month: 'Mar', students: 520 },
    { month: 'Apr', students: 550 },
    { month: 'May', students: 580 },
    { month: 'Jun', students: 600 },
  ];

  const levelDistribution = [
    { name: 'Nursery', value: 120, color: '#ec4899' },
    { name: 'Primary', value: 250, color: '#3b82f6' },
    { name: 'Secondary', value: 180, color: '#10b981' },
    { name: 'Vocational', value: 50, color: '#a855f7' },
  ];

  const performanceData = [
    { subject: 'Mathematics', average: 78 },
    { subject: 'English', average: 85 },
    { subject: 'Science', average: 72 },
    { subject: 'Social Studies', average: 80 },
    { subject: 'Arts', average: 88 },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2 font-display">
          Welcome Back, Admin! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your school today
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card-playful p-6 ${stat.bgColor}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-playful p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            Student Enrollment Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card-playful p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
            <Users className="w-6 h-6 mr-2 text-purple-600" />
            Students by Level
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={levelDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {levelDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 card-playful p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
            <Award className="w-6 h-6 mr-2 text-green-600" />
            Average Performance by Subject
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="subject" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#10b981" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-playful p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-yellow-600" />
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Open Day', date: 'March 15', color: 'bg-blue-100 text-blue-600' },
              { title: 'Sports Day', date: 'March 22', color: 'bg-green-100 text-green-600' },
              { title: 'Science Fair', date: 'April 5', color: 'bg-purple-100 text-purple-600' },
            ].map((event) => (
              <div
                key={event.title}
                className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${event.color}`}>
                    Upcoming
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHome;

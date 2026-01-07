import { motion } from 'framer-motion';
import { Users, ClipboardCheck, BookOpen, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const TeacherHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingAssignments: 0,
    todayClasses: 0,
  });

  useEffect(() => {
    if (user) {
      fetchTeacherStats();
    }
  }, [user]);

  const fetchTeacherStats = async () => {
    try {
      const { data: teacher } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (teacher) {
        const [classesRes, assignmentsRes] = await Promise.all([
          supabase
            .from('class_subjects')
            .select('*', { count: 'exact' })
            .eq('teacher_id', teacher.id),
          supabase
            .from('assignments')
            .select('*', { count: 'exact' })
            .eq('teacher_id', teacher.id),
        ]);

        setStats({
          totalClasses: classesRes.count || 0,
          totalStudents: 45,
          pendingAssignments: assignmentsRes.count || 0,
          todayClasses: 4,
        });
      }
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: 'My Students',
      value: stats.totalStudents,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: BookOpen,
      label: 'My Classes',
      value: stats.totalClasses,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: ClipboardCheck,
      label: 'Active Assignments',
      value: stats.pendingAssignments,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Calendar,
      label: 'Classes Today',
      value: stats.todayClasses,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  const todaySchedule = [
    {
      time: '8:00 AM - 9:00 AM',
      subject: 'Mathematics',
      class: 'Primary 5A',
      room: 'Room 101',
    },
    {
      time: '9:30 AM - 10:30 AM',
      subject: 'Mathematics',
      class: 'Primary 5B',
      room: 'Room 101',
    },
    {
      time: '11:00 AM - 12:00 PM',
      subject: 'Mathematics',
      class: 'Primary 6',
      room: 'Room 102',
    },
    {
      time: '2:00 PM - 3:00 PM',
      subject: 'Algebra Club',
      class: 'Extra-curricular',
      room: 'Math Lab',
    },
  ];

  const recentActivities = [
    {
      action: 'New assignment submission',
      details: 'John Doe submitted "Algebra Homework"',
      time: '10 minutes ago',
      color: 'text-blue-600',
    },
    {
      action: 'Attendance marked',
      details: 'Attendance marked for Primary 5A',
      time: '2 hours ago',
      color: 'text-green-600',
    },
    {
      action: 'Grade updated',
      details: 'Updated grades for 15 students',
      time: '1 day ago',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2 font-display">
          Welcome Back, Teacher! 👋
        </h1>
        <p className="text-gray-600">
          Here's your teaching schedule and student updates for today
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
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 card-playful p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-600" />
            Today's Schedule
          </h2>
          <div className="space-y-4">
            {todaySchedule.map((schedule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-600">
                  {schedule.time}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">{schedule.subject}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {schedule.class}
                    </span>
                    <span>{schedule.room}</span>
                  </div>
                </div>
                <button className="btn-primary text-sm px-4 py-2">
                  Start Class
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="card-playful p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary justify-center"
              >
                Mark Attendance
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-secondary justify-center"
              >
                Create Assignment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-success justify-center"
              >
                Grade Submissions
              </motion.button>
            </div>
          </div>

          <div className="card-playful p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4">
                  <h3 className={`font-semibold text-sm ${activity.color}`}>
                    {activity.action}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherHome;

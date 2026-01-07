import { motion } from 'framer-motion';
import { BookOpen, Award, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const StudentHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignments: 0,
    attendance: 0,
    averageGrade: 0,
    upcomingTests: 0,
  });

  useEffect(() => {
    if (user) {
      fetchStudentStats();
    }
  }, [user]);

  const fetchStudentStats = async () => {
    try {
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (student) {
        const { count } = await supabase
          .from('assignment_submissions')
          .select('*', { count: 'exact' })
          .eq('student_id', student.id);

        setStats({
          assignments: count || 0,
          attendance: 95,
          averageGrade: 85,
          upcomingTests: 3,
        });
      }
    } catch (error) {
      console.error('Error fetching student stats:', error);
    }
  };

  const statCards = [
    {
      icon: BookOpen,
      label: 'Assignments',
      value: stats.assignments,
      subtitle: '2 pending',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Average Grade',
      value: `${stats.averageGrade}%`,
      subtitle: 'Great work!',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Calendar,
      label: 'Attendance',
      value: `${stats.attendance}%`,
      subtitle: 'Excellent',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: AlertCircle,
      label: 'Upcoming Tests',
      value: stats.upcomingTests,
      subtitle: 'This week',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  const todayClasses = [
    { time: '8:00 AM', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101' },
    { time: '10:00 AM', subject: 'English', teacher: 'Mrs. Smith', room: 'Room 205' },
    { time: '12:00 PM', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 3' },
    { time: '2:00 PM', subject: 'Arts', teacher: 'Ms. Davis', room: 'Art Studio' },
  ];

  const assignments = [
    {
      subject: 'Mathematics',
      title: 'Algebra Worksheet',
      dueDate: 'Tomorrow',
      status: 'pending',
      color: 'text-red-600 bg-red-50',
    },
    {
      subject: 'English',
      title: 'Essay Writing',
      dueDate: 'In 3 days',
      status: 'in-progress',
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      subject: 'Science',
      title: 'Lab Report',
      dueDate: 'Next week',
      status: 'not-started',
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  const achievements = [
    { title: 'Perfect Attendance', icon: Star, color: 'text-yellow-500' },
    { title: 'Top Performer', icon: Award, color: 'text-purple-500' },
    { title: 'Math Wizard', icon: TrendingUp, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2 font-display">
          Welcome Back! 🎒
        </h1>
        <p className="text-gray-600">
          Let's make today a great learning day!
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
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>
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
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Today's Classes
          </h2>
          <div className="space-y-4">
            {todayClasses.map((cls, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-600">
                  {cls.time}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{cls.subject}</h3>
                  <p className="text-sm text-gray-600">
                    {cls.teacher} • {cls.room}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
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
          <div className="card-playful p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-display flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-600" />
              My Achievements
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-white rounded-xl"
                  >
                    <Icon className={`w-6 h-6 ${achievement.color}`} />
                    <span className="font-medium text-gray-800">{achievement.title}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="card-playful p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-display flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Quick Links
            </h2>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary justify-center text-sm"
              >
                View Timetable
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-secondary justify-center text-sm"
              >
                Submit Assignment
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-success justify-center text-sm"
              >
                Ask Teacher
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-playful p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-green-600" />
          Pending Assignments
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {assignments.map((assignment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-5 bg-gray-50 rounded-2xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">{assignment.subject}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${assignment.color}`}>
                  {assignment.dueDate}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 mb-3">{assignment.title}</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium"
              >
                Start Working
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentHome;

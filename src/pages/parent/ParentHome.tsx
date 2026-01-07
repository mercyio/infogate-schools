import { motion } from 'framer-motion';
import {
  Users,
  Award,
  Calendar,
  TrendingUp,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Bell,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ParentHome = () => {
  const children = [
    {
      name: 'Sarah Johnson',
      class: 'Primary 5A',
      attendance: 96,
      avgGrade: 88,
      pendingAssignments: 2,
    },
    {
      name: 'Michael Johnson',
      class: 'Primary 3B',
      attendance: 94,
      avgGrade: 85,
      pendingAssignments: 1,
    },
  ];

  const performanceData = [
    { month: 'Jan', sarah: 85, michael: 82 },
    { month: 'Feb', sarah: 87, michael: 84 },
    { month: 'Mar', sarah: 88, michael: 85 },
    { month: 'Apr', sarah: 86, michael: 83 },
    { month: 'May', sarah: 90, michael: 87 },
  ];

  const attendanceData = [
    { month: 'Jan', sarah: 95, michael: 93 },
    { month: 'Feb', sarah: 96, michael: 95 },
    { month: 'Mar', sarah: 94, michael: 92 },
    { month: 'Apr', sarah: 97, michael: 96 },
    { month: 'May', sarah: 96, michael: 94 },
  ];

  const recentActivities = [
    {
      child: 'Sarah',
      activity: 'Submitted Mathematics assignment',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      child: 'Michael',
      activity: 'Excellent grade on Science test',
      time: '1 day ago',
      icon: Award,
      color: 'text-blue-600',
    },
    {
      child: 'Sarah',
      activity: 'Upcoming English test on Friday',
      time: '2 days ago',
      icon: AlertCircle,
      color: 'text-yellow-600',
    },
  ];

  const upcomingEvents = [
    {
      title: 'Parent-Teacher Meeting',
      date: 'April 19, 2024',
      time: '2:00 PM',
      type: 'Meeting',
    },
    {
      title: 'Sports Day',
      date: 'March 22, 2024',
      time: '8:00 AM',
      type: 'Event',
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2 font-display">
          Welcome to Parent Portal! 👨‍👩‍👧‍👦
        </h1>
        <p className="text-gray-600">
          Track your children's academic progress and school activities
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {children.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-playful p-6 bg-gradient-to-br from-blue-50 to-purple-50"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 font-display">
                  {child.name}
                </h2>
                <p className="text-gray-600">{child.class}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl text-center">
                <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{child.attendance}%</p>
                <p className="text-xs text-gray-600">Attendance</p>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center">
                <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{child.avgGrade}%</p>
                <p className="text-xs text-gray-600">Avg Grade</p>
              </div>
              <div className="bg-white p-4 rounded-2xl text-center">
                <BookOpen className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{child.pendingAssignments}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 btn-primary"
            >
              View Full Report
            </motion.button>
          </motion.div>
        ))}
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
            Academic Performance Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sarah"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Sarah"
              />
              <Line
                type="monotone"
                dataKey="michael"
                stroke="#10b981"
                strokeWidth={3}
                name="Michael"
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
            <Calendar className="w-6 h-6 mr-2 text-green-600" />
            Attendance Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="sarah" fill="#3b82f6" name="Sarah" />
              <Bar dataKey="michael" fill="#10b981" name="Michael" />
            </BarChart>
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
            <Bell className="w-6 h-6 mr-2 text-purple-600" />
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <Icon className={`w-6 h-6 ${activity.color} flex-shrink-0 mt-1`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">{activity.child}</h3>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.activity}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-playful p-6 bg-gradient-to-br from-yellow-50 to-orange-50"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display">
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-2xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {event.type}
                  </span>
                  <span className="text-xs text-gray-500">{event.date}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.time}</p>
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 btn-secondary"
          >
            View All Events
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentHome;

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const EventsPage = () => {
  const upcomingEvents = [
    {
      title: 'Open Day 2024',
      date: 'March 15, 2024',
      time: '9:00 AM - 3:00 PM',
      location: 'Main Campus',
      description: 'Visit our campus, meet our teachers, and see our facilities in action!',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Sports Day',
      date: 'March 22, 2024',
      time: '8:00 AM - 4:00 PM',
      location: 'School Sports Ground',
      description: 'Annual inter-house sports competition with exciting games and activities',
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Science Fair',
      date: 'April 5, 2024',
      time: '10:00 AM - 2:00 PM',
      location: 'Science Block',
      description: 'Students showcase their innovative science projects and experiments',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Cultural Day',
      date: 'April 12, 2024',
      time: '9:00 AM - 3:00 PM',
      location: 'School Hall',
      description: 'Celebrating Nigerian culture with music, dance, food, and traditional wear',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      title: 'Parent-Teacher Meeting',
      date: 'April 19, 2024',
      time: '2:00 PM - 6:00 PM',
      location: 'Classrooms',
      description: 'Discuss your child\'s progress and development with their teachers',
      color: 'from-pink-400 to-pink-600',
    },
    {
      title: 'End of Term Concert',
      date: 'May 3, 2024',
      time: '5:00 PM - 8:00 PM',
      location: 'School Auditorium',
      description: 'Musical performances, drama, and talent show by our students',
      color: 'from-indigo-400 to-indigo-600',
    },
  ];

  const announcements = [
    {
      title: 'New Academic Year Registration',
      content: 'Registration for the 2024/2025 academic year is now open. Early registration gets 10% discount!',
      date: 'February 10, 2024',
    },
    {
      title: 'Holiday Notice',
      content: 'School will be closed for mid-term break from March 25-29. Resumption on April 1st.',
      date: 'February 15, 2024',
    },
    {
      title: 'New Vocational Courses',
      content: 'We are introducing new vocational courses in Digital Marketing and Graphic Design!',
      date: 'February 20, 2024',
    },
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-display">
            Events & News
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with exciting happenings and important announcements at Infogate Schools
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 font-display">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-playful overflow-hidden"
              >
                <div className={`h-3 bg-gradient-to-r ${event.color}`} />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 font-display">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{event.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Clock className="w-5 h-5 text-green-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 font-display">
            Latest Announcements
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-playful p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 font-display">
                    {announcement.title}
                  </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {announcement.date}
                  </span>
                </div>
                <p className="text-gray-600">{announcement.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 card-playful p-12 bg-gradient-to-r from-blue-50 to-purple-50 text-center"
        >
          <Users className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-display">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Be the first to know about upcoming events, important announcements, and exciting news from Infogate Schools
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-8 py-4"
          >
            Subscribe to Updates
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default EventsPage;

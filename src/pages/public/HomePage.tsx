import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Rocket, Heart, Star, Sparkles, GraduationCap } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Quality Education',
      description: 'Comprehensive curriculum from nursery to vocational training',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Users,
      title: 'Expert Teachers',
      description: 'Qualified and caring educators dedicated to your child',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Award-winning academic and extracurricular programs',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      icon: Rocket,
      title: 'Innovation',
      description: 'Modern facilities and cutting-edge learning methods',
      color: 'from-purple-400 to-purple-600',
    },
  ];

  const levels = [
    { name: 'Nursery', icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { name: 'Primary', icon: Star, color: 'bg-blue-100 text-blue-600' },
    { name: 'Secondary', icon: GraduationCap, color: 'bg-green-100 text-green-600' },
    { name: 'Vocational', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div>
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-display">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Infogate Schools
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Where every child's potential is nurtured and dreams take flight!
                Join us on an exciting journey of learning, growth, and discovery.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/admissions">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Apply Now
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-[3rem] overflow-hidden shadow-2xl">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-10 left-10 bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center"
                >
                  <Star className="w-10 h-10 text-white" fill="currentColor" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-10 right-10 bg-blue-500 w-24 h-24 rounded-full flex items-center justify-center"
                >
                  <Rocket className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32"
                >
                  <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-white" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full filter blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 -z-10" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-display">
              Why Choose Infogate Schools?
            </h2>
            <p className="text-xl text-gray-600">
              We provide a nurturing environment where children thrive
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="card-playful p-6 text-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-display">
              Our School Levels
            </h2>
            <p className="text-xl text-gray-600">
              Education for every stage of your child's journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level, index) => {
              const Icon = level.icon;
              return (
                <motion.div
                  key={level.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="card-playful p-8 text-center cursor-pointer"
                >
                  <div className={`inline-flex p-6 rounded-3xl ${level.color} mb-4`}>
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 font-display">
                    {level.name}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-playful p-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-display">
              Ready to Join Our Family?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start your child's journey with us today. We're here to help every step of the way!
            </p>
            <Link to="/admissions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4"
              >
                Begin Application
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

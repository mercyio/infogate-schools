import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Care',
      description: 'We care deeply about every child and their unique journey',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a strong, supportive learning community',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Striving for excellence in everything we do',
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
            About Infogate Schools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A place where children discover their potential and build the foundation for a bright future
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card-playful p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 ml-4 font-display">Our Vision</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              To be the leading educational institution that nurtures young minds, fostering creativity,
              critical thinking, and character development. We envision a future where every child from
              our school becomes a confident, compassionate, and competent individual ready to make a
              positive impact on society.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card-playful p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 ml-4 font-display">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              To provide quality, comprehensive education from nursery through vocational training,
              creating a safe, stimulating environment where children develop academically, socially,
              and emotionally. We are committed to excellence in teaching, innovative learning
              approaches, and building strong partnerships with families and communities.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 font-display">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="card-playful p-8 text-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 mb-4"
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 font-display">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-playful p-12 bg-gradient-to-r from-blue-50 to-green-50"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 font-display">
            Our Story
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              Infogate Schools was founded with a simple yet powerful vision: to create an educational
              environment where every child can thrive and reach their full potential. Since our
              inception, we have been dedicated to providing quality education that goes beyond
              textbooks and examinations.
            </p>
            <p>
              Our comprehensive approach spans from nursery to vocational training, ensuring that
              students receive continuous, quality education throughout their formative years. We
              believe in nurturing not just academic excellence, but also character, creativity, and
              critical thinking skills.
            </p>
            <p>
              Today, Infogate Schools stands as a beacon of educational excellence, with state-of-the-art
              facilities, dedicated teachers, and a vibrant community of learners. We continue to
              innovate and adapt our teaching methods to meet the needs of the 21st-century learner
              while maintaining our core values of care, excellence, and community.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;

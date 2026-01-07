import { motion } from 'framer-motion';
import { CheckCircle, FileText, Users, Calendar, Phone, Mail } from 'lucide-react';

const AdmissionsPage = () => {
  const steps = [
    {
      icon: FileText,
      title: 'Submit Application',
      description: 'Fill out and submit the admission form with required documents',
    },
    {
      icon: Users,
      title: 'School Visit',
      description: 'Schedule a visit to tour our facilities and meet our staff',
    },
    {
      icon: CheckCircle,
      title: 'Assessment',
      description: 'Child participates in age-appropriate assessment activities',
    },
    {
      icon: Calendar,
      title: 'Enrollment',
      description: 'Receive admission decision and complete enrollment process',
    },
  ];

  const requirements = [
    'Birth certificate or age declaration',
    'Previous school records (if applicable)',
    'Passport photographs (student and parents)',
    'Medical fitness certificate',
    'Proof of residence',
    'Parent/Guardian identification',
  ];

  const levels = [
    {
      name: 'Nursery',
      ageRange: '2-4 years',
      description: 'Foundation for learning through play and exploration',
      color: 'from-pink-400 to-pink-600',
    },
    {
      name: 'Primary',
      ageRange: '5-11 years',
      description: 'Building strong academic fundamentals and life skills',
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Secondary',
      ageRange: '12-17 years',
      description: 'Comprehensive education preparing for higher learning',
      color: 'from-green-400 to-green-600',
    },
    {
      name: 'Vocational',
      ageRange: '16+ years',
      description: 'Practical skills training for career readiness',
      color: 'from-purple-400 to-purple-600',
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
            Admissions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join the Infogate Schools family! We're excited to welcome your child to our learning community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 font-display">
            Admission Process
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-playful p-6 relative"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-green-100 p-4 rounded-2xl inline-flex mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-playful p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 font-display">
              Required Documents
            </h2>
            <ul className="space-y-4">
              {requirements.map((req, index) => (
                <motion.li
                  key={req}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{req}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-playful p-8 bg-gradient-to-br from-blue-50 to-green-50"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 font-display">
              Important Dates
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Admission Opens</h3>
                <p className="text-gray-600">January 2nd - Continuous throughout the year</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Academic Year</h3>
                <p className="text-gray-600">September - July (Three Terms)</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">School Tours</h3>
                <p className="text-gray-600">Available every weekday by appointment</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 font-display">
            Our School Levels
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {levels.map((level, index) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-playful p-8"
              >
                <div className={`inline-flex px-6 py-2 rounded-full bg-gradient-to-r ${level.color} text-white font-semibold mb-4`}>
                  {level.ageRange}
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3 font-display">
                  {level.name}
                </h3>
                <p className="text-gray-600 text-lg">{level.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-playful p-12 bg-gradient-to-r from-blue-600 to-green-600 text-white text-center"
        >
          <h2 className="text-4xl font-bold mb-6 font-display">
            Ready to Apply?
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            Contact us today to start your child's journey with Infogate Schools
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center space-x-3 bg-white/20 px-6 py-3 rounded-full">
              <Phone className="w-5 h-5" />
              <span>+234 800 123 4567</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/20 px-6 py-3 rounded-full">
              <Mail className="w-5 h-5" />
              <span>admissions@infogateschools.edu</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdmissionsPage;

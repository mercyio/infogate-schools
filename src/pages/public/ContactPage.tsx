import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+234 800 123 4567',
      subContent: '+234 800 123 4568',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@infogateschools.edu',
      subContent: 'admissions@infogateschools.edu',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Education Avenue',
      subContent: 'Lagos, Nigeria',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Monday - Friday: 8:00 AM - 4:00 PM',
      subContent: 'Saturday: 9:00 AM - 2:00 PM',
      color: 'from-yellow-400 to-orange-500',
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
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We'd love to hear from you! Get in touch with us for any questions or inquiries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-playful p-6 text-center"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${info.color} mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-sm">{info.content}</p>
                <p className="text-gray-600 text-sm">{info.subContent}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card-playful p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 font-display">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-playful"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-playful"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-playful"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-playful"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-playful resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="card-playful p-8 bg-gradient-to-br from-blue-50 to-green-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-display">
                Visit Our Campus
              </h3>
              <p className="text-gray-600 mb-6">
                Schedule a tour of our facilities and see firsthand the nurturing environment
                where your child will learn and grow. Our friendly staff will be happy to show
                you around and answer all your questions.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Schedule a Tour
              </motion.button>
            </div>

            <div className="card-playful p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-display">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    What are your admission requirements?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Visit our Admissions page for detailed information about requirements
                    and the application process.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Do you offer transportation?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Yes, we provide safe and reliable school bus services covering
                    various routes across Lagos.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    What is your student-teacher ratio?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We maintain a ratio of 15:1 to ensure personalized attention for
                    each student.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-playful p-8 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-display">
                Emergency Contact
              </h3>
              <p className="text-gray-600 mb-4">
                For urgent matters during school hours, please contact our emergency line:
              </p>
              <div className="bg-white p-4 rounded-2xl border-2 border-red-200">
                <p className="text-red-600 font-bold text-xl">+234 800 999 8888</p>
                <p className="text-gray-600 text-sm">Available 24/7</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

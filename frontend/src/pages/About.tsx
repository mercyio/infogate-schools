import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Heart,
  Target,
  Eye,
  Users,
  Award,
  BookOpen,
  Palette,
  Music,
  Dumbbell,
  FlaskConical,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import teacherClass from "@/assets/teacher-class.png";
import kidsLearning from "@/assets/kids-learning.png";
import kidsArt from "@/assets/kids-art.png";

const values = [
  {
    icon: Heart,
    title: "Nurturing Care",
    description: "Every child is treated with love, respect, and individual attention.",
  },
  {
    icon: Star,
    title: "Excellence",
    description: "We strive for the highest standards in education and character development.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building strong relationships between students, parents, and educators.",
  },
  {
    icon: Award,
    title: "Innovation",
    description: "Embracing modern teaching methods while honoring timeless values.",
  },
];

const curriculum = [
  { icon: BookOpen, name: "Language & Literacy", color: "bg-primary" },
  { icon: FlaskConical, name: "Science & Discovery", color: "bg-secondary" },
  { icon: Palette, name: "Arts & Creativity", color: "bg-pink" },
  { icon: Music, name: "Music & Movement", color: "bg-lavender" },
  { icon: Dumbbell, name: "Physical Education", color: "bg-coral" },
  { icon: Users, name: "Social Skills", color: "bg-accent" },
];

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-muted/30">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-6">
              <GraduationCap className="w-4 h-4" />
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Building Bright Futures, One Child at a Time
            </h1>
            <p className="text-lg text-muted-foreground">
              For over 25 years, Infogate Schools has been a beacon of educational excellence, 
              nurturing young minds from their first steps to their career dreams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="playful-card p-8 bg-gradient-to-br from-primary/5 to-primary/10"
            >
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be a leading educational institution that inspires lifelong learning, 
                cultivates creativity, and empowers every student to reach their full potential 
                while becoming responsible global citizens.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="playful-card p-8 bg-gradient-to-br from-secondary/5 to-secondary/10"
            >
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide a nurturing, inclusive, and stimulating learning environment where 
                children develop academically, socially, and emotionally through innovative 
                teaching methods and a comprehensive curriculum.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-6">
                A Journey of Love and Learning
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Infogate Schools was founded in 1999 by a group of passionate educators 
                  who believed that every child deserves access to quality education in a 
                  loving environment.
                </p>
                <p>
                  What started as a small nursery with 15 students has grown into a 
                  comprehensive educational institution serving over 500 students from 
                  nursery through vocational training.
                </p>
                <p>
                  Our growth is a testament to our unwavering commitment to excellence, 
                  our innovative approach to education, and the trust that families have 
                  placed in us over the years.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="font-semibold">Accredited Institution</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="font-semibold">Award-Winning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="font-semibold">Community Focused</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={teacherClass}
                alt="Teacher with students"
                className="rounded-3xl shadow-float w-full"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-accent rounded-2xl p-4 shadow-lg"
              >
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-accent-foreground">25+</p>
                  <p className="text-sm font-semibold text-accent-foreground/80">Years</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold">What We Believe</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Our Core Values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="playful-card p-6 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {curriculum.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="playful-card p-4 text-center cursor-pointer"
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className="w-6 h-6 text-card" />
                    </div>
                    <p className="text-sm font-semibold">{item.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-primary font-semibold">What We Teach</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-6">
                A Holistic Curriculum
              </h2>
              <p className="text-muted-foreground mb-6">
                Our curriculum is designed to develop the whole child—mind, body, and spirit. 
                We combine rigorous academics with creative arts, physical education, and 
                character development.
              </p>
              <ul className="space-y-3">
                {[
                  "Age-appropriate learning activities",
                  "Hands-on experiential education",
                  "Technology integration for digital literacy",
                  "Character education and social-emotional learning",
                  "Regular assessments and progress tracking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              Meet Our Amazing Educators
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our teachers are passionate, qualified, and dedicated to bringing out the best in every child.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="playful-card overflow-hidden"
            >
              <img src={teacherClass} alt="Teacher" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-lg">Mrs. Sarah Johnson</h3>
                <p className="text-primary text-sm">Principal</p>
                <p className="text-muted-foreground text-sm mt-2">
                  20+ years of experience in early childhood education
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="playful-card overflow-hidden"
            >
              <img src={kidsLearning} alt="Teacher with kids" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-lg">Mr. David Chen</h3>
                <p className="text-primary text-sm">Head of Primary</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Specialist in innovative teaching methods
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="playful-card overflow-hidden"
            >
              <img src={kidsArt} alt="Art class" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-lg">Ms. Emily Rodriguez</h3>
                <p className="text-primary text-sm">Arts Coordinator</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Award-winning artist and educator
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              Ready to Experience Infogate Schools?
            </h2>
            <p className="text-muted-foreground mb-8">
              Schedule a visit to see our campus, meet our teachers, and discover 
              why families choose us for their children's education.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Schedule a Visit
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/admissions">
                <Button variant="outline" size="lg">
                  View Admissions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

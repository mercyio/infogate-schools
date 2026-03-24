import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TestimonialsSection from "./testimonial";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Heart, 
  Palette, 
  Music,
  ArrowRight,
  GraduationCap,
  Baby,
  School,
  Briefcase
} from "lucide-react";
import heroSchool from "@/assets/hero-school.png";
import kidsLearning from "@/assets/kids-learning.png";
import teacherClass from "@/assets/teacher-class.png";
import kidsArt from "@/assets/kids-art.png";

const programs = [
  {
    icon: Baby,
    title: "Nursery",
    ages: "Ages 2-5",
    description: "A warm, nurturing environment where little ones take their first steps into learning through play.",
    color: "bg-pink",
  },
  {
    image: "/infogate-school-badge.svg",
    title: "Primary School",
    ages: "Ages 6-11",
    description: "Building strong foundations in literacy, numeracy, and creative thinking.",
  },
  {
    image: "/infogate-college-badge.svg",
    title: "Secondary School",
    ages: "Ages 12-17",
    description: "Preparing young minds for the future with comprehensive academic programs.",
  },
  {
    image: "/infogate-vocational-badge.svg",
    title: "Vocational Training",
    ages: "Ages 16+",
    description: "Hands-on skills training for real-world careers and professional success.",
  },
];

const features = [
  {
    icon: Heart,
    title: "Caring Environment",
    description: "Our teachers create a loving, supportive space where every child feels valued.",
  },
  {
    icon: Palette,
    title: "Creative Learning",
    description: "Art, music, and drama are woven into our curriculum to spark imagination.",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description: "Individual attention ensures no child is left behind in their learning journey.",
  },
  {
    icon: Music,
    title: "Extracurricular Activities",
    description: "Sports, clubs, and activities that develop well-rounded individuals.",
  },
];

const stats = [
  { value: "500+", label: "Happy Students" },
  { value: "50+", label: "Expert Teachers" },
  { value: "25+", label: "Years Experience" },
  { value: "98%", label: "Parent Satisfaction" },
];

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold text-accent-foreground">Welcome to Infogate Schools</span>
              </div> */}
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Where Little <span className="text-primary">Dreamers</span> Become 
                <span className="text-secondary"> Big Achievers</span>
                <span className="wave-hand ml-2">👋</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                From nursery to vocational training, we nurture curiosity, creativity, and 
                confidence in every child. Join our family of learners today!
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/admissions">
                  <Button variant="hero" size="xl" className="group">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="xl">
                    Learn More
                  </Button>
                </Link>
              </div>


            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src={heroSchool}
                  alt="Happy children at Sunshine Academy"
                  className="w-full rounded-3xl shadow-float"
                />
              </div>
              {/* Floating decorations */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              Learning Paths for Every Age
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              From tiny tots to young professionals, we have a program designed for every stage of growth.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="playful-card p-6 cursor-pointer group"
              >
                {program.icon ? (
                  <div className={`w-14 h-14 ${program.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <program.icon className="w-7 h-7 text-card" />
                  </div>
                ) : (
                  <div className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform">
                    <img src={program.image} alt={program.title} className="w-full h-full object-contain" />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{program.title}</h3>
                <span className="text-sm text-primary font-semibold">{program.ages}</span>
                <p className="text-muted-foreground mt-3 text-sm">{program.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src={kidsLearning}
                alt="Kids learning together"
                className="rounded-2xl shadow-card"
              />
              <img
                src={teacherClass}
                alt="Teacher with students"
                className="rounded-2xl shadow-card mt-8"
              />
              <img
                src={kidsArt}
                alt="Kids doing art"
                className="rounded-2xl shadow-card -mt-8"
              />
             <img
                src={kidsLearning}
                alt="Kids learning together"
                className="rounded-2xl shadow-card"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold">
                A Place Where Children Love to Learn
              </h2>
              <p className="text-muted-foreground">
                At Infogate Schools, we believe every child is unique. Our approach combines 
                academic excellence with emotional development, creating confident learners 
                ready to take on the world.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-muted/50 rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-20 pt-0 gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden p-8 sm:p-12 lg:p-16"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground mb-4">
                  Ready to Join Our Family?
                </h2>
                <p className="text-primary-foreground/80 max-w-xl">
                  Begin your child's incredible learning journey at Infogate Schools. 
                  Limited spots available for the upcoming academic year!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/admissions">
                  <Button variant="warm" size="xl">
                    Apply Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="border-primary-foreground text-primary-foreground bg-primary-foreground text-primary"
                  >
                    Schedule a Visit
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              Upcoming Events
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                date: "Jan 15",
                title: "Open House Day",
                description: "Tour our campus and meet our amazing teachers!",
                color: "bg-primary",
              },
              {
                date: "Jan 22",
                title: "Art Exhibition",
                description: "Showcasing the creative works of our talented students.",
                color: "bg-secondary",
              },
              {
                date: "Feb 1",
                title: "Science Fair",
                description: "Young scientists present their exciting discoveries.",
                color: "bg-accent",
              },
            ].map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="playful-card p-6 flex gap-4"
              >
                <div className={`w-16 h-16 ${event.color} rounded-2xl flex flex-col items-center justify-center text-card shrink-0`}>
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs font-bold mt-1">{event.date}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

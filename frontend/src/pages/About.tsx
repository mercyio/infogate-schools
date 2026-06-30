import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap, Heart, Target, Eye, Users, Award,
  BookOpen, Palette, Music, Dumbbell, FlaskConical,
  ArrowRight, CheckCircle2,
} from "lucide-react";
import teacherClass from "@/assets/teacher-class.png";
import kidsLearning from "@/assets/kids-learning.png";
import kidsArt from "@/assets/kids-art.png";
import heroSchool from "@/assets/hero-school.png";

const values = [
  { emoji: "❤️", title: "Nurturing Care", description: "Every child is treated with love, respect, and individual attention.", color: "from-rose-400 to-pink-500" },
  { emoji: "⭐", title: "Excellence", description: "We strive for the highest standards in education and character development.", color: "from-amber-400 to-orange-500" },
  { emoji: "🤝", title: "Community", description: "Building strong relationships between students, parents, and educators.", color: "from-sky-400 to-blue-500" },
  { emoji: "💡", title: "Innovation", description: "Embracing modern teaching methods while honoring timeless values.", color: "from-violet-400 to-purple-500" },
];

const curriculum = [
  { icon: BookOpen, name: "Language & Literacy", color: "bg-blue-500" },
  { icon: FlaskConical, name: "Science & Discovery", color: "bg-emerald-500" },
  { icon: Palette, name: "Arts & Creativity", color: "bg-pink-500" },
  { icon: Music, name: "Music & Movement", color: "bg-violet-500" },
  { icon: Dumbbell, name: "Physical Education", color: "bg-orange-500" },
  { icon: Users, name: "Social Skills", color: "bg-sky-500" },
];

const team = [
  { img: teacherClass, name: "Mrs. Sarah Johnson", role: "Principal", bio: "A passionate leader with decades of experience shaping young minds and building a thriving school community." },
  { img: kidsLearning, name: "Mr. David Chen", role: "Head of Primary", bio: "A dedicated educator who brings energy, creativity, and innovation into every classroom he leads." },
  { img: kidsArt, name: "Ms. Emily Rodriguez", role: "Arts Coordinator", bio: "An award-winning artist and educator who believes creativity is the heart of every child's learning journey." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const About = () => {
  return (
    <div className="overflow-hidden">

      {/* ── PAGE HERO ── */}
      <section className="relative bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] text-white py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/20 rounded-full text-white font-semibold text-sm mb-6">
              <GraduationCap className="w-4 h-4" />
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              Building Bright Futures,{" "}
              <span className="text-yellow-300">One Child at a Time</span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
              Infogate Schools has been a beacon of educational excellence — nurturing young minds,
              building character, and shaping confident individuals ready for the world.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50 L0 25 Q720 0 1440 25 L1440 50 Z" fill="#eef2ff"/>
          </svg>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-3">
              Our Purpose
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Vision & Mission</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl bg-gradient-to-br from-primary via-[#1a5276] to-[#0a2342] text-white p-10 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }} />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/15 border border-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold mb-4">Our Vision</h2>
                <p className="text-white/75 leading-relaxed text-base">
                  To be a leading educational institution that inspires lifelong learning,
                  cultivates creativity, and empowers every student to reach their full potential
                  while becoming responsible global citizens.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl bg-gradient-to-br from-sky-500 to-blue-700 text-white p-10 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }} />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/15 border border-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold mb-4">Our Mission</h2>
                <p className="text-white/75 leading-relaxed text-base">
                  To provide a nurturing, inclusive, and stimulating learning environment where
                  children develop academically, socially, and emotionally through innovative
                  teaching methods and a comprehensive curriculum.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Image grid */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={kidsLearning} alt="Kids learning" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
              <img src={teacherClass} alt="Teacher" className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8" />
              <img src={kidsArt} alt="Kids art" className="rounded-2xl shadow-lg w-full h-48 object-cover -mt-8" />
              <img src={heroSchool} alt="School" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-snug">
                A Journey of <span className="text-primary">Love and Learning</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Infogate Schools was founded by a group of passionate educators who believed
                  every child deserves access to quality education in a loving, supportive environment.
                </p>
                <p>
                  What started as a small nursery has grown into a comprehensive educational
                  institution serving hundreds of students from nursery through secondary school —
                  right here in the heart of our community.
                </p>
                <p>
                  Our growth is a testament to our unwavering commitment to excellence,
                  our innovative approach to learning, and the trust families have placed in us year after year.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                {["Accredited Institution", "Award-Winning School", "Community Focused"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold text-sm text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-20 bg-sky-100">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-3">
              What We Believe
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Core Values</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              These principles guide everything we do — from how we teach to how we care for every child.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-3xl border-2 border-border bg-white p-6 text-center shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-4 text-2xl shadow-md`}>
                  {value.emoji}
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-primary via-[#1a5276] to-[#0a2342] text-white overflow-hidden p-10 sm:p-14"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/10 rounded-full" />
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }} />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-white/15 text-white text-sm font-bold rounded-full mb-4">
                  What We Teach
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-snug">
                  A Holistic Curriculum
                </h2>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Our curriculum develops the whole child — mind, body, and spirit. We combine
                  rigorous academics with creative arts, physical education, and character development.
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
                      <CheckCircle2 className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                      <span className="text-white/75">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {curriculum.map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center cursor-pointer hover:bg-white/15 transition-all"
                  >
                    <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-white/85 leading-snug">{item.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-3">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Meet Our Educators</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Passionate, qualified, and dedicated to bringing out the best in every child.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white border-2 border-border overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative">
                  <img src={member.img} alt={member.name} className="w-full h-52 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-lg text-gray-900">{member.name}</h3>
                  <span className="inline-block mt-1 px-3 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">{member.role}</span>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-primary via-[#1a5276] to-[#0a2342] text-white overflow-hidden p-10 sm:p-16 text-center"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/10 rounded-full" />
            </div>
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }} />
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="text-4xl mb-4">🏫</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Ready to Experience Infogate Schools?
              </h2>
              <p className="text-white/75 mb-8 leading-relaxed">
                Schedule a visit to see our campus, meet our teachers, and discover
                why families choose us for their children's education.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-lg">
                    Schedule a Visit <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/admissions">
                  <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold">
                    View Admissions
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;

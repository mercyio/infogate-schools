import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TestimonialsSection from "./testimonial";
import {
  BookOpen, Users, Calendar, Heart, Palette, Music,
  ArrowRight, Star, Phone, Mail, MapPin,
} from "lucide-react";
import heroSchool from "@/assets/hero-school.png";
import kidsLearning from "@/assets/kids-learning.png";
import teacherClass from "@/assets/teacher-class.png";
import kidsArt from "@/assets/kids-art.png";

const programs = [
  {
    emoji: "🌱",
    title: "Preparatory / KG",
    ages: "Ages 2–5",
    description: "A warm, playful start where little ones learn through stories, songs, and discovery.",
    bg: "from-pink-400 to-rose-500",
    light: "bg-pink-50",
    border: "border-pink-200",
  },
  {
    emoji: "📚",
    title: "Nursery",
    ages: "Ages 3–5",
    description: "Building early literacy and numeracy skills with fun hands-on activities.",
    bg: "from-violet-400 to-purple-600",
    light: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    emoji: "🎒",
    title: "Primary School",
    ages: "Ages 6–11",
    description: "Strong academic foundations in literacy, numeracy, science, and the arts.",
    bg: "from-sky-400 to-blue-600",
    light: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    emoji: "🎓",
    title: "Secondary School",
    ages: "Ages 12–17",
    description: "Comprehensive programs that prepare young minds for examinations and beyond.",
    bg: "from-emerald-400 to-green-600",
    light: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

const whyUs = [
  { icon: Heart, title: "Caring Educators", desc: "Teachers who know every child by name and nurture their unique potential.", color: "text-rose-500 bg-rose-50" },
  { icon: Palette, title: "Creative Curriculum", desc: "Art, music, and drama woven into everyday learning to spark imagination.", color: "text-violet-500 bg-violet-50" },
  { icon: Users, title: "Small Class Sizes", desc: "Individual attention so no child is ever left behind.", color: "text-sky-500 bg-sky-50" },
  { icon: Music, title: "Rich Activities", desc: "Sports, clubs, debate, and more to develop confident, well-rounded individuals.", color: "text-emerald-500 bg-emerald-50" },
  { icon: BookOpen, title: "Modern Facilities", desc: "Safe, stimulating classrooms equipped for 21st-century learning.", color: "text-amber-500 bg-amber-50" },
  { icon: Star, title: "Proven Results", desc: "Years of academic excellence with outstanding student outcomes.", color: "text-orange-500 bg-orange-50" },
];

const highlights = [
  { emoji: "🛡️", label: "Safe Environment", desc: "A secure, welcoming space for every child" },
  { emoji: "🎓", label: "Certified Teachers", desc: "Qualified, passionate educators" },
  { emoji: "🎨", label: "Holistic Growth", desc: "Academics, arts, sports & more" },
  { emoji: "❤️", label: "Caring Community", desc: "Where every child is known & valued" },
];

const events = [
  { date: "Jan 15", month: "JAN", title: "Open House Day", desc: "Tour our campus and meet our amazing teachers!", color: "bg-primary" },
  { date: "Jan 22", month: "JAN", title: "Art Exhibition", desc: "Showcasing the creative works of our talented students.", color: "bg-secondary" },
  { date: "Feb 1", month: "FEB", title: "Science Fair", desc: "Young scientists present their exciting discoveries.", color: "bg-accent" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Home = () => {
  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] text-white overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          {/* Dots pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
        </div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Where Little{" "}
                <span className="text-sky-300">Dreamers</span>{" "}
                Become{" "}
                <span className="relative">
                  <span className="text-yellow-300">Big Achievers</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8 Q75 2 150 8 Q225 14 298 8" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  </svg>
                </span>{" "}
                <span className="wave-hand">🌟🌟🌟</span>
              </h1>

              <p className="text-lg text-white/75 max-w-lg leading-relaxed">
                From Preparatory to Secondary, we nurture curiosity, creativity, and confidence in every child.
                Join our family of learners in Mafoluku, Oshodi today.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/admissions">
                  <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-lg shadow-yellow-400/30 group">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm font-semibold">
                    Learn More
                  </Button>
                </Link>
              </div>


            </motion.div>

            {/* Right — image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src={heroSchool}
                  alt="Children at Infogate Schools"
                  className="w-full rounded-3xl shadow-2xl border-4 border-white/20"
                />
              </div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-blue-50 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-muted/50 hover:bg-primary/5 transition-colors"
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="font-extrabold text-gray-900 text-base">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Image mosaic */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={kidsLearning} alt="Kids learning" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
              <img src={teacherClass} alt="Teacher with students" className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8" />
              <img src={kidsArt} alt="Kids doing art" className="rounded-2xl shadow-lg w-full h-48 object-cover -mt-8" />
              <img src={heroSchool} alt="School" className="rounded-2xl shadow-lg w-full h-48 object-cover" />

            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full">
                Why Infogate?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-snug">
                A Place Where Children <span className="text-primary">Love to Learn</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At Infogate Schools, we believe every child is unique. Our approach blends academic
                excellence with emotional development — creating confident, curious learners ready
                to take on the world.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {whyUs.map((item, i) => (
                  <motion.div
                    key={item.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex gap-3 p-4 bg-white rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/about">
                <Button className="bg-primary font-bold shadow-md group mt-2">
                  Discover More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-primary via-[#1a5276] to-[#0a2342] text-white overflow-hidden p-10 sm:p-14"
          >
            {/* Decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/10 rounded-full" />
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }} />
            </div>

            <div className="relative z-10">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <span className="inline-block px-4 py-1.5 bg-white/15 text-white text-sm font-bold rounded-full mb-3">
                  Our Programs
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Learning Paths for Every Age
                </h2>
                <p className="text-white/70 mt-3 max-w-xl mx-auto">
                  From tiny tots to teenagers, we have a program tailored for every stage of your child's growth.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {programs.map((prog, i) => (
                  <motion.div
                    key={prog.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 cursor-pointer group transition-all hover:bg-white/15"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prog.bg} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                      {prog.emoji}
                    </div>
                    <h3 className="text-lg font-extrabold text-white mb-1">{prog.title}</h3>
                    <span className="text-xs font-bold text-yellow-300 bg-yellow-400/20 px-2 py-0.5 rounded-full">{prog.ages}</span>
                    <p className="text-white/65 text-sm mt-3 leading-relaxed">{prog.description}</p>
                    <div className="mt-4 flex items-center text-sm font-semibold text-yellow-300 group-hover:gap-2 gap-1 transition-all">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── EVENTS ── */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-bold rounded-full mb-3">
              What's Coming Up
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Upcoming Events</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.div
                key={event.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="flex gap-4 p-5 rounded-2xl border-2 border-border bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-16 h-16 ${event.color} rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-md`}>
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-extrabold mt-1">{event.date}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline" className="font-semibold border-2">
                View All Events <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY STRIP ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full mb-3">
              Life at Infogate
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Moments of Joy 📸</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {[heroSchool, kidsLearning, teacherClass, kidsArt, kidsLearning, teacherClass].map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl overflow-hidden shrink-0 w-64 h-44 snap-start shadow-md"
              >
                <img src={img} alt="School life" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-primary via-[#1a5276] to-[#0a2342] text-white overflow-hidden p-10 sm:p-16"
          >
            {/* Decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/10 rounded-full" />
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }} />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left max-w-xl">
                <div className="text-4xl mb-4">🎒</div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
                  Ready to Join Our Family?
                </h2>
                <p className="text-white/75 leading-relaxed">
                  Begin your child's incredible learning journey at Infogate Schools.
                  Limited spots available — secure your child's place today!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link to="/admissions">
                  <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-lg shadow-yellow-400/20">
                    Apply Now <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold">
                    Schedule a Visit
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <section className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Phone, label: "Call Us", value: "+234 800 000 0000", color: "text-primary bg-primary/10" },
              { icon: Mail, label: "Email Us", value: "info@infogateschools.com", color: "text-secondary bg-secondary/10" },
              { icon: MapPin, label: "Visit Us", value: "Mafoluku, Oshodi, Lagos", color: "text-accent bg-accent/10" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{item.label}</p>
                  <p className="font-bold text-gray-900 text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

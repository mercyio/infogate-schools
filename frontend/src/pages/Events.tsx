import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ChevronRight, Bell, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: 1,
    title: "Open House Day",
    day: "15",
    month: "JAN",
    date: "January 15, 2025",
    time: "9:00 AM – 3:00 PM",
    location: "Main Campus",
    description: "Tour our campus, meet our teachers, and learn about our programs. Perfect for prospective families!",
    category: "Admissions",
    emoji: "🏫",
    accent: "from-sky-500 to-blue-600",
    badge: "bg-sky-100 text-sky-700",
    border: "border-l-sky-400",
  },
  {
    id: 2,
    title: "Art Exhibition",
    day: "22",
    month: "JAN",
    date: "January 22, 2025",
    time: "2:00 PM – 6:00 PM",
    location: "Art Gallery Hall",
    description: "Showcasing the creative masterpieces of our talented students from all grade levels.",
    category: "Arts",
    emoji: "🎨",
    accent: "from-pink-500 to-rose-600",
    badge: "bg-pink-100 text-pink-700",
    border: "border-l-pink-400",
  },
  {
    id: 3,
    title: "Science Fair",
    day: "01",
    month: "FEB",
    date: "February 1, 2025",
    time: "10:00 AM – 4:00 PM",
    location: "Science Building",
    description: "Young scientists present their exciting discoveries and experiments. Prizes to be won!",
    category: "Academic",
    emoji: "🔬",
    accent: "from-emerald-500 to-green-600",
    badge: "bg-emerald-100 text-emerald-700",
    border: "border-l-emerald-400",
  },
  {
    id: 4,
    title: "Sports Day",
    day: "15",
    month: "FEB",
    date: "February 15, 2025",
    time: "8:00 AM – 5:00 PM",
    location: "Sports Complex",
    description: "A day of athletic competitions, team spirit, and fun activities for all age groups.",
    category: "Sports",
    emoji: "⚽",
    accent: "from-orange-500 to-amber-600",
    badge: "bg-orange-100 text-orange-700",
    border: "border-l-orange-400",
  },
  {
    id: 5,
    title: "Parent-Teacher Conference",
    day: "28",
    month: "FEB",
    date: "February 28, 2025",
    time: "1:00 PM – 6:00 PM",
    location: "Individual Classrooms",
    description: "One-on-one meetings to discuss your child's progress and development.",
    category: "Academic",
    emoji: "👩‍🏫",
    accent: "from-violet-500 to-purple-600",
    badge: "bg-violet-100 text-violet-700",
    border: "border-l-violet-400",
  },
  {
    id: 6,
    title: "Spring Musical",
    day: "15",
    month: "MAR",
    date: "March 15, 2025",
    time: "6:00 PM – 8:00 PM",
    location: "Auditorium",
    description: "Our students perform a delightful spring musical production. All families welcome!",
    category: "Arts",
    emoji: "🎭",
    accent: "from-rose-500 to-pink-600",
    badge: "bg-rose-100 text-rose-700",
    border: "border-l-rose-400",
  },
];

const announcements = [
  {
    id: 1,
    title: "Extended Enrollment Period",
    date: "December 20, 2024",
    content: "Due to high demand, we've extended our enrollment period until January 31, 2025.",
    priority: true,
    emoji: "🔔",
    color: "bg-amber-50 border-amber-300",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    id: 2,
    title: "Holiday Schedule",
    date: "December 15, 2024",
    content: "School will be closed from December 23, 2024 to January 2, 2025 for winter break.",
    priority: false,
    emoji: "🎄",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
  },
  {
    id: 3,
    title: "New After-School Programs",
    date: "December 10, 2024",
    content: "Exciting new after-school programs including robotics and dance will start in February!",
    priority: false,
    emoji: "🚀",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Events = () => {
  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
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
              <Calendar className="w-4 h-4" />
              What's Happening
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              Events &{" "}
              <span className="text-yellow-300">Announcements</span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed">
              Stay connected with all the exciting happenings at Infogate Schools.
              From academic events to fun activities, there's always something going on!
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50 L0 25 Q720 0 1440 25 L1440 50 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </section>

      {/* ── ANNOUNCEMENTS ── */}
      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center shadow-md">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Latest Announcements</h2>
              <p className="text-sm text-muted-foreground">Important updates from Infogate Schools</p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className={`rounded-3xl border-2 p-6 shadow-sm hover:shadow-md transition-all ${item.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{item.emoji}</span>
                  {item.priority && (
                    <span className="px-3 py-1 bg-amber-400 text-white text-xs font-bold rounded-full">
                      Important
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1 font-medium">{item.date}</p>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-3">
              Mark Your Calendar
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Upcoming Events</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Don't miss out on these exciting events planned for our school community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className={`rounded-3xl bg-white border-2 border-border border-l-4 ${event.border} p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className="flex gap-4">
                  {/* Date badge */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${event.accent} flex flex-col items-center justify-center text-white shrink-0 shadow-md`}>
                    <span className="text-xs font-bold opacity-80">{event.month}</span>
                    <span className="text-xl font-extrabold leading-none">{event.day}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${event.badge}`}>{event.category}</span>
                      <span className="text-lg">{event.emoji}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900 group-hover:text-primary transition-colors mb-1">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" /> {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> {event.location}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 self-center" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED / HIGHLIGHT ── */}
      <section className="py-20 bg-blue-50">
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
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                  <Bell className="w-6 h-6 text-yellow-300" />
                  <span className="text-yellow-300 font-bold text-sm uppercase tracking-wide">Never Miss an Event</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Stay in the Loop</h2>
                <p className="text-white/70 max-w-lg leading-relaxed">
                  Subscribe to our school calendar and receive notifications for upcoming events,
                  important dates, and school announcements — straight to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-lg">
                  Subscribe to Calendar
                </Button>
                <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold">
                  Download Schedule
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;

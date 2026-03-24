import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: 1,
    title: "Open House Day",
    date: "January 15, 2025",
    time: "9:00 AM - 3:00 PM",
    location: "Main Campus",
    description: "Tour our campus, meet our teachers, and learn about our programs. Perfect for prospective families!",
    category: "Admissions",
    color: "bg-primary",
  },
  {
    id: 2,
    title: "Art Exhibition",
    date: "January 22, 2025",
    time: "2:00 PM - 6:00 PM",
    location: "Art Gallery Hall",
    description: "Showcasing the creative masterpieces of our talented students from all grade levels.",
    category: "Arts",
    color: "bg-pink",
  },
  {
    id: 3,
    title: "Science Fair",
    date: "February 1, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Science Building",
    description: "Young scientists present their exciting discoveries and experiments. Prizes to be won!",
    category: "Academic",
    color: "bg-secondary",
  },
  {
    id: 4,
    title: "Sports Day",
    date: "February 15, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Sports Complex",
    description: "A day of athletic competitions, team spirit, and fun activities for all age groups.",
    category: "Sports",
    color: "bg-coral",
  },
  {
    id: 5,
    title: "Parent-Teacher Conference",
    date: "February 28, 2025",
    time: "1:00 PM - 6:00 PM",
    location: "Individual Classrooms",
    description: "One-on-one meetings to discuss your child's progress and development.",
    category: "Academic",
    color: "bg-lavender",
  },
  {
    id: 6,
    title: "Spring Musical",
    date: "March 15, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "Auditorium",
    description: "Our students perform a delightful spring musical production. All families welcome!",
    category: "Arts",
    color: "bg-accent",
  },
];

const announcements = [
  {
    id: 1,
    title: "Extended Enrollment Period",
    date: "December 20, 2024",
    content: "Due to high demand, we've extended our enrollment period until January 31, 2025.",
    priority: true,
  },
  {
    id: 2,
    title: "Holiday Schedule",
    date: "December 15, 2024",
    content: "School will be closed from December 23, 2024 to January 2, 2025 for winter break.",
    priority: false,
  },
  {
    id: 3,
    title: "New After-School Programs",
    date: "December 10, 2024",
    content: "Exciting new after-school programs including robotics and dance will start in February!",
    priority: false,
  },
];

const Events = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-accent/10 to-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full text-accent-foreground font-semibold text-sm mb-6">
              <Calendar className="w-4 h-4" />
              What's Happening
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Events & Announcements
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay connected with all the exciting happenings at Sunshine Academy.
              From academic events to fun activities, there's always something going on!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">📢 Latest Announcements</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`playful-card p-6 ${announcement.priority ? "border-2 border-coral" : ""}`}
              >
                {announcement.priority && (
                  <span className="inline-block px-3 py-1 bg-coral/10 text-coral text-xs font-bold rounded-full mb-3">
                    Important
                  </span>
                )}
                <p className="text-sm text-muted-foreground mb-2">{announcement.date}</p>
                <h3 className="font-bold text-lg mb-2">{announcement.title}</h3>
                <p className="text-muted-foreground text-sm">{announcement.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold">Mark Your Calendar</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              Upcoming Events
            </h2>
          </motion.div>

          <div className="grid gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                className="playful-card p-6 flex flex-col sm:flex-row gap-6 cursor-pointer group"
              >
                {/* Date Card */}
                <div className={`w-20 h-20 ${event.color} rounded-2xl flex flex-col items-center justify-center text-card shrink-0`}>
                  <Calendar className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">{event.date.split(",")[0].split(" ")[0]}</span>
                  <span className="text-lg font-extrabold">{event.date.split(" ")[1].replace(",", "")}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-3 py-1 ${event.color}/10 text-sm font-semibold rounded-full`} style={{ backgroundColor: `hsl(var(--${event.color.replace("bg-", "")})/0.1)`, color: `hsl(var(--${event.color.replace("bg-", "")}))` }}>
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-cool rounded-3xl p-8 sm:p-12 text-center"
          >
            <Calendar className="w-16 h-16 text-primary-foreground mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground mb-4">
              Never Miss an Event
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Subscribe to our calendar and get notifications for all upcoming events and important dates.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="warm" size="lg">
                Subscribe to Calendar
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Download Schedule
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;

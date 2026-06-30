import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone, Mail, MapPin, Clock, Send,
  MessageCircle, Facebook, Twitter, Instagram, Youtube,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+234 800 000 0000",
    sub: "Mon – Fri, 8am – 5pm",
    action: "tel:+2348000000000",
    gradient: "from-sky-500 to-blue-600",
    bg: "bg-sky-50 border-sky-200",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@infogateschools.com",
    sub: "We reply within 24 hours",
    action: "mailto:hello@infogateschools.com",
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 border-violet-200",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Mafoluku, Oshodi, Lagos",
    sub: "Nigeria",
    action: "#map",
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon – Fri: 8:00 AM – 5:00 PM",
    sub: "Sat: 9:00 AM – 1:00 PM",
    action: null,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 border-amber-200",
  },
];

const socials = [
  { icon: Facebook, label: "Facebook", color: "bg-blue-600 hover:bg-blue-500" },
  { icon: Twitter, label: "Twitter", color: "bg-sky-500 hover:bg-sky-400" },
  { icon: Instagram, label: "Instagram", color: "bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400" },
  { icon: Youtube, label: "YouTube", color: "bg-red-600 hover:bg-red-500" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message Sent! 🎉", description: "Thank you for reaching out. We'll get back to you within 24 hours." });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              <MessageCircle className="w-4 h-4" />
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              We'd Love to{" "}
              <span className="text-yellow-300">Hear From You!</span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed max-w-xl mx-auto">
              Have questions about admissions, programs, or anything else?
              Our friendly team is here to help — reach out anytime.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50 L0 25 Q720 0 1440 25 L1440 50 Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="py-16 bg-sky-50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.action || undefined}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className={`rounded-3xl border-2 p-6 flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow-md transition-all ${item.bg}`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-md`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-extrabold text-gray-900 mb-1">{item.label}</h3>
                <p className="text-sm font-semibold text-gray-700">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM & MAP ── */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-white border-2 border-border p-8 shadow-sm"
            >
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-3">
                  Send a Message
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  How Can We Help?
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  Fill in the form and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block text-gray-700">Your Name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="h-11 rounded-xl bg-blue-50 border-blue-200 focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block text-gray-700">Email Address</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className="h-11 rounded-xl bg-blue-50 border-blue-200 focus:bg-white" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block text-gray-700">Phone Number</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+234 800 000 0000" className="h-11 rounded-xl bg-blue-50 border-blue-200 focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block text-gray-700">Subject</label>
                    <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="Admission inquiry" required className="h-11 rounded-xl bg-blue-50 border-blue-200 focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block text-gray-700">Your Message</label>
                  <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us how we can help you..." required rows={5} className="rounded-xl resize-none bg-blue-50 border-blue-200 focus:bg-white" />
                </div>
                <Button type="submit" size="lg" disabled={sending} className="w-full bg-primary hover:bg-primary/90 font-bold shadow-md">
                  {sending ? "Sending..." : "Send Message"}
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Map */}
              <div id="map" className="rounded-3xl overflow-hidden border-2 border-border shadow-sm">
                <div className="bg-primary px-5 py-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white shrink-0" />
                  <p className="text-white text-sm font-semibold">13 Adisatu Street, Mafoluku, Oshodi, Lagos</p>
                </div>
                <iframe
                  title="Infogate Schools Location"
                  src="https://www.google.com/maps?q=13+Adisatu+Street,+Mafoluku,+Oshodi,+Lagos,+Nigeria&output=embed"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="bg-white px-5 py-3">
                  <a
                    href="https://www.google.com/maps/search/13+Adisatu+Street,+Mafoluku,+Oshodi,+Lagos,+Nigeria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Immediate help */}
              <div className="rounded-3xl bg-gradient-to-br from-primary via-[#1a5276] to-[#0a2342] text-white p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }} />
                <div className="relative z-10">
                  <div className="text-3xl mb-3">📞</div>
                  <h3 className="font-extrabold text-xl mb-2">Need Immediate Help?</h3>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    Call our admissions hotline for quick assistance. We're always happy to help.
                  </p>
                  <a href="tel:+2348000000000" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors">
                    <Phone className="w-4 h-4" />
                    +234 800 000 0000
                  </a>
                </div>
              </div>

              {/* Social links */}
              <div className="rounded-3xl bg-white border-2 border-border p-6 shadow-sm">
                <h3 className="font-extrabold text-gray-900 mb-1">Follow Us</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Stay connected for updates, photos, and school highlights.
                </p>
                <div className="flex gap-3 flex-wrap">
                  {socials.map((s) => (
                    <a key={s.label} href="#" className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all ${s.color}`}>
                      <s.icon className="w-4 h-4" />
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;

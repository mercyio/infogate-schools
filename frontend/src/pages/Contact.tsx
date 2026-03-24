import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    action: "tel:+15551234567",
    color: "bg-primary",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@sunshinenacademy.edu",
    action: "mailto:hello@sunshineacademy.edu",
    color: "bg-secondary",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Rainbow Lane, Sunshine City, SC 12345",
    action: "#map",
    color: "bg-coral",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon-Fri: 8:00 AM - 5:00 PM",
    action: null,
    color: "bg-lavender",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent! 🎉",
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-secondary/10 to-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary font-semibold text-sm mb-6">
              <MessageCircle className="w-4 h-4" />
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              We'd Love to Hear From You!
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about admissions, programs, or anything else?
              Our friendly team is here to help!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.action || undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="playful-card p-6 text-center cursor-pointer"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-7 h-7 text-card" />
                </div>
                <h3 className="font-bold mb-1">{item.label}</h3>
                <p className="text-muted-foreground text-sm">{item.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Your Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Phone Number</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Subject</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Admission inquiry"
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Your Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    required
                    rows={5}
                    className="rounded-xl resize-none"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto">
                  Send Message
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div id="map" className="playful-card overflow-hidden h-80">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Visit Our Campus</h3>
                    <p className="text-muted-foreground text-sm">
                      123 Rainbow Lane, Sunshine City, SC 12345
                    </p>
                    <Button variant="outline" className="mt-4">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="playful-card p-6">
                <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Stay connected with us on social media for updates, photos, and more!
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, color: "bg-primary" },
                    { icon: Twitter, color: "bg-secondary" },
                    { icon: Instagram, color: "bg-pink" },
                    { icon: Youtube, color: "bg-coral" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center text-card hover:scale-110 transition-transform`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Contact */}
              <div className="playful-card p-6 gradient-nature text-primary-foreground">
                <h3 className="font-bold text-lg mb-2">Need Immediate Help?</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Call our admissions hotline for quick assistance.
                </p>
                <a href="tel:+15551234567" className="flex items-center gap-2 font-bold text-lg">
                  <Phone className="w-5 h-5" />
                  +1 (555) 123-4567
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

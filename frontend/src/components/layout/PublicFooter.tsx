import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const PublicFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />

      <div className="container mx-auto px-4 py-14 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* School Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/infogate-school-badge.svg" alt="Infogate Schools" className="h-14 w-auto" />
              <div>
                <h3 className="text-lg font-extrabold">Infogate Schools</h3>
                <p className="text-xs text-white/60">One With God is a Majority</p>
              </div>
            </div>
            <p className="text-white/65 text-sm leading-relaxed">
              Nurturing young minds from nursery through secondary school.
              Building tomorrow's leaders with love, creativity, and excellence.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-white/50 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { name: "About Us", path: "/about" },
                { name: "Admissions", path: "/admissions" },
                { name: "Events", path: "/events" },
                { name: "Gallery", path: "/gallery" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/70 hover:text-yellow-300 transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-white/50 mb-4">Our Programs</h4>
            <ul className="space-y-2.5">
              {["Preparatory / KG", "Nursery", "Primary School", "Secondary School"].map((program) => (
                <li key={program}>
                  <span className="text-white/70 text-sm font-medium">{program}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-white/50 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-yellow-300 mt-0.5 shrink-0" />
                <span className="text-white/70 text-sm">13 Adisatu Street, Mafoluku, Oshodi, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-yellow-300 shrink-0" />
                <span className="text-white/70 text-sm">+234 800 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-yellow-300 shrink-0" />
                <span className="text-white/70 text-sm">hello@infogateschools.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © 2025 Infogate Schools. All rights reserved.
          </p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> for our students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

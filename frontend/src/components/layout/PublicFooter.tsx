import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const PublicFooter = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Wave decoration */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-background"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/infogate-school-badge.svg" alt="Infogate Schools" className="h-16 w-auto" />
              <div>
                <h3 className="text-xl font-bold">Infogate Schools</h3>
                <p className="text-sm text-background/70">One With God is a Majority</p>
              </div>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Nurturing young minds from nursery <br /> through vocational training. 
              Building tomorrow's leaders with love, creativity, <br /> and excellence.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "About Us", path: "/about" },
                { name: "Admissions", path: "/admissions" },
                { name: "Events", path: "/events" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-background/80 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-bold mb-4">Our Programs</h4>
            <ul className="space-y-2">
              {["Nursery (Ages 2-5)", "Primary School", "Secondary School", "Vocational Training"].map((program) => (
                <li key={program}>
                  <span className="text-background/80 text-sm">{program}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-background/80 text-sm">
                  123 Rainbow Lane, Infogate City, SC 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-background/80 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-background/80 text-sm">hello@infogateschools.edu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/60 text-sm text-center sm:text-left">
            © 2025 Infogate Schools. All rights reserved.
          </p>
          <p className="text-background/60 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-coral fill-coral" /> for our students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

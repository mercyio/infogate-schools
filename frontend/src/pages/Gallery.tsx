import { motion, AnimatePresence } from "framer-motion";
import { Camera, Video, Filter, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const categories = ["All", "Events", "Classrooms", "Sports", "Excursions", "Graduations", "Arts"];

const categoryColors: Record<string, string> = {
  Events: "bg-sky-100 text-sky-700",
  Classrooms: "bg-emerald-100 text-emerald-700",
  Sports: "bg-orange-100 text-orange-700",
  Excursions: "bg-violet-100 text-violet-700",
  Graduations: "bg-amber-100 text-amber-700",
  Arts: "bg-pink-100 text-pink-700",
};

const galleryItems = [
  { id: 1, type: "image", category: "Events", title: "Annual Day 2024", description: "Students performing traditional dance", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=450&fit=crop" },
  { id: 2, type: "image", category: "Classrooms", title: "Science Lab", description: "Hands-on learning in the lab", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=450&fit=crop" },
  { id: 3, type: "image", category: "Sports", title: "Sports Day", description: "Students competing in athletics", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=450&fit=crop" },
  { id: 4, type: "image", category: "Excursions", title: "Zoo Visit", description: "Nursery students exploring wildlife", image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=600&h=450&fit=crop" },
  { id: 5, type: "image", category: "Graduations", title: "Graduation 2024", description: "Celebrating our graduates", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=450&fit=crop" },
  { id: 6, type: "image", category: "Arts", title: "Art Exhibition", description: "Student artwork showcase", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=450&fit=crop" },
  { id: 7, type: "video", category: "Events", title: "Christmas Carols", description: "Students singing holiday songs", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=450&fit=crop" },
  { id: 8, type: "image", category: "Classrooms", title: "Reading Time", description: "Primary students enjoying books", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=450&fit=crop" },
  { id: 9, type: "image", category: "Sports", title: "Football Tournament", description: "Inter-house competition", image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=450&fit=crop" },
  { id: 10, type: "image", category: "Excursions", title: "Museum Trip", description: "Learning history firsthand", image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&h=450&fit=crop" },
  { id: 11, type: "image", category: "Arts", title: "Music Class", description: "Students learning instruments", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=450&fit=crop" },
  { id: 12, type: "video", category: "Graduations", title: "Graduation Speech", description: "Valedictorian address", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=450&fit=crop" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

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
              <Camera className="w-4 h-4" />
              School Life
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              Photo &{" "}
              <span className="text-yellow-300">Video Gallery</span>
            </h1>
            <p className="text-lg text-white/75 leading-relaxed">
              Explore memorable moments from our school events, classrooms,
              sports days, and so much more!
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50 L0 25 Q720 0 1440 25 L1440 50 Z" fill="#eff6ff"/>
          </svg>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="py-6 bg-blue-50 sticky top-0 z-40 border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-600 border border-border hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY GRID ── */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
              >
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="break-inside-avoid rounded-2xl overflow-hidden bg-white border-2 border-border shadow-sm hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div>
                          <p className="text-white font-extrabold text-sm">{item.title}</p>
                          <p className="text-white/75 text-xs mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      {/* Video play button */}
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Video className="w-5 h-5 text-primary ml-0.5" />
                          </div>
                        </div>
                      )}
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${categoryColors[item.category] || "bg-white text-gray-700"}`}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-extrabold text-gray-900 text-sm group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-semibold">No items found in this category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── SOCIAL CTA ── */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-primary via-[#1a5276] to-[#0a2342] text-white overflow-hidden p-10 sm:p-14 text-center"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/10 rounded-full" />
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }} />
            </div>
            <div className="relative z-10 max-w-xl mx-auto">
              <div className="text-4xl mb-4">📸</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Want to See More?</h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Follow us on social media for daily updates, behind-the-scenes moments, and school highlights!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2">
                  <Facebook className="w-5 h-5" /> Facebook
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold gap-2">
                  <Instagram className="w-5 h-5" /> Instagram
                </Button>
                <Button size="lg" className="bg-red-600 hover:bg-red-500 text-white font-bold gap-2">
                  <Youtube className="w-5 h-5" /> YouTube
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Gallery;

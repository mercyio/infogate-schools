import { motion } from "framer-motion";
import { Camera, Video, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const categories = ["All", "Events", "Classrooms", "Sports", "Excursions", "Graduations", "Arts"];

const galleryItems = [
  { id: 1, type: "image", category: "Events", title: "Annual Day 2024", description: "Students performing traditional dance", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop"  },
  { id: 2, type: "image", category: "Classrooms", title: "Science Lab", description: "Hands-on learning in the lab", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=400&fit=crop" },
  { id: 3, type: "image", category: "Sports", title: "Sports Day", description: "Students competing in athletics", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop" },
  { id: 4, type: "image", category: "Excursions", title: "Zoo Visit", description: "Nursery students exploring wildlife", image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=500&h=400&fit=crop" },
  { id: 5, type: "image", category: "Graduations", title: "Graduation 2024", description: "Celebrating our graduates", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=400&fit=crop" },
  { id: 6, type: "image", category: "Arts", title: "Art Exhibition", description: "Student artwork showcase", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop"  },
  { id: 7, type: "video", category: "Events", title: "Christmas Carols", description: "Students singing holiday songs", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=400&fit=crop" },
  { id: 8, type: "image", category: "Classrooms", title: "Reading Time", description: "Primary students enjoying books", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop"  },
  { id: 9, type: "image", category: "Sports", title: "Football Tournament", description: "Inter-house competition", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop" },
  { id: 10, type: "image", category: "Excursions", title: "Museum Trip", description: "Learning history firsthand", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop" },
  { id: 11, type: "image", category: "Arts", title: "Music Class", description: "Students learning instruments", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=400&fit=crop" },
  { id: 12, type: "video", category: "Graduations", title: "Graduation Speech", description: "Valedictorian address", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=400&fit=crop" },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredItems = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 gradient-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent rounded-full animate-float" />
          <div className="absolute bottom-10 right-20 w-24 h-24 bg-secondary rounded-full animate-bounce-slow" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-card/20 text-card px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Camera className="w-4 h-4" /> School Life
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-card mb-4">
              Photo & Video Gallery
            </h1>
            <p className="text-lg text-card/80 max-w-2xl mx-auto">
              Explore memorable moments from our school events, classrooms, sports days, and more!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-muted/30 sticky top-16 z-40 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group playful-card overflow-hidden cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                   <img 
                     src={item.image} 
                     alt={item.title}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                   />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                     {item.type === "video" ? (
                       <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center">
                         <Video className="w-8 h-8 text-card ml-1" />
                       </div>
                     ) : (
                       <Camera className="w-12 h-12 text-white" />
                     )}
                   </div>
                   <div className="absolute top-3 left-3">
                     <span className="px-2 py-1 bg-card/90 rounded-full text-xs font-semibold text-primary">
                       {item.category}
                     </span>
                   </div>
                 </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-4">Want to see more?</h2>
            <p className="text-muted-foreground mb-6">Follow us on social media for daily updates and behind-the-scenes content!</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline">Facebook</Button>
              <Button variant="outline">Instagram</Button>
              <Button variant="outline">YouTube</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

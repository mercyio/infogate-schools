import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  FileText,
  Image,
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Bell,
  ArrowLeft,
  MoreHorizontal,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useState } from "react";

// Types
interface ContentItem {
  id: number;
  title: string;
  type: "news" | "event" | "gallery";
  status: "published" | "draft";
  date: string;
  views: number;
  author?: string;
  description?: string;
}

// Constants
const CONTENT_ITEMS: ContentItem[] = [
  {
    id: 1,
    title: "Welcome to New Term",
    type: "news",
    status: "published",
    date: "2024-01-15",
    views: 234,
    author: "Principal Johnson",
    description: "Start of the new academic term with exciting updates...",
  },
  {
    id: 2,
    title: "Sports Day 2024",
    type: "event",
    status: "published",
    date: "2024-02-15",
    views: 156,
    author: "Sports Committee",
    description: "Annual sports day featuring various competitions...",
  },
  {
    id: 3,
    title: "Annual Science Fair",
    type: "event",
    status: "draft",
    date: "2024-03-01",
    views: 0,
    author: "Science Department",
    description: "Showcasing student projects and innovations...",
  },
  {
    id: 4,
    title: "New Library Books",
    type: "news",
    status: "published",
    date: "2024-01-10",
    views: 89,
    author: "Librarian Smith",
    description: "Latest additions to our school library collection...",
  },
  {
    id: 5,
    title: "Parent-Teacher Meeting",
    type: "event",
    status: "published",
    date: "2024-01-28",
    views: 412,
    author: "Administration",
    description: "Important meeting to discuss student progress...",
  },
  {
    id: 6,
    title: "Graduation Photos 2024",
    type: "gallery",
    status: "published",
    date: "2024-01-05",
    views: 567,
    author: "Photography Club",
    description: "Beautiful memories from the graduation ceremony...",
  },
];

const CONTENT_TYPES = {
  news: {
    label: "News",
    color: "bg-gradient-to-br from-blue-100 to-cyan-100",
    textColor: "text-blue-700",
    icon: FileText,
    dotColor: "bg-blue-600",
  },
  event: {
    label: "Event",
    color: "bg-gradient-to-br from-purple-100 to-pink-100",
    textColor: "text-purple-700",
    icon: Calendar,
    dotColor: "bg-purple-600",
  },
  gallery: {
    label: "Gallery",
    color: "bg-gradient-to-br from-green-100 to-emerald-100",
    textColor: "text-green-700",
    icon: Image,
    dotColor: "bg-green-600",
  },
};

const STAT_COLORS = [
  "bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30",
  "bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30",
  "bg-gradient-to-br from-orange-600 to-red-600 shadow-lg shadow-orange-500/30",
  "bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg shadow-green-500/30",
];

// Components
const PageHeader = () => (
  <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group hover:shadow-blue-500/50 transition-shadow">
          <FileText className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900">Content Management</h1>
          <p className="text-xs text-slate-500">
            Manage school content & media
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all"
        >
          <Bell className="w-5 h-5" />
        </Button>
        <Link to="/portal/admin">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  </header>
);

interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  colorIndex: number;
}

const StatsCard = ({
  label,
  value,
  icon: Icon,
  colorIndex,
}: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${STAT_COLORS[colorIndex]} rounded-2xl p-6 text-white group hover:shadow-2xl transition-all`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <TrendingUp className="w-5 h-5 text-white/60" />
    </div>
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className="text-sm text-white/80">{label}</p>
  </motion.div>
);

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const FilterTabs = ({ activeTab, onTabChange }: FilterTabsProps) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-2">
    {["all", "news", "event", "gallery"].map((tab) => (
      <motion.button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
          activeTab === tab
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </motion.button>
    ))}
  </div>
);

interface ContentCardProps {
  item: ContentItem;
  index: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const ContentCard = ({
  item,
  index,
  onEdit,
  onDelete,
  onView,
}: ContentCardProps) => {
  const contentType = CONTENT_TYPES[item.type];
  const Icon = contentType.icon;
  const isPublished = item.status === "published";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white border border-slate-200/60 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className={`${contentType.color} p-3 rounded-xl`}>
            <Icon className={`w-6 h-6 ${contentType.textColor}`} />
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onView(item.id)}
              className="p-2 hover:bg-blue-50 rounded-lg text-slate-600 hover:text-blue-600 transition-all"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(item.id)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-all"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(item.id)}
              className="p-2 hover:bg-red-50 rounded-lg text-slate-600 hover:text-red-600 transition-all"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Title & Type */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-slate-900 text-lg line-clamp-2">
              {item.title}
            </h3>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">
            {item.description || "No description available"}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-slate-600 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            {item.date}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-slate-400" />
            {item.views} views
          </span>
        </div>

        {/* Status & Type Badges */}
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${contentType.color} ${contentType.textColor}`}
          >
            <div className={`w-2 h-2 rounded-full ${contentType.dotColor}`} />
            {contentType.label}
          </span>
          {isPublished ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Published
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Draft
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const ContentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filteredContent = CONTENT_ITEMS.filter(
    (item) =>
      (activeTab === "all" || item.type === activeTab) &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      label: "Total Content",
      value: CONTENT_ITEMS.length.toString(),
      icon: FileText,
    },
    {
      label: "News Articles",
      value: CONTENT_ITEMS.filter((i) => i.type === "news").length.toString(),
      icon: FileText,
    },
    {
      label: "Events",
      value: CONTENT_ITEMS.filter((i) => i.type === "event").length.toString(),
      icon: Calendar,
    },
    {
      label: "Gallery Items",
      value: CONTENT_ITEMS.filter(
        (i) => i.type === "gallery"
      ).length.toString(),
      icon: Image,
    },
  ];

  const handleEdit = (id: number) => {
    console.log("Edit content:", id);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
  };

  const handleView = (id: number) => {
    console.log("View content:", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>

      <PageHeader />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Page Title */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">
              Content Management
            </h2>
            <p className="text-slate-600 text-lg">
              Manage all your school content, articles, events, and media in one
              place
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <StatsCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                colorIndex={index}
              />
            ))}
          </div>

          {/* Actions Bar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" />
                Create New Content
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search content by title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white"
              />
            </div>
          </div>

          {/* Content Grid */}
          {filteredContent.length > 0 ? (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredContent.map((item, index) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-700 text-lg font-semibold">
                No content found
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200/50"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
                Delete Content?
              </h2>
              <p className="text-slate-600 text-center mb-8">
                Are you sure you want to delete this content? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeletingId(null)}
                  className="flex-1 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("Delete content:", deletingId);
                    setDeletingId(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentManagement;

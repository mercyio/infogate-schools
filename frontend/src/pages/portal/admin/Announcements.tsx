import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  Bell,
  LogOut,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  Megaphone,
  X,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Types
interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  target_audience: string[];
  priority: string;
  author: {
    _id: string;
    full_name: string;
    role: string;
    avatar_url?: string;
  };
  likes: number;
  comments: number;
  liked?: boolean;
}

interface FormData {
  title: string;
  content: string;
  audience: string;
  priority: string;
}

// Constants
// No hardcoded data here anymore


const PRIORITY_STYLES: Record<
  string,
  {
    bg: string;
    text: string;
    dot: string;
    badge: string;
    color: string;
    glow: string;
  }
> = {
  High: {
    bg: "bg-red-50/50 border-l-4 border-l-red-500",
    text: "text-red-700",
    dot: "bg-red-600",
    badge: "bg-red-100/80 text-red-700 border border-red-200",
    color: "text-red-600",
    glow: "shadow-red-500/10",
  },
  Medium: {
    bg: "bg-amber-50/50 border-l-4 border-l-amber-500",
    text: "text-amber-700",
    dot: "bg-amber-600",
    badge: "bg-amber-100/80 text-amber-700 border border-amber-200",
    color: "text-amber-600",
    glow: "shadow-amber-500/10",
  },
  Normal: {
    bg: "bg-blue-50/50 border-l-4 border-l-blue-500",
    text: "text-slate-600",
    dot: "bg-blue-400",
    badge: "bg-blue-100/80 text-blue-700 border border-blue-200",
    color: "text-blue-600",
    glow: "shadow-blue-500/10",
  },
};

const AUDIENCE_COLORS: Record<string, string> = {
  All: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700",
  Students: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700",
  Teachers: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700",
  Parents: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700",
};

const AVATAR_COLORS: Record<string, string> = {
  SJ: "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500",
  JW: "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500",
  ED: "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
  LM: "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
  AD: "bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600",
};

// Components
const PageHeader = () => (
  <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group hover:shadow-blue-500/50 transition-shadow">
          <Megaphone className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900">School Announcements</h1>
          <p className="text-xs text-slate-500">Community Feed</p>
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
        <Link to="/login">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  </header>
);

interface CreatePostFormProps {
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
}

const CreatePostForm = ({ onCancel, onSubmit }: CreatePostFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    audience: "all",
    priority: "normal",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(formData);
      setFormData({
        title: "",
        content: "",
        audience: "all",
        priority: "normal",
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-white to-blue-50 border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all sticky top-20 group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/40">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">School Administrator</p>
            <p className="text-xs text-slate-500">Online now</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="What's on your mind?"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="text-sm placeholder:text-slate-400 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg h-10 bg-white/80 backdrop-blur"
            required
          />

          <textarea
            placeholder="Share your announcement with the school community..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full min-h-[100px] rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 backdrop-blur"
            required
          />

          <div className="grid grid-cols-2 gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Audience
              </label>
              <select
                value={formData.audience}
                onChange={(e) =>
                  setFormData({ ...formData, audience: e.target.value })
                }
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer font-medium"
              >
                <option value="all">All</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="parents">Parents</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer font-medium"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="rounded-lg text-xs hover:bg-slate-100"
            >
              Discard
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all text-xs font-semibold"
            >
              <Plus className="w-3 h-3" />
              Post
            </Button>
          </div>
        </div>
      </div>
    </motion.form>
  );
};

interface CreatePostPromptProps {
  onCreateClick: () => void;
}

const CreatePostPrompt = ({ onCreateClick }: CreatePostPromptProps) => (
  <motion.button
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onCreateClick}
    className="w-full bg-gradient-to-br from-white to-blue-50 border border-slate-200 rounded-2xl p-4 hover:shadow-xl transition-all flex items-center gap-4 group sticky top-20 hover:border-blue-300"
  >
    <div className="relative">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/40">
        <span className="text-white font-bold text-sm">AD</span>
      </div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
    </div>
    <span className="text-slate-500 group-hover:text-slate-700 transition-colors text-sm font-medium">
      What's on your mind?
    </span>
  </motion.button>
);

interface EditPostModalProps {
  announcement: Announcement | null;
  onCancel: () => void;
  onSubmit: (id: string, data: FormData) => void;
}

const EditPostModal = ({
  announcement,
  onCancel,
  onSubmit,
}: EditPostModalProps) => {
  const [formData, setFormData] = useState<FormData>(
    announcement
      ? {
          title: announcement.title,
          content: announcement.content,
          audience: announcement.target_audience[0] || "all",
          priority: announcement.priority.toLowerCase(),
        }
      : { title: "", content: "", audience: "all", priority: "normal" }
  );

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        audience: announcement.target_audience[0] || "all",
        priority: announcement.priority.toLowerCase(),
      });
    }
  }, [announcement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (announcement && formData.title.trim() && formData.content.trim()) {
      onSubmit(announcement._id, formData);
    }
  };

  return (
    <AnimatePresence>
      {announcement && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-200/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Edit Announcement
              </h2>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">
                  Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full min-h-[120px] rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-2 block">
                    Audience
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) =>
                      setFormData({ ...formData, audience: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  >
                    <option value="all">All (Everyone)</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Teachers Only</option>
                    <option value="parents">Parents Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-2 block">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                  >
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Update Announcement
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface DeleteConfirmModalProps {
  announcementId: string | null;
  title: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({
  announcementId,
  title,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) => {
  return (
    <AnimatePresence>
      {announcementId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200/50"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Delete Announcement?
            </h2>
            <p className="text-slate-600 text-center mb-8">
              Are you sure you want to delete "{title}"? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 rounded-lg"
              >
                Keep It
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface AnnouncementPostProps {
  announcement: Announcement;
  index: number;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string, title: string) => void;
  onLike: (id: string) => void;
}

const AnnouncementPost = ({
  announcement,
  index,
  onEdit,
  onDelete,
  onLike,
}: AnnouncementPostProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const priority = (announcement.priority?.charAt(0).toUpperCase() + announcement.priority?.slice(1)) || "Normal";
  const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Normal;
  const audience = announcement.target_audience[0] || "All";
  const audienceBg = AUDIENCE_COLORS[audience.charAt(0).toUpperCase() + audience.slice(1)] || AUDIENCE_COLORS.All;
  
  const authorName = announcement.author?.full_name || "School Admin";
  const avatarInitials = authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const avatarBg = AVATAR_COLORS[avatarInitials] || "bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden",
        priorityStyle.bg,
        "border border-slate-200/80"
      )}
    >
      {/* Post Header */}
      <div
        className={cn(
          "p-5 border-b border-slate-100 bg-white/50",
          priorityStyle.glow
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-12 h-12 ${avatarBg} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 ring-2 ring-white`}
            >
              <span className="text-white font-bold text-sm">
                {avatarInitials}
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                {authorName}
              </p>
              <p className="text-xs text-slate-500">{format(new Date(announcement.createdAt), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/60 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-5 h-5 text-slate-600" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      onEdit(announcement);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-blue-50 text-slate-700 text-sm font-medium border-b border-slate-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                    Edit Post
                  </button>
                  <button
                    onClick={() => {
                      onDelete(announcement._id, announcement.title);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Priority Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${priorityStyle.dot} animate-pulse`}
          />
          <span
            className={`text-xs font-bold ${priorityStyle.badge} px-3 py-1 rounded-full`}
          >
            {priority} Priority
          </span>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-5 border-b border-slate-200/40">
        <h3 className="font-bold text-slate-900 mb-2 text-base leading-tight break-words">
          {announcement.title}
        </h3>
        <p className="text-slate-700 leading-relaxed text-sm mb-4 whitespace-pre-wrap break-words">
          {announcement.content}
        </p>

        {/* Audience Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold ${audienceBg} backdrop-blur-sm border border-white/40`}
        >
          <Users className="w-3 h-3" />
          {audience}
        </div>
      </div>

      {/* Post Stats */}
      <div className="px-5 py-3 border-b border-slate-200/40 text-xs text-slate-600 flex items-center justify-between bg-white/30 backdrop-blur-sm">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-blue-600" />
          <span className="font-semibold text-slate-900">
            {announcement.likes}
          </span>{" "}
          likes
        </span>
        <span>
          <span className="font-semibold text-slate-900">
            {announcement.comments}
          </span>{" "}
          comments
        </span>
      </div>

      {/* Post Actions */}
      <div className="p-3 flex items-center justify-around bg-white/50 backdrop-blur-sm">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLike(announcement._id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
            announcement.liked
              ? "text-red-600 bg-red-50/60 backdrop-blur"
              : "text-slate-600 hover:bg-white/80"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              announcement.liked ? "fill-current" : ""
            } transition-transform ${announcement.liked ? "scale-125" : ""}`}
          />
          Like
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs text-slate-600 hover:bg-white/80 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Comment
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs text-slate-600 hover:bg-white/80 transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share
        </motion.button>
      </div>
    </motion.div>
  );
};

interface AnnouncementFeedProps {
  announcements: Announcement[];
  isLoading: boolean;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string, title: string) => void;
  onLike: (id: string) => void;
}

const AnnouncementFeed = ({
  announcements,
  isLoading,
  onEdit,
  onDelete,
  onLike,
}: AnnouncementFeedProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/50 backdrop-blur h-48 rounded-3xl animate-pulse border border-slate-200/60" />
        ))}
      </div>
    );
  }
  if (announcements.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-blue-50 border border-slate-200/60 rounded-3xl p-12 text-center shadow-sm backdrop-blur-sm"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Megaphone className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-slate-700 text-lg font-semibold">
          No announcements yet
        </p>
        <p className="text-slate-500 text-sm mt-2">
          Be the first to post an announcement!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement, index) => (
        <AnnouncementPost
          key={announcement._id}
          announcement={announcement}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

// Main Component
const Announcements = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingTitle, setDeletingTitle] = useState<string | null>(null);

  // Queries
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await api.get('/announcements');
      return res.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newPost: any) => api.post('/announcements', newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setShowCreateForm(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/announcements/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setEditingAnnouncement(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setDeletingId(null);
      setDeletingTitle(null);
    }
  });

  const handleCreateAnnouncement = (data: FormData) => {
    createMutation.mutate({
      title: data.title,
      content: data.content,
      target_audience: [data.audience],
      priority: data.priority,
    });
  };

  const handleEditAnnouncement = (id: string, data: FormData) => {
    updateMutation.mutate({
      id,
      data: {
        title: data.title,
        content: data.content,
        target_audience: [data.audience],
        priority: data.priority,
      }
    });
  };

  const handleDeleteAnnouncement = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };

  const likeMutation = useMutation({
    mutationFn: (id: string) => api.post(`/announcements/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    }
  });

  const handleLike = (id: string) => {
    likeMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>


      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}

          {/* Page Title */}
          <div className="mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-slate-900 mb-3 flex items-center gap-3"
            >
              Community Feed
            </motion.h2>
            <p className="text-slate-600 text-lg">
              Share announcements and stay connected with your school community
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Create Post */}
            <div className="order-1 lg:order-1">
              {!showCreateForm ? (
                <CreatePostPrompt
                  onCreateClick={() => setShowCreateForm(true)}
                />
              ) : (
                <CreatePostForm
                  onCancel={() => setShowCreateForm(false)}
                  onSubmit={handleCreateAnnouncement}
                />
              )}
            </div>

            {/* Right Column - Feed */}
            <div className="lg:col-span-2 order-2 lg:order-2">
              <AnnouncementFeed
                announcements={announcements}
                isLoading={isLoading}
                onEdit={setEditingAnnouncement}
                onDelete={(id, title) => {
                  setDeletingId(id);
                  setDeletingTitle(title);
                }}
                onLike={handleLike}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <EditPostModal
        announcement={editingAnnouncement}
        onCancel={() => setEditingAnnouncement(null)}
        onSubmit={handleEditAnnouncement}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        announcementId={deletingId}
        title={deletingTitle}
        onCancel={() => {
          setDeletingId(null);
          setDeletingTitle(null);
        }}
        onConfirm={handleDeleteAnnouncement}
      />
    </div>
  );
};

export default Announcements;

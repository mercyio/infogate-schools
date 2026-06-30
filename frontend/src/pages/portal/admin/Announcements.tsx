import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Users,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  X,
  AlertTriangle,
  Info,
  Flame,
  Search,
  Filter,
} from "lucide-react";
import api from "@/lib/api";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  target_audience: string[];
  priority: string;
  author: { _id: string; full_name: string; role: string };
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_META: Record<string, { icon: typeof Info; label: string; strip: string; badge: string; dot: string }> = {
  High:   { icon: Flame,         label: "High",   strip: "bg-red-500",    badge: "bg-red-50 text-red-700 border-red-200",    dot: "bg-red-500" },
  Medium: { icon: AlertTriangle, label: "Medium", strip: "bg-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  Normal: { icon: Info,          label: "Normal", strip: "bg-blue-500",   badge: "bg-blue-50 text-blue-700 border-blue-200",  dot: "bg-blue-400" },
};

const AUDIENCE_BADGE: Record<string, string> = {
  all:      "bg-gray-100 text-gray-600",
  students: "bg-green-100 text-green-700",
  teachers: "bg-purple-100 text-purple-700",
  parents:  "bg-orange-100 text-orange-700",
};

function avatarGradient(name: string) {
  const palette = [
    "from-blue-600 to-cyan-500",
    "from-purple-600 to-pink-500",
    "from-green-600 to-teal-500",
    "from-orange-500 to-amber-400",
    "from-indigo-600 to-blue-500",
    "from-rose-600 to-pink-500",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return palette[h % palette.length];
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function normPriority(p: string) {
  const s = (p || "normal").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Compose box ──────────────────────────────────────────────────────────────

function ComposeBox({ onSubmit, loading }: { onSubmit: (d: FormData) => void; loading: boolean }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>({ title: "", content: "", audience: "all", priority: "normal" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSubmit(form);
    setForm({ title: "", content: "", audience: "all", priority: "normal" });
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Prompt row */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center shrink-0">
            <span className="text-white font-extrabold text-xs">AD</span>
          </div>
          <span className="flex-1 text-sm text-gray-400 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 hover:border-gray-300 transition-colors">
            Post an announcement…
          </span>
          <div className="w-9 h-9 bg-yellow-400 hover:bg-yellow-300 rounded-xl flex items-center justify-center transition-colors shrink-0">
            <Plus className="w-4 h-4 text-gray-900" />
          </div>
        </button>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={submit}
            className="p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center">
                  <span className="text-white font-extrabold text-xs">AD</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">School Administrator</p>
                  <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span className="text-[10px] text-gray-400">Online</span></div>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Announcement title…"
              className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0a2342] focus:ring-2 focus:ring-[#0a2342]/10 bg-gray-50"
            />
            <textarea
              required
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Share your message with the school community…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-[#0a2342] focus:ring-2 focus:ring-[#0a2342]/10 bg-gray-50"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Audience</label>
                <select
                  value={form.audience}
                  onChange={e => setForm({ ...form, audience: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0a2342] cursor-pointer font-medium"
                >
                  <option value="all">Everyone</option>
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                  <option value="parents">Parents</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#0a2342] cursor-pointer font-medium"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Posting…" : "Post Announcement"}
              </button>
            </div>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ announcement, onClose, onSave, loading }: {
  announcement: Announcement | null;
  onClose: () => void;
  onSave: (id: string, d: FormData) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<FormData>({ title: "", content: "", audience: "all", priority: "normal" });

  useEffect(() => {
    if (announcement) {
      setForm({
        title: announcement.title,
        content: announcement.content,
        audience: announcement.target_audience[0] || "all",
        priority: announcement.priority.toLowerCase(),
      });
    }
  }, [announcement]);

  return (
    <AnimatePresence>
      {announcement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <Edit className="w-4 h-4 text-gray-900" />
                </div>
                <h2 className="text-lg font-extrabold text-white">Edit Announcement</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={e => { e.preventDefault(); onSave(announcement._id, form); }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0a2342] focus:ring-2 focus:ring-[#0a2342]/10"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Content</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-[#0a2342] focus:ring-2 focus:ring-[#0a2342]/10"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Audience</label>
                  <select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#0a2342] cursor-pointer">
                    <option value="all">Everyone</option>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                    <option value="parents">Parents</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#0a2342] cursor-pointer">
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" disabled={loading}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteModal({ id, title, onClose, onConfirm, loading }: {
  id: string | null; title: string | null; onClose: () => void; onConfirm: () => void; loading: boolean;
}) {
  return (
    <AnimatePresence>
      {id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
          >
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Delete Announcement?</h3>
            <p className="text-sm text-gray-500 mb-6">
              "<span className="font-semibold text-gray-700">{title}</span>" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Keep It</button>
              <button onClick={onConfirm} disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                {loading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ announcement, index, onEdit, onDelete, onLike }: {
  announcement: Announcement;
  index: number;
  onEdit: (a: Announcement) => void;
  onDelete: (id: string, title: string) => void;
  onLike: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const priority = normPriority(announcement.priority);
  const pm = PRIORITY_META[priority] || PRIORITY_META.Normal;
  const PriorityIcon = pm.icon;
  const audience = (announcement.target_audience[0] || "all").toLowerCase();
  const audienceBadge = AUDIENCE_BADGE[audience] || AUDIENCE_BADGE.all;
  const authorName = announcement.author?.full_name || "School Admin";
  const grad = avatarGradient(authorName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
    >
      {/* Priority strip */}
      <div className={`h-1 ${pm.strip}`} />

      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0 shadow-md`}>
            <span className="text-white font-extrabold text-xs">{initials(authorName)}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{authorName}</p>
            <p className="text-xs text-gray-400">{format(new Date(announcement.createdAt), "MMM d, yyyy · h:mm a")}</p>
          </div>
        </div>

        {/* Priority badge */}
        <div className="flex items-center gap-2">
          <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${pm.badge}`}>
            <PriorityIcon className="w-3 h-3" /> {pm.label}
          </span>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(m => !m)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-8 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden"
                >
                  <button
                    onClick={() => { onEdit(announcement); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#0a2342]" /> Edit Post
                  </button>
                  <button
                    onClick={() => { onDelete(announcement._id, announcement.title); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-4">
        <h3 className="font-extrabold text-gray-900 mb-1.5 leading-snug break-words">{announcement.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{announcement.content}</p>

        {/* Audience badge */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${audienceBadge}`}>
            <Users className="w-3 h-3" />
            {audience.charAt(0).toUpperCase() + audience.slice(1)}
          </span>
          <span className={`sm:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${pm.badge}`}>
            <PriorityIcon className="w-3 h-3" /> {pm.label}
          </span>
        </div>
      </div>

      {/* Stats + Actions */}
      <div className="border-t border-gray-50 px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${pm.dot}`} />
            <span className="font-semibold text-gray-600">{announcement.likes}</span> likes
          </span>
          <span><span className="font-semibold text-gray-600">{announcement.comments}</span> comments</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike(announcement._id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              announcement.liked ? "text-red-600 bg-red-50" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${announcement.liked ? "fill-current" : ""}`} />
            Like
          </motion.button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> Comment
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const Announcements = () => {
  const queryClient = useQueryClient();
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => { const r = await api.get("/announcements"); return r.data; },
  });

  const createMutation = useMutation({
    mutationFn: (d: any) => api.post("/announcements", d),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/announcements/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["announcements"] }); setEditTarget(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/announcements/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["announcements"] }); setDeleteId(null); setDeleteTitle(null); },
  });

  const likeMutation = useMutation({
    mutationFn: (id: string) => api.post(`/announcements/${id}/like`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["announcements"] }),
  });

  const filtered = announcements.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "all" || normPriority(a.priority).toLowerCase() === priorityFilter;
    return matchSearch && matchPriority;
  });

  const highCount = announcements.filter(a => normPriority(a.priority) === "High").length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md">
                <Megaphone className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Community Feed</h1>
                <p className="text-white/50 text-sm">School announcements &amp; updates</p>
              </div>
            </div>

            {/* Stats chips */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-center">
                <p className="text-white font-extrabold text-lg leading-none">{announcements.length}</p>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-wide">Total</p>
              </div>
              {highCount > 0 && (
                <div className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/30 text-center">
                  <p className="text-red-300 font-extrabold text-lg leading-none">{highCount}</p>
                  <p className="text-red-300/70 text-[10px] font-bold uppercase tracking-wide">High Priority</p>
                </div>
              )}
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search announcements…"
                className="w-full pl-10 pr-4 h-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/20 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {["all", "high", "medium", "normal"].map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize ${
                    priorityFilter === p
                      ? "bg-yellow-400 text-gray-900 border-yellow-400"
                      : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                  }`}
                >
                  {p === "all" ? "All" : p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Compose (left sticky panel) */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <ComposeBox
                onSubmit={d => createMutation.mutate({ title: d.title, content: d.content, target_audience: [d.audience], priority: d.priority })}
                loading={createMutation.isPending}
              />

              {/* Quick info card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Priority Guide</p>
                <div className="space-y-2.5">
                  {Object.entries(PRIORITY_META).map(([key, m]) => {
                    const Icon = m.icon;
                    return (
                      <div key={key} className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${m.dot}`} />
                        <Icon className={`w-3.5 h-3.5 ${key === "High" ? "text-red-500" : key === "Medium" ? "text-amber-500" : "text-blue-500"}`} />
                        <span className="text-xs text-gray-600 font-medium">{key}</span>
                        <span className="ml-auto text-[10px] text-gray-400">
                          {announcements.filter(a => normPriority(a.priority) === key).length} posts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="lg:col-span-2 space-y-4">
            {filtered.length > 0 && (
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-gray-400 font-medium">{filtered.length} announcement{filtered.length !== 1 ? "s" : ""}</p>
                {(search || priorityFilter !== "all") && (
                  <button onClick={() => { setSearch(""); setPriorityFilter("all"); }} className="text-xs font-bold text-[#0a2342] flex items-center gap-1 hover:underline">
                    <X className="w-3 h-3" /> Clear filters
                  </button>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                <Megaphone className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="font-semibold text-gray-400">
                  {announcements.length === 0 ? "No announcements yet" : "No results match your filters"}
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((a, i) => (
                  <PostCard
                    key={a._id}
                    announcement={a}
                    index={i}
                    onEdit={setEditTarget}
                    onDelete={(id, title) => { setDeleteId(id); setDeleteTitle(title); }}
                    onLike={id => likeMutation.mutate(id)}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditModal
        announcement={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(id, d) => updateMutation.mutate({ id, data: { title: d.title, content: d.content, target_audience: [d.audience], priority: d.priority } })}
        loading={updateMutation.isPending}
      />
      <DeleteModal
        id={deleteId}
        title={deleteTitle}
        onClose={() => { setDeleteId(null); setDeleteTitle(null); }}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Announcements;

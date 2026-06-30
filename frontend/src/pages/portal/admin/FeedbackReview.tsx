import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  AlertCircle,
  X,
  CheckCircle2,
  Clock,
  Eye,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

type FeedbackCategory = "Appreciation" | "Suggestion" | "Complaint" | "Concern";
type FeedbackStatus = "read" | "unread" | "actioned";

interface Feedback {
  id: string;
  message: string;
  category: FeedbackCategory;
  date: string;
  status: FeedbackStatus;
  submittedBy?: { full_name?: string; email?: string; role?: string };
}

interface ApiFeedback {
  _id: string;
  message: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  createdAt: string;
  submitted_by?: { _id: string; full_name?: string; email?: string; role?: string };
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<FeedbackCategory, {
  icon: React.ElementType;
  strip: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  statBg: string;
  statText: string;
  emoji: string;
}> = {
  Appreciation: {
    icon: ThumbsUp,
    strip: "bg-green-500",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "bg-green-50 text-green-700 border-green-200",
    statBg: "bg-green-50 border-green-200",
    statText: "text-green-700",
    emoji: "😊",
  },
  Suggestion: {
    icon: Lightbulb,
    strip: "bg-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    statBg: "bg-blue-50 border-blue-200",
    statText: "text-blue-700",
    emoji: "💡",
  },
  Complaint: {
    icon: AlertTriangle,
    strip: "bg-red-500",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    badge: "bg-red-50 text-red-700 border-red-200",
    statBg: "bg-red-50 border-red-200",
    statText: "text-red-700",
    emoji: "😠",
  },
  Concern: {
    icon: AlertCircle,
    strip: "bg-amber-500",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    statBg: "bg-amber-50 border-amber-200",
    statText: "text-amber-700",
    emoji: "😟",
  },
};

const STATUS_META: Record<FeedbackStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  unread:   { label: "New",      bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  read:     { label: "Read",     bg: "bg-blue-100",   text: "text-blue-700",   icon: Eye },
  actioned: { label: "Actioned", bg: "bg-green-100",  text: "text-green-700",  icon: CheckCircle2 },
};

function StatusChip({ status }: { status: FeedbackStatus }) {
  const s = STATUS_META[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${s.bg} ${s.text}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </span>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ feedback, onClose, onMarkRead, onAction, loading }: {
  feedback: Feedback | null;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onAction: (id: string) => void;
  loading: boolean;
}) {
  if (!feedback) return null;
  const m = CATEGORY_META[feedback.category];
  const Icon = m.icon;

  return (
    <AnimatePresence>
      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${m.iconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-white font-extrabold">{feedback.category}</h2>
                    <p className="text-white/50 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {feedback.date}
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Submitter */}
              {feedback.submittedBy && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center shrink-0">
                    <span className="text-white font-extrabold text-xs">
                      {(feedback.submittedBy.full_name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{feedback.submittedBy.full_name || "Anonymous"}</p>
                    <p className="text-xs text-gray-400 capitalize">{feedback.submittedBy.role || feedback.submittedBy.email || ""}</p>
                  </div>
                  <StatusChip status={feedback.status} />
                </div>
              )}

              {/* Message */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-wrap">{feedback.message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {feedback.status === "unread" && (
                  <button
                    onClick={() => onMarkRead(feedback.id)}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> Mark as Read
                  </button>
                )}
                {feedback.status !== "actioned" && (
                  <button
                    onClick={() => { onAction(feedback.id); onClose(); }}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Actioned
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Feedback Card ────────────────────────────────────────────────────────────

function FeedbackCard({ feedback, index, onView }: {
  feedback: Feedback; index: number; onView: (f: Feedback) => void;
}) {
  const m = CATEGORY_META[feedback.category];
  const Icon = m.icon;
  const isNew = feedback.status === "unread";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onView(feedback)}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group ${
        isNew ? "border-yellow-300 ring-1 ring-yellow-300" : "border-gray-100"
      }`}
    >
      {/* Strip */}
      <div className={`h-1 ${m.strip}`} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl ${m.iconBg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${m.iconColor}`} />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-sm">{feedback.category}</p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-2.5 h-2.5" /> {feedback.date}
              </p>
            </div>
          </div>
          <StatusChip status={feedback.status} />
        </div>

        {/* Message preview */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 break-words mb-4">
          {feedback.message}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          {feedback.submittedBy ? (
            <p className="text-xs text-gray-400 font-medium truncate">
              {feedback.submittedBy.full_name || feedback.submittedBy.email || "Anonymous"}
            </p>
          ) : (
            <span className="text-xs text-gray-300 italic">Anonymous</span>
          )}
          <span className="flex items-center gap-1 text-xs font-bold text-[#0a2342] group-hover:gap-2 transition-all">
            View <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const FeedbackReview = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<Feedback | null>(null);

  const { data: feedbacks = [], isLoading, isError } = useQuery<Feedback[]>({
    queryKey: ["admin-feedback-review"],
    queryFn: async () => {
      const res = await api.get("/feedback");
      return (res.data || []).map((r: ApiFeedback) => ({
        id: r._id,
        message: r.message,
        category: r.category,
        date: format(new Date(r.createdAt), "MMM d, yyyy"),
        status: r.status,
        submittedBy: r.submitted_by,
      }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: FeedbackStatus }) =>
      api.put(`/feedback/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-feedback-review"] }),
  });

  const handleMarkRead = (id: string) => {
    updateMutation.mutate({ id, status: "read" });
    setSelected(p => p?.id === id ? { ...p, status: "read" } : p);
  };
  const handleAction = (id: string) => {
    updateMutation.mutate({ id, status: "actioned" });
    setSelected(p => p?.id === id ? { ...p, status: "actioned" } : p);
  };

  const filtered = feedbacks.filter(f => {
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    const matchCat = categoryFilter === "all" || f.category === categoryFilter;
    return matchStatus && matchCat;
  });

  const unreadCount = feedbacks.filter(f => f.status === "unread").length;

  const CATEGORIES: FeedbackCategory[] = ["Appreciation", "Suggestion", "Complaint", "Concern"];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md">
                <MessageSquare className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Feedback & Reviews</h1>
                <p className="text-white/50 text-sm">Manage community feedback from students, parents & teachers</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400/20 border border-yellow-400/40 rounded-xl self-start md:self-auto">
                <Clock className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-200 text-sm font-bold">{unreadCount} unread</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-5">

        {/* ── Category stat cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => {
            const m = CATEGORY_META[cat];
            const count = feedbacks.filter(f => f.category === cat).length;
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                className={`text-left bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md ${
                  categoryFilter === cat ? "ring-2 ring-[#0a2342]" : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                    <m.icon className={`w-5 h-5 ${m.iconColor}`} />
                  </div>
                  <span className="text-2xl">{m.emoji}</span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{count}</p>
                <p className="text-xs font-bold text-gray-400 mt-0.5">{cat}</p>
              </motion.button>
            );
          })}
        </div>

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Status tabs */}
          <div className="flex gap-2 flex-wrap">
            {["all", "unread", "read", "actioned"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all capitalize ${
                  statusFilter === s
                    ? "bg-[#0a2342] text-white border-[#0a2342]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {s === "all" ? "All Status" : s}
                {s !== "all" && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] ${statusFilter === s ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {feedbacks.filter(f => f.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Active category pill */}
          {categoryFilter !== "all" && (
            <button
              onClick={() => setCategoryFilter("all")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0a2342]/10 text-[#0a2342] border border-[#0a2342]/20 hover:bg-[#0a2342]/20 transition-colors"
            >
              <X className="w-3 h-3" /> {categoryFilter}
            </button>
          )}

          <span className="ml-auto text-xs text-gray-400 font-medium hidden sm:block">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Grid ──────────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-44 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-semibold text-gray-400">Could not load feedback</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-semibold text-gray-400">No feedback matches your filters</p>
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((f, i) => (
                <FeedbackCard key={f.id} feedback={f} index={i} onView={setSelected} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <DetailModal
        feedback={selected}
        onClose={() => setSelected(null)}
        onMarkRead={handleMarkRead}
        onAction={handleAction}
        loading={updateMutation.isPending}
      />
    </div>
  );
};

export default FeedbackReview;

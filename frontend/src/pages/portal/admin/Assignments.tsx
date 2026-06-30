import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Hourglass,
  Paperclip,
  Search,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import api from "@/lib/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

interface SubmissionItem {
  _id: string;
  status: "pending" | "submitted" | "graded";
  submission_text?: string;
  attachment_url?: string;
  submitted_at: string;
  marks_obtained?: number;
  feedback?: string;
  student: { _id?: string; name: string; email?: string };
}

interface AssignmentFeedItem {
  _id: string;
  title: string;
  description?: string;
  due_date: string;
  total_marks: number;
  createdAt: string;
  attachment_url?: string;
  teacher: { _id?: string; name: string; email?: string };
  class_name: string;
  subject_name: string;
  submission_count: number;
  graded_count: number;
  pending_grading_count: number;
  submissions: SubmissionItem[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-700 border-blue-200",
    graded:    "bg-green-100 text-green-700 border-green-200",
    pending:   "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold capitalize ${styles[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status === "graded" && <CheckCircle2 className="w-3 h-3" />}
      {status === "submitted" && <FileText className="w-3 h-3" />}
      {status === "pending" && <Hourglass className="w-3 h-3" />}
      {status}
    </span>
  );
}

function DueBadge({ date }: { date: string }) {
  const d = new Date(date);
  const overdue = isPast(d);
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${overdue ? "text-red-600" : "text-gray-500"}`}>
      <Calendar className="w-3.5 h-3.5" />
      {overdue ? "Overdue · " : "Due · "}
      {format(d, "MMM d, yyyy")}
    </span>
  );
}

const SUBJECT_COLORS = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-green-500 to-green-600",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
  "from-indigo-500 to-indigo-600",
  "from-teal-500 to-teal-600",
];

function subjectGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

// ─── Assignment Card ──────────────────────────────────────────────────────────

function AssignmentCard({ item, index }: { item: AssignmentFeedItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const gradient = subjectGradient(item.subject_name);
  const overdue = isPast(new Date(item.due_date));
  const submissionPct = item.submission_count > 0
    ? Math.round((item.graded_count / item.submission_count) * 100)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-5 md:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Teacher avatar */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md shrink-0`}>
              <span className="text-sm font-extrabold text-white">
                {item.teacher.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{item.teacher.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Class + Subject chips */}
          <div className="flex flex-wrap gap-1.5 justify-end">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${gradient}`}>
              {item.subject_name}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">
              {item.class_name}
            </span>
          </div>
        </div>

        {/* Title + description */}
        <h2 className="text-lg font-extrabold text-gray-900 leading-snug">{item.title}</h2>
        {item.description && (
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
        )}
        {item.attachment_url && (
          <a
            href={`${BASE_URL}${item.attachment_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-600 hover:underline font-medium"
          >
            <Paperclip className="w-3.5 h-3.5" /> View attachment
          </a>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-50">
          <DueBadge date={item.due_date} />
          <span className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            {item.total_marks} marks
          </span>
        </div>

        {/* Submission stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold text-blue-700">{item.submission_count}</p>
            <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wide mt-0.5">Submitted</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold text-green-700">{item.graded_count}</p>
            <p className="text-[10px] text-green-500 font-semibold uppercase tracking-wide mt-0.5">Graded</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-xl font-extrabold text-amber-700">{item.pending_grading_count}</p>
            <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wide mt-0.5">Pending</p>
          </div>
        </div>

        {/* Grading progress bar */}
        {item.submission_count > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-400 font-medium">Grading progress</span>
              <span className="text-[11px] font-bold text-gray-600">{submissionPct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${submissionPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Toggle submissions */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
        >
          <Users className="w-4 h-4" />
          {expanded ? "Hide" : "View"} Submissions ({item.submission_count})
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Submissions panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 bg-gray-50/60 px-5 md:px-6 py-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                Student Submissions
              </h3>

              {item.submissions.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {item.submissions.map((sub) => (
                    <div key={sub._id} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-white">
                              {sub.student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{sub.student.name}</p>
                            <p className="text-xs text-gray-400">
                              {format(new Date(sub.submitted_at), "MMM d · h:mm a")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusChip status={sub.status} />
                          {sub.status === "graded" && typeof sub.marks_obtained === "number" && (
                            <span className="text-xs font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                              {sub.marks_obtained}/{item.total_marks}
                            </span>
                          )}
                        </div>
                      </div>
                      {sub.submission_text && (
                        <p className="text-xs text-gray-500 mt-3 leading-relaxed bg-gray-50 rounded-lg p-2.5 line-clamp-3">
                          {sub.submission_text}
                        </p>
                      )}
                      {sub.feedback && (
                        <p className="text-xs text-blue-600 mt-2 italic">Feedback: {sub.feedback}</p>
                      )}
                      {sub.attachment_url && (
                        <a
                          href={`${BASE_URL}${sub.attachment_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-blue-500 hover:underline"
                        >
                          <Paperclip className="w-3 h-3" /> View attachment
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const AssignmentFeed = () => {
  const [search, setSearch] = useState("");

  const { data: assignments = [], isLoading, isError } = useQuery<AssignmentFeedItem[]>({
    queryKey: ["admin-assignment-feed"],
    queryFn: async () => {
      const res = await api.get("/assignments/admin/feed");
      return res.data?.data || [];
    },
  });

  const stats = useMemo(() => ({
    total: assignments.length,
    submissions: assignments.reduce((s, a) => s + a.submission_count, 0),
    graded: assignments.reduce((s, a) => s + a.graded_count, 0),
    pending: assignments.reduce((s, a) => s + a.pending_grading_count, 0),
  }), [assignments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      (a.description || "").toLowerCase().includes(q) ||
      a.teacher.name.toLowerCase().includes(q) ||
      a.class_name.toLowerCase().includes(q) ||
      a.subject_name.toLowerCase().includes(q)
    );
  }, [assignments, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5 text-gray-900" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Assignments Feed</h1>
              </div>
              <p className="text-white/50 text-sm">
                All assignments posted by teachers, with submissions and grading progress.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, teacher, class…"
                className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { label: "Assignments", value: stats.total, icon: FileText, color: "text-white" },
              { label: "Submissions", value: stats.submissions, icon: Users, color: "text-blue-300" },
              { label: "Graded", value: stats.graded, icon: CheckCircle2, color: "text-green-300" },
              { label: "Pending Review", value: stats.pending, icon: Hourglass, color: "text-amber-300" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                <div>
                  <p className="text-xl font-extrabold text-white">{value}</p>
                  <p className="text-xs text-white/50 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : isError ? (
          <div className="bg-white rounded-2xl border border-red-100 p-10 text-center">
            <p className="font-bold text-red-600">Could not load assignment feed.</p>
            <p className="text-sm text-gray-400 mt-1">Please try again in a moment.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-bold text-gray-600">
              {search ? "No assignments match your search." : "No assignments yet."}
            </p>
            <p className="text-sm text-gray-400 mt-1">Assignments posted by teachers will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((item, i) => (
              <AssignmentCard key={item._id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentFeed;

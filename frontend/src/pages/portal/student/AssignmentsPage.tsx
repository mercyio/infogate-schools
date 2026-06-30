import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow, isPast, differenceInHours } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Paperclip,
  Send,
  Star,
  Upload,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AssignmentItem {
  _id: string;
  title: string;
  description?: string;
  due_date?: string;
  total_marks?: number;
  attachment_url?: string;
  class_subject_id?: {
    subject_id?: { name?: string; code?: string };
    class_id?: { name?: string };
  };
  teacher_id?: { user_id?: { full_name?: string } };
}

interface Submission {
  _id: string;
  status: "pending" | "submitted" | "graded";
  submission_text?: string;
  attachment_url?: string;
  submitted_at?: string;
  marks_obtained?: number;
  feedback?: string;
}

type FilterTab = "all" | "pending" | "submitted" | "graded";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDueMeta(dueDate?: string): { label: string; color: string; urgent: boolean } {
  if (!dueDate) return { label: "No due date", color: "text-gray-400", urgent: false };
  const d = new Date(dueDate);
  if (isPast(d)) return { label: `Overdue ${formatDistanceToNow(d, { addSuffix: true })}`, color: "text-red-600", urgent: true };
  const hours = differenceInHours(d, new Date());
  if (hours < 24) return { label: `Due in ${hours}h`, color: "text-orange-600", urgent: true };
  return { label: `Due ${format(d, "MMM d, yyyy")}`, color: "text-gray-500", urgent: false };
}

const SUBJECT_GRADIENTS = [
  "from-blue-500 to-blue-600", "from-purple-500 to-violet-600",
  "from-green-500 to-emerald-600", "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-600", "from-cyan-500 to-teal-600",
  "from-indigo-500 to-blue-700", "from-lime-500 to-green-600",
];

function subjectGradient(name?: string) {
  if (!name) return SUBJECT_GRADIENTS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return SUBJECT_GRADIENTS[Math.abs(h) % SUBJECT_GRADIENTS.length];
}

// ─── Detail View ──────────────────────────────────────────────────────────────

function AssignmentDetail({ assignment, onBack }: { assignment: AssignmentItem; onBack: () => void }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { data: submission, isLoading: loadingSub } = useQuery<Submission | null>({
    queryKey: ["my-submission", assignment._id],
    queryFn: async () => {
      const res = await api.get(`/assignments/${assignment._id}/my-submission`);
      return res.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      if (text.trim()) form.append("submission_text", text.trim());
      if (file) form.append("file", file);
      return api.post(`/assignments/${assignment._id}/submit`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Assignment submitted!");
      setText("");
      setFile(null);
      qc.invalidateQueries({ queryKey: ["my-submission", assignment._id] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Submission failed"),
  });

  const subjectName = assignment.class_subject_id?.subject_id?.name;
  const gradient = subjectGradient(subjectName);
  const dueMeta = getDueMeta(assignment.due_date);
  const alreadySubmitted = submission && submission.status !== "pending";
  const isGraded = submission?.status === "graded";
  const scorePct = isGraded && typeof submission?.marks_obtained === "number" && assignment.total_marks
    ? Math.round((submission.marks_obtained / assignment.total_marks) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        <div className="relative z-10 px-4 py-6 md:py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to assignments
          </button>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {subjectName && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-3 backdrop-blur-sm">
                  <BookOpen className="w-3 h-3" /> {subjectName}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-snug">{assignment.title}</h1>
              {assignment.teacher_id?.user_id?.full_name && (
                <p className="text-white/60 text-sm mt-1.5">
                  Posted by {assignment.teacher_id.user_id.full_name}
                </p>
              )}
            </div>
            {/* Score circle if graded */}
            {isGraded && scorePct !== null && (
              <div className="shrink-0 w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex flex-col items-center justify-center backdrop-blur-sm">
                <span className="text-lg font-extrabold text-white leading-none">{scorePct}%</span>
                <span className="text-[9px] text-white/60 font-semibold">SCORE</span>
              </div>
            )}
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-3 mt-5">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-xl text-xs font-semibold text-white border border-white/20 ${dueMeta.urgent ? "border-red-300/60" : ""}`}>
              <Clock className="w-3.5 h-3.5" /> {dueMeta.label}
            </span>
            {assignment.total_marks !== undefined && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-xl text-xs font-semibold text-white border border-white/20">
                <Star className="w-3.5 h-3.5" /> {assignment.total_marks} marks
              </span>
            )}
            {submission && (
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-sm ${
                isGraded ? "bg-green-400/20 text-white border-green-300/40" :
                submission.status === "submitted" ? "bg-blue-400/20 text-white border-blue-300/40" :
                "bg-amber-400/20 text-white border-amber-300/40"
              }`}>
                {isGraded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                {isGraded ? "Graded" : "Submitted"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Description */}
        {assignment.description && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Instructions</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{assignment.description}</p>
            {assignment.attachment_url && (
              <a
                href={`${BASE_URL}${assignment.attachment_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Paperclip className="w-4 h-4" /> View attached file
              </a>
            )}
          </div>
        )}

        {/* Existing submission */}
        {!loadingSub && alreadySubmitted && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`px-6 py-4 ${isGraded ? "bg-green-50 border-b border-green-100" : "bg-blue-50 border-b border-blue-100"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-5 h-5 ${isGraded ? "text-green-600" : "text-blue-600"}`} />
                  <h3 className={`font-bold ${isGraded ? "text-green-800" : "text-blue-800"}`}>Your Submission</h3>
                </div>
                {isGraded && typeof submission!.marks_obtained === "number" && (
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-green-700">
                      {submission!.marks_obtained} <span className="text-sm font-semibold text-green-500">/ {assignment.total_marks}</span>
                    </p>
                  </div>
                )}
              </div>
              {submission!.submitted_at && (
                <p className="text-xs text-gray-400 mt-1">
                  Submitted {format(new Date(submission!.submitted_at), "MMM d, yyyy · h:mm a")}
                </p>
              )}
            </div>
            <div className="p-6 space-y-3">
              {submission!.submission_text && (
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
                  {submission!.submission_text}
                </p>
              )}
              {submission!.attachment_url && (
                <a
                  href={`${BASE_URL}${submission!.attachment_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
                >
                  <Paperclip className="w-4 h-4" /> Your attached file
                </a>
              )}
              {isGraded && submission!.feedback && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">Teacher Feedback</p>
                  <p className="text-sm text-green-800">{submission!.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submission form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-[#0a2342]/5 to-transparent">
            <h3 className="font-bold text-gray-900">
              {alreadySubmitted ? "Resubmit Assignment" : "Submit Your Work"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {alreadySubmitted ? "Your previous submission will be replaced." : "Write your answer or attach a file."}
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                Your Answer
              </label>
              <Textarea
                placeholder="Write your answer here…"
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="resize-none rounded-xl border-gray-200 focus:border-primary text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                Attachment <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-sm text-blue-700 font-medium truncate flex-1">{file.name}</span>
                  <button onClick={() => setFile(null)} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex flex-col items-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm font-medium">Click to attach a file</span>
                  <span className="text-xs text-gray-300">Image, Video, PDF, Word, PPT</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (!text.trim() && !file) { toast.error("Add an answer or attachment first"); return; }
                submitMutation.mutate();
              }}
              disabled={submitMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all shadow-md disabled:opacity-50 text-sm"
            >
              <Send className="w-4 h-4" />
              {submitMutation.isPending ? "Submitting…" : alreadySubmitted ? "Resubmit" : "Submit Assignment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Feed Card ────────────────────────────────────────────────────────────────

function AssignmentCard({
  item,
  index,
  submissionStatus,
  onClick,
}: {
  item: AssignmentItem;
  index: number;
  submissionStatus?: string;
  onClick: () => void;
}) {
  const subjectName = item.class_subject_id?.subject_id?.name;
  const gradient = subjectGradient(subjectName);
  const dueMeta = getDueMeta(item.due_date);
  const isSubmitted = submissionStatus && submissionStatus !== "pending";
  const isGraded = submissionStatus === "graded";

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group"
    >
      {/* Left color strip + content */}
      <div className="flex">
        <div className={`w-1.5 shrink-0 bg-gradient-to-b ${gradient}`} />
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Subject */}
              {subjectName && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold text-white rounded-md bg-gradient-to-r ${gradient} mb-2`}>
                  {subjectName}
                </span>
              )}
              <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</p>
              )}
            </div>

            {/* Status indicator */}
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              {isGraded ? (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-full border border-green-200">
                  <CheckCircle2 className="w-3 h-3" /> Graded
                </span>
              ) : isSubmitted ? (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-full border border-blue-200">
                  <FileText className="w-3 h-3" /> Submitted
                </span>
              ) : dueMeta.urgent ? (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded-full border border-red-200">
                  <AlertCircle className="w-3 h-3" /> Urgent
                </span>
              ) : null}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-50">
            <span className={`flex items-center gap-1 text-xs font-semibold ${dueMeta.color}`}>
              <Clock className="w-3.5 h-3.5" /> {dueMeta.label}
            </span>
            {item.total_marks !== undefined && (
              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Star className="w-3 h-3 text-amber-400" /> {item.total_marks} marks
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "submitted", label: "Submitted" },
  { key: "graded", label: "Graded" },
];

export default function AssignmentsPage() {
  const [selected, setSelected] = useState<AssignmentItem | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const { data: assignments = [], isLoading } = useQuery<AssignmentItem[]>({
    queryKey: ["student-assignments"],
    queryFn: async () => {
      const res = await api.get("/assignments");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Batch-fetch my submissions for each assignment
  const { data: mySubmissions = {} } = useQuery<Record<string, string>>({
    queryKey: ["my-all-submissions"],
    enabled: assignments.length > 0,
    queryFn: async () => {
      const results: Record<string, string> = {};
      await Promise.all(
        assignments.map(async (a) => {
          try {
            const res = await api.get(`/assignments/${a._id}/my-submission`);
            results[a._id] = res.data?.status || "pending";
          } catch {
            results[a._id] = "pending";
          }
        })
      );
      return results;
    },
  });

  const stats = {
    all: assignments.length,
    pending: assignments.filter((a) => !mySubmissions[a._id] || mySubmissions[a._id] === "pending").length,
    submitted: assignments.filter((a) => mySubmissions[a._id] === "submitted").length,
    graded: assignments.filter((a) => mySubmissions[a._id] === "graded").length,
  };

  const filtered = assignments.filter((a) => {
    if (activeTab === "all") return true;
    const status = mySubmissions[a._id] || "pending";
    return status === activeTab;
  });

  if (selected) {
    return <AssignmentDetail assignment={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 px-4 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="w-4 h-4 text-gray-900" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">My Assignments</h1>
          </div>
          <p className="text-white/50 text-sm ml-12">Track and submit your class assignments</p>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl px-3 py-2.5 text-center">
              <p className="text-xl font-extrabold text-white">{stats.all}</p>
              <p className="text-[11px] text-white/50 font-medium">Total</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2.5 text-center">
              <p className="text-xl font-extrabold text-blue-300">{stats.submitted}</p>
              <p className="text-[11px] text-white/50 font-medium">Submitted</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2.5 text-center">
              <p className="text-xl font-extrabold text-green-300">{stats.graded}</p>
              <p className="text-[11px] text-white/50 font-medium">Graded</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white shadow-md"
                  : "bg-white border border-gray-100 text-gray-500 hover:border-blue-200"
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {stats[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-bold text-gray-500">
              {activeTab === "all" ? "No assignments yet." : `No ${activeTab} assignments.`}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filtered.map((item, i) => (
                <AssignmentCard
                  key={item._id}
                  item={item}
                  index={i}
                  submissionStatus={mySubmissions[item._id]}
                  onClick={() => setSelected(item)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

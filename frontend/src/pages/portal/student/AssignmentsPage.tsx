import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  FileText, Clock, Upload, X, CheckCircle2, ChevronLeft, Paperclip, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";

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
  teacher_id?: {
    user_id?: { full_name?: string };
  };
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-700",
    graded: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function AssignmentDetail({
  assignment,
  onBack,
}: {
  assignment: AssignmentItem;
  onBack: () => void;
}) {
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
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Submission failed");
    },
  });

  const handleSubmit = () => {
    if (!text.trim() && !file) {
      toast.error("Write your answer or attach a file before submitting");
      return;
    }
    submitMutation.mutate();
  };

  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();
  const alreadySubmitted = submission && submission.status !== "pending";

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to assignments
      </button>

      {/* Assignment card */}
      <div className="playful-card p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{assignment.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {assignment.class_subject_id?.subject_id?.name}
              {assignment.teacher_id?.user_id?.full_name && (
                <> · {assignment.teacher_id.user_id.full_name}</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isOverdue && !alreadySubmitted && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">Overdue</span>
            )}
            {submission && <StatusBadge status={submission.status} />}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          {assignment.due_date && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              Due {format(new Date(assignment.due_date), "MMM d, yyyy · h:mm a")}
            </div>
          )}
          {assignment.total_marks !== undefined && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FileText className="w-4 h-4" />
              {assignment.total_marks} marks
            </div>
          )}
        </div>

        {assignment.description && (
          <div className="prose prose-sm max-w-none text-foreground border-t pt-4 whitespace-pre-wrap">
            {assignment.description}
          </div>
        )}

        {assignment.attachment_url && (
          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">ATTACHMENT</p>
            <a
              href={`${BASE_URL}${assignment.attachment_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary underline-offset-2 hover:underline"
            >
              <Paperclip className="w-4 h-4" /> View attached file
            </a>
          </div>
        )}
      </div>

      {/* Existing submission */}
      {!loadingSub && alreadySubmitted && (
        <div className="playful-card p-6 border-l-4 border-green-400 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Your Submission</h3>
            <StatusBadge status={submission!.status} />
          </div>
          {submission!.submitted_at && (
            <p className="text-xs text-muted-foreground">
              Submitted {format(new Date(submission!.submitted_at), "MMM d, yyyy · h:mm a")}
            </p>
          )}
          {submission!.submission_text && (
            <p className="text-sm whitespace-pre-wrap bg-muted/40 rounded-lg p-3">{submission!.submission_text}</p>
          )}
          {submission!.attachment_url && (
            <a
              href={`${BASE_URL}${submission!.attachment_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Paperclip className="w-4 h-4" /> View your attachment
            </a>
          )}
          {submission!.status === "graded" && (
            <div className="bg-green-50 rounded-xl p-4 space-y-1 border border-green-200">
              <p className="text-sm font-semibold text-green-800">
                Score: {submission!.marks_obtained} / {assignment.total_marks}
              </p>
              {submission!.feedback && (
                <p className="text-sm text-green-700">Feedback: {submission!.feedback}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submission form — always shown so student can resubmit */}
      {!isOverdue || alreadySubmitted ? null : null}
      <div className="playful-card p-6 space-y-4">
        <h3 className="font-semibold">
          {alreadySubmitted ? "Resubmit Assignment" : "Submit Assignment"}
        </h3>

        <div>
          <label className="text-sm font-medium mb-2 block">Your Answer</label>
          <Textarea
            placeholder="Write your answer here…"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Attachment <span className="text-muted-foreground font-normal">(optional — image, video, PDF, Word, PPT)</span>
          </label>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border">
              <Paperclip className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm truncate flex-1">{file.name}</span>
              <button onClick={() => setFile(null)}>
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors w-full justify-center"
            >
              <Upload className="w-4 h-4" /> Click to attach a file
            </button>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
          className="gap-2 w-full sm:w-auto"
        >
          <Send className="w-4 h-4" />
          {submitMutation.isPending ? "Submitting…" : alreadySubmitted ? "Resubmit" : "Submit Assignment"}
        </Button>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const [selected, setSelected] = useState<AssignmentItem | null>(null);

  const { data: assignments = [], isLoading } = useQuery<AssignmentItem[]>({
    queryKey: ["student-assignments"],
    queryFn: async () => {
      const res = await api.get("/assignments");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  if (selected) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <AssignmentDetail assignment={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-muted-foreground text-sm mt-1">Your class assignments</p>
      </motion.div>

      {isLoading && (
        <div className="py-20 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {!isLoading && assignments.length === 0 && (
        <div className="playful-card p-10 text-center text-muted-foreground">
          <FileText className="mx-auto mb-3 opacity-40" size={36} />
          <p>No assignments yet.</p>
        </div>
      )}

      <AnimatePresence>
        <div className="space-y-3">
          {assignments.map((item, i) => {
            const isOverdue = item.due_date && new Date(item.due_date) < new Date();
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="playful-card p-4 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelected(item)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.class_subject_id?.subject_id?.name}
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  {item.due_date && (
                    <p className={`text-xs font-semibold ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                      {isOverdue ? "Overdue · " : "Due · "}
                      {format(new Date(item.due_date), "MMM d, yyyy")}
                    </p>
                  )}
                  {item.total_marks !== undefined && (
                    <p className="text-xs text-muted-foreground">{item.total_marks} marks</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}

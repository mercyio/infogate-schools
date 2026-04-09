import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, FileText, Search, UserCheck, CalendarDays, ChevronDown, ChevronUp, CircleCheck, Hourglass } from "lucide-react";
import api from "@/lib/api";

interface SubmissionItem {
  _id: string;
  status: "pending" | "submitted" | "graded";
  submission_text?: string;
  attachment_url?: string;
  submitted_at: string;
  marks_obtained?: number;
  feedback?: string;
  graded_at?: string;
  student: {
    _id?: string;
    name: string;
    email?: string;
  };
}

interface AssignmentFeedItem {
  _id: string;
  title: string;
  description?: string;
  due_date: string;
  total_marks: number;
  createdAt: string;
  teacher: {
    _id?: string;
    name: string;
    email?: string;
  };
  class_name: string;
  subject_name: string;
  submission_count: number;
  graded_count: number;
  pending_grading_count: number;
  submissions: SubmissionItem[];
}

const AssignmentFeed = () => {
  const [search, setSearch] = useState("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const { data: assignments = [], isLoading, isError } = useQuery<AssignmentFeedItem[]>({
    queryKey: ["admin-assignment-feed"],
    queryFn: async () => {
      const res = await api.get("/assignments/admin/feed");
      return res.data?.data || [];
    },
  });

  const filteredAssignments = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) {
      return assignments;
    }

    return assignments.filter((assignment) => {
      return (
        assignment.title.toLowerCase().includes(needle) ||
        (assignment.description || "").toLowerCase().includes(needle) ||
        assignment.teacher.name.toLowerCase().includes(needle) ||
        assignment.class_name.toLowerCase().includes(needle) ||
        assignment.subject_name.toLowerCase().includes(needle)
      );
    });
  }, [assignments, search]);

  const toggleExpanded = (assignmentId: string) => {
    setExpandedCardId((current) => (current === assignmentId ? null : assignmentId));
  };

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Assignments Feed</h1>
              <p className="text-muted-foreground mt-1">
                View all assignment posts by teachers, submissions by students, and grading progress.
              </p>
            </div>
            <div className="w-full max-w-md relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                placeholder="Search assignment, teacher, class, or subject"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="playful-card p-10 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="playful-card p-10 text-center">
              <p className="text-destructive font-semibold">Could not load assignment feed.</p>
              <p className="text-sm text-muted-foreground mt-1">Please try again in a moment.</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="playful-card p-10 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold">No assignments found.</p>
              <p className="text-sm text-muted-foreground mt-1">Assignments posted by teachers will show here.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredAssignments.map((assignment, index) => {
                const expanded = expandedCardId === assignment._id;

                return (
                  <motion.article
                    key={assignment._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="playful-card p-6"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex gap-3">
                          <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold shrink-0">
                            {assignment.teacher.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold leading-none">{assignment.teacher.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Posted {new Date(assignment.createdAt).toLocaleString()}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary">{assignment.subject_name}</Badge>
                              <Badge variant="outline">{assignment.class_name}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-primary/15 text-primary border-primary/20" variant="outline">
                            <FileText className="w-3 h-3 mr-1" />
                            {assignment.submission_count} submissions
                          </Badge>
                          <Badge className="bg-secondary/15 text-secondary border-secondary/20" variant="outline">
                            <CircleCheck className="w-3 h-3 mr-1" />
                            {assignment.graded_count} graded
                          </Badge>
                          <Badge className="bg-coral/15 text-coral border-coral/20" variant="outline">
                            <Hourglass className="w-3 h-3 mr-1" />
                            {assignment.pending_grading_count} pending
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold">{assignment.title}</h2>
                        {assignment.description ? (
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{assignment.description}</p>
                        ) : null}
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="bg-muted/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className="font-semibold flex items-center gap-1 mt-1">
                            <CalendarDays className="w-4 h-4 text-primary" />
                            {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">Total Marks</p>
                          <p className="font-semibold mt-1">{assignment.total_marks}</p>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">Teacher Email</p>
                          <p className="font-semibold mt-1 break-all">{assignment.teacher.email || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" onClick={() => toggleExpanded(assignment._id)}>
                          <UserCheck className="w-4 h-4 mr-2" />
                          View Submissions
                          {expanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                        </Button>
                      </div>

                      {expanded ? (
                        <div className="border border-primary/15 rounded-2xl p-4 bg-muted/20">
                          <h3 className="font-semibold mb-3">Student Submissions</h3>
                          {assignment.submissions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No students have submitted this assignment yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {assignment.submissions.map((submission) => (
                                <div key={submission._id} className="bg-card border border-border rounded-xl p-4">
                                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                    <div>
                                      <p className="font-semibold">{submission.student.name}</p>
                                      <p className="text-xs text-muted-foreground">{submission.student.email || "No email"}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Submitted {new Date(submission.submitted_at).toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="outline">{submission.status}</Badge>
                                      <Badge
                                        variant="outline"
                                        className={submission.status === "graded" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}
                                      >
                                        Grade: {typeof submission.marks_obtained === "number" ? `${submission.marks_obtained}/${assignment.total_marks}` : "Not graded"}
                                      </Badge>
                                    </div>
                                  </div>

                                  {submission.submission_text ? (
                                    <p className="text-sm mt-3 leading-relaxed">{submission.submission_text}</p>
                                  ) : null}

                                  {submission.feedback ? (
                                    <p className="text-sm mt-2 text-muted-foreground">
                                      Teacher Feedback: {submission.feedback}
                                    </p>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AssignmentFeed;

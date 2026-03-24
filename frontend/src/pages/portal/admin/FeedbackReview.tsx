import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Calendar,
  Bell,
  ArrowLeft,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  AlertCircle,
  X,
  Filter,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

// Types
interface Feedback {
  id: number;
  message: string;
  category: "Appreciation" | "Suggestion" | "Complaint" | "Concern";
  date: string;
  status: "read" | "unread" | "actioned";
}

// Constants
const FEEDBACK_ITEMS: Feedback[] = [
  {
    id: 1,
    message:
      "The new cafeteria menu is excellent! My child loves the healthy options and the variety available.",
    category: "Appreciation",
    date: "2024-01-15",
    status: "read",
  },
  {
    id: 2,
    message:
      "Please consider adding more extracurricular activities in the afternoons, especially sports programs.",
    category: "Suggestion",
    date: "2024-01-14",
    status: "unread",
  },
  {
    id: 3,
    message:
      "The school bus was late three times this week. Please look into this urgently.",
    category: "Complaint",
    date: "2024-01-13",
    status: "actioned",
  },
  {
    id: 4,
    message:
      "Thank you for the wonderful science fair! The students worked so hard and it was inspiring.",
    category: "Appreciation",
    date: "2024-01-12",
    status: "read",
  },
  {
    id: 5,
    message:
      "Could we have parent-teacher meetings in the evenings for working parents? This would help many.",
    category: "Suggestion",
    date: "2024-01-11",
    status: "unread",
  },
  {
    id: 6,
    message:
      "The homework load seems too much for Primary 3 students. They are stressed every evening.",
    category: "Concern",
    date: "2024-01-10",
    status: "actioned",
  },
  {
    id: 7,
    message:
      "Great job on the Christmas concert! The children performed beautifully and looked very happy.",
    category: "Appreciation",
    date: "2024-01-08",
    status: "read",
  },
];

const CATEGORY_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  Appreciation: {
    icon: ThumbsUp,
    color: "text-slate-700",
    bgColor: "bg-white border-l-4 border-slate-300",
  },
  Suggestion: {
    icon: Lightbulb,
    color: "text-slate-700",
    bgColor: "bg-white border-l-4 border-slate-300",
  },
  Complaint: {
    icon: AlertTriangle,
    color: "text-slate-700",
    bgColor: "bg-white border-l-4 border-slate-300",
  },
  Concern: {
    icon: AlertCircle,
    color: "text-slate-700",
    bgColor: "bg-white border-l-4 border-slate-300",
  },
};

// Components
const PageHeader = () => (
  <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-slate-200/50 shadow-sm">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900">Feedback Review</h1>
          <p className="text-xs text-slate-500">
            Anonymous feedback from community
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

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterTabs = ({ activeFilter, onFilterChange }: FilterTabsProps) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-2">
    {["all", "unread", "read", "actioned"].map((filter) => (
      <motion.button
        key={filter}
        onClick={() => onFilterChange(filter)}
        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
          activeFilter === filter
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {filter.charAt(0).toUpperCase() + filter.slice(1)}
      </motion.button>
    ))}
  </div>
);

interface FeedbackDetailModalProps {
  feedback: Feedback | null;
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
  onTakeAction: (id: number) => void;
}

const FeedbackDetailModal = ({
  feedback,
  onClose,
  onMarkAsRead,
  onTakeAction,
}: FeedbackDetailModalProps) => {
  if (!feedback) return null;

  const categoryConfig = CATEGORY_CONFIG[feedback.category];
  const CategoryIcon = categoryConfig.icon;

  return (
    <AnimatePresence>
      {feedback && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200/50"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-slate-100`}>
                  <CategoryIcon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    {feedback.category}
                  </h2>
                  <p className="text-xs text-slate-500">{feedback.date}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div>
                <p className="text-slate-700 leading-relaxed text-base">
                  {feedback.message}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                <span className="text-sm font-semibold text-slate-600">
                  Status:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700`}
                >
                  {feedback.status.charAt(0).toUpperCase() +
                    feedback.status.slice(1)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                {feedback.status === "unread" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onMarkAsRead(feedback.id)}
                    className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Mark as Read
                  </motion.button>
                )}
                {feedback.status !== "actioned" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onTakeAction(feedback.id);
                      onClose();
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                  >
                    Take Action
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface FeedbackCardProps {
  feedback: Feedback;
  index: number;
  onView: (feedback: Feedback) => void;
}

const FeedbackCard = ({ feedback, index, onView }: FeedbackCardProps) => {
  const categoryConfig = CATEGORY_CONFIG[feedback.category];
  const CategoryIcon = categoryConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      onClick={() => onView(feedback)}
      className={`group cursor-pointer rounded-xl p-5 hover:shadow-lg transition-all ${
        categoryConfig.bgColor
      } ${
        feedback.status === "unread"
          ? "ring-2 ring-slate-400 ring-offset-2 ring-offset-white"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded-lg bg-slate-100`}>
            <CategoryIcon className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{feedback.category}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {feedback.date}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
            feedback.status === "unread"
              ? "bg-slate-200 text-slate-700"
              : feedback.status === "actioned"
              ? "bg-slate-100 text-slate-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {feedback.status === "unread"
            ? "New"
            : feedback.status === "actioned"
            ? "Done"
            : "Read"}
        </span>
      </div>

      <p className="text-slate-700 text-sm leading-relaxed line-clamp-2 mb-3">
        {feedback.message}
      </p>

      <div className="flex items-center text-xs text-slate-500 group-hover:text-blue-600 transition-colors">
        <MessageSquare className="w-3 h-3 mr-1" />
        Click to read full feedback
      </div>
    </motion.div>
  );
};

// Main Component
const FeedbackReview = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(FEEDBACK_ITEMS);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  const filteredFeedback =
    activeFilter === "all"
      ? feedbacks
      : feedbacks.filter((item) => item.status === activeFilter);

  const handleMarkAsRead = (id: number) => {
    setFeedbacks(
      feedbacks.map((f) => (f.id === id ? { ...f, status: "read" } : f))
    );
  };

  const handleTakeAction = (id: number) => {
    setFeedbacks(
      feedbacks.map((f) => (f.id === id ? { ...f, status: "actioned" } : f))
    );
  };

  const stats = [
    { label: "Total", value: feedbacks.length },
    {
      label: "Unread",
      value: feedbacks.filter((f) => f.status === "unread").length,
    },
    {
      label: "Actioned",
      value: feedbacks.filter((f) => f.status === "actioned").length,
    },
  ];

  const feelings = [
    {
      name: "Appreciation",
      emoji: "😊",
      count: feedbacks.filter((f) => f.category === "Appreciation").length,
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      name: "Suggestion",
      emoji: "💡",
      count: feedbacks.filter((f) => f.category === "Suggestion").length,
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      name: "Complaint",
      emoji: "😠",
      count: feedbacks.filter((f) => f.category === "Complaint").length,
      color: "bg-red-50 border-red-200",
      textColor: "text-red-700",
    },
    {
      name: "Concern",
      emoji: "😟",
      count: feedbacks.filter((f) => f.category === "Concern").length,
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <PageHeader />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              Feedback & Reviews
            </h2>
            <p className="text-slate-600 mt-1">
              Review and manage feedback from parents and community members
            </p>
          </div>

          {/* Feelings Section */}
          <div className="mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {feelings.map((feeling, index) => (
                <motion.div
                  key={feeling.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className={`rounded-lg p-4 border ${feeling.color} hover:shadow-md transition-all`}
                >
                  <div className="text-3xl mb-2">{feeling.emoji}</div>
                  <p className={`text-sm font-semibold ${feeling.textColor}`}>
                    {feeling.name}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {feeling.count}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-slate-600" />
              <span className="font-semibold text-slate-900 text-sm">
                Filter by Status
              </span>
            </div>
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* Feedback Cards */}
          {filteredFeedback.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredFeedback.map((feedback, index) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    index={index}
                    onView={setSelectedFeedback}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-xl p-12 text-center"
            >
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-700 font-semibold">No feedback found</p>
              <p className="text-slate-500 text-sm">
                Try adjusting your filters
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Feedback Detail Modal */}
      <FeedbackDetailModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onMarkAsRead={handleMarkAsRead}
        onTakeAction={handleTakeAction}
      />
    </div>
  );
};

export default FeedbackReview;

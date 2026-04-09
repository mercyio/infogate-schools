import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Bell,
  LogOut,
  ArrowLeft,
  Download,
  Printer,
  Plus,
  Trash2,
  FileText,
  Calendar,
  Filter,
  Eye,
} from "lucide-react";
import { useState } from "react";

// Sample classes
const classes = [
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "All Classes",
];

// Sample subjects
const subjects = [
  "Mathematics",
  "English Language",
  "Science",
  "Social Studies",
  "Computer Science",
  "Physical Education",
  "All Subjects",
];

// Sample metrics
const availableMetrics = [
  { id: "attendance", name: "Attendance Rate", category: "Student" },
  { id: "grades", name: "Student Grades", category: "Academic" },
  { id: "enrollment", name: "Enrollment Numbers", category: "Enrollment" },
  { id: "performance", name: "Class Performance", category: "Academic" },
  { id: "fees", name: "Fee Collection", category: "Financial" },
  { id: "teacher_rating", name: "Teacher Ratings", category: "Teacher" },
  { id: "completion", name: "Assignment Completion", category: "Academic" },
  { id: "retention", name: "Student Retention", category: "Enrollment" },
];

// Sample report results
const sampleReportData = [
  { class: "Grade 5", metric: "Attendance Rate", value: "93.75%", trend: "+2.1%" },
  { class: "Grade 4", metric: "Attendance Rate", value: "93.02%", trend: "+1.8%" },
  { class: "Grade 3", metric: "Attendance Rate", value: "91.67%", trend: "+1.5%" },
];

const CustomReport = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [includeComparison, setIncludeComparison] = useState(false);

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId]
    );
  };

  const removeMetric = (metricId: string) => {
    setSelectedMetrics((prev) => prev.filter((id) => id !== metricId));
  };

  const handleGenerateReport = () => {
    if (selectedMetrics.length === 0) {
      alert("Please select at least one metric");
      return;
    }
    setReportGenerated(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ["CUSTOM REPORT"],
      ["Generated: " + new Date().toLocaleDateString()],
      ["Date Range: " + (startDate || "All") + " to " + (endDate || "All")],
      ["Class: " + selectedClass],
      ["Subject: " + selectedSubject],
      ["Metrics: " + selectedMetrics.map((id) => availableMetrics.find((m) => m.id === id)?.name).join(", ")],
      [],
      ["CLASS", "METRIC", "VALUE", "TREND"],
      ...sampleReportData.map((item) => [item.class, item.metric, item.value, item.trend]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    element.setAttribute("download", `custom-report-${new Date().getTime()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary/5">

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back Button */}
          <Link to="/portal/admin/reports" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>

          {/* Report Header */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Custom Report Generator</h1>
                <p className="text-slate-600 mt-1">Create reports with specific criteria tailored to your needs</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Date Range */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Date Range
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 rounded-lg border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-10 rounded-lg border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Class Selection */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-600" />
                  Class
                </h3>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* Subject Selection */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-green-600" />
                  Subject
                </h3>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              {/* Options */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Options</h3>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeComparison}
                    onChange={(e) => setIncludeComparison(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span className="text-sm font-medium text-slate-700">Include Comparison</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGenerateReport}
                  disabled={selectedMetrics.length === 0}
                  className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                {reportGenerated && (
                  <>
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="w-full h-11 rounded-lg border-slate-300 text-slate-700"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="w-full h-11 rounded-lg border-slate-300 text-slate-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </Button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Metrics Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Available Metrics */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  Select Metrics
                </h3>
                <div className="space-y-3">
                  {availableMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      onClick={() => toggleMetric(metric.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedMetrics.includes(metric.id)
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{metric.name}</p>
                          <p className="text-xs text-slate-600 mt-1">{metric.category}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedMetrics.includes(metric.id)}
                          onChange={() => {}}
                          className="w-5 h-5 rounded border-slate-300 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Metrics Summary */}
              {selectedMetrics.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Selected Metrics ({selectedMetrics.length})</h3>
                  <div className="space-y-2">
                    {selectedMetrics.map((metricId) => {
                      const metric = availableMetrics.find((m) => m.id === metricId);
                      return (
                        <div key={metricId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div>
                            <p className="font-medium text-slate-900">{metric?.name}</p>
                            <p className="text-xs text-slate-600">{metric?.category}</p>
                          </div>
                          <button
                            onClick={() => removeMetric(metricId)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Report Preview */}
          {reportGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Preview</h2>
                  <p className="text-slate-600">
                    Class: <span className="font-semibold">{selectedClass}</span> | Subject: <span className="font-semibold">{selectedSubject}</span>
                  </p>
                  {(startDate || endDate) && (
                    <p className="text-slate-600 mt-1">
                      Date Range: <span className="font-semibold">{startDate || "N/A"} to {endDate || "N/A"}</span>
                    </p>
                  )}
                </div>

                {/* Report Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Class</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Metric</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Value</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleReportData.map((row, index) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.class}</td>
                          <td className="px-6 py-4 text-sm text-slate-700">{row.metric}</td>
                          <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">
                            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">{row.value}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-green-700">{row.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-indigo-700 font-semibold mb-1">Total Metrics</p>
                    <p className="text-2xl font-bold text-indigo-600">{selectedMetrics.length}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Classes Included</p>
                    <p className="text-2xl font-bold text-blue-600">6</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700 font-semibold mb-1">Records Generated</p>
                    <p className="text-2xl font-bold text-green-600">18</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Help Section */}
          {!reportGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-gradient-to-r from-indigo-500/10 via-primary/5 to-blue-500/10 p-8 rounded-xl border border-slate-200"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">How to Generate a Custom Report</h3>
              <ol className="space-y-3 text-slate-700">
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600 min-w-6">1.</span>
                  <span>Set your desired <strong>date range</strong> (optional - leave empty for all dates)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600 min-w-6">2.</span>
                  <span>Select the <strong>class</strong> and <strong>subject</strong> to filter by</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600 min-w-6">3.</span>
                  <span>Choose one or more <strong>metrics</strong> you want to analyze from the available options</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600 min-w-6">4.</span>
                  <span>Click <strong>"Generate Report"</strong> to preview your custom report</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600 min-w-6">5.</span>
                  <span><strong>Print</strong> or <strong>download</strong> your report in CSV format</span>
                </li>
              </ol>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomReport;

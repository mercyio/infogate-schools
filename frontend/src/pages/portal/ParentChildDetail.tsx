import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Calendar, Clock,
  BookOpen, CreditCard, Award, CheckCircle,
  AlertCircle, XCircle, FileText, X, Banknote, Download,
  TrendingUp, ChevronRight,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format, isPast } from "date-fns";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { toast } from "sonner";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const sf = (obj: any, path: string) => path.split(".").reduce((acc, p) => acc && acc[p], obj);

const TABS = [
  { key: "fees",    label: "Fees",    icon: CreditCard },
  { key: "school",  label: "School",  icon: BookOpen   },
  { key: "results", label: "Results", icon: Award      },
  { key: "info",    label: "Info",    icon: User       },
] as const;

type Tab = typeof TABS[number]["key"];

const ParentChildDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const todayIndex = new Date().getDay();

  const [activeTab, setActiveTab] = useState<Tab>("fees");
  const [payModal, setPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("");
  const [payDesc, setPayDesc] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const payMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/users/students/${studentId}/payments`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["child-detail", studentId] });
      queryClient.invalidateQueries({ queryKey: ["child-fees", studentId] });
      toast.success("Payment recorded successfully!");
      setPayModal(false);
      setPayAmount(""); setPayMethod(""); setPayDesc("");
    },
    onError: () => toast.error("Payment failed. Please try again."),
  });

  const { data: raw, isLoading } = useQuery({
    queryKey: ["child-detail", studentId],
    queryFn: async () => { const res = await api.get(`/users/students/${studentId}`); return res.data; },
    enabled: !!studentId,
  });

  const classLevel = sf(raw, "class_id.level");

  const { data: timetables = [] } = useQuery({
    queryKey: ["child-timetable", classLevel],
    enabled: !!classLevel,
    queryFn: async () => { const res = await api.get(`/timetables?level=${classLevel}`); return Array.isArray(res.data) ? res.data : []; },
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["child-assignments", classLevel],
    enabled: !!classLevel,
    queryFn: async () => { const res = await api.get("/assignments"); return Array.isArray(res.data) ? res.data : []; },
  });

  const { data: attendanceRecords = [] } = useQuery({
    queryKey: ["child-attendance", studentId],
    enabled: !!studentId,
    queryFn: async () => { const res = await api.get(`/attendance?student_id=${studentId}`); return Array.isArray(res.data) ? res.data : []; },
  });

  const { data: feeData } = useQuery({
    queryKey: ["child-fees", studentId],
    enabled: !!studentId,
    queryFn: async () => { const res = await api.get(`/fees/student/${studentId}`); return res.data; },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <div className="flex justify-center py-24">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    </div>
  );

  if (!raw) return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <div className="flex items-center justify-center py-20">
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100 max-w-sm mx-4">
          <p className="font-extrabold text-gray-700 text-lg">Could not load profile</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold">Go Back</button>
        </div>
      </div>
    </div>
  );

  // ── Derived data ──
  const name       = sf(raw, "user_id.full_name") || raw.full_name || "Student";
  const admNo      = raw.admission_number || "—";
  const cls        = sf(raw, "class_id.name") || "—";
  const level      = sf(raw, "class_id.level") || "—";
  const gender     = sf(raw, "user_id.gender") || raw.gender || "—";
  const dob        = raw.date_of_birth ? String(raw.date_of_birth).split("T")[0] : "—";
  const address    = raw.address || "—";
  const parentName  = raw.parent_name || "—";
  const parentPhone = raw.parent_phone || "—";
  const parentEmail = raw.parent_email || "—";
  const initials   = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  // Fees
  const classFeeStructure  = feeData?.class_fee_structure ?? null;
  const currentTermTotal   = feeData?.current_term_total ?? 0;
  const totalPaid          = feeData?.paid_fees ?? 0;
  const outstandingCarried = feeData?.outstanding_carried ?? 0;
  const totalOutstanding   = feeData?.total_outstanding ?? 0;
  const paymentHistory: any[] = feeData?.payment_history ?? raw?.payment_history ?? [];
  const paymentProgress = currentTermTotal > 0 ? Math.min(100, Math.round((totalPaid / currentTermTotal) * 100)) : 0;

  // Attendance
  const present      = attendanceRecords.filter((r: any) => r.status === "present").length;
  const late         = attendanceRecords.filter((r: any) => r.status === "late").length;
  const absent       = attendanceRecords.filter((r: any) => r.status === "absent").length;
  const totalDays    = attendanceRecords.length;
  const attendanceRate = totalDays > 0 ? Math.round(((present + late) / totalDays) * 100) : 0;

  // Timetable
  const todaysClasses = timetables
    .filter((t: any) => t.day_of_week === todayIndex)
    .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));

  // Results
  const academicResults: any[] = Array.isArray(raw.academic_performance) ? raw.academic_performance : [];

  const schoolName = import.meta.env.VITE_SCHOOL_NAME || "School";

  const filteredHistory = paymentHistory.filter((p: any) => {
    const d = p.date ? new Date(p.date) : null;
    if (!d) return true;
    if (filterFrom && d < new Date(filterFrom)) return false;
    if (filterTo && d > new Date(filterTo + "T23:59:59")) return false;
    return true;
  });

  const downloadPaymentHistory = () => {
    const rows = filteredHistory.map((p: any, i: number) => `
      <tr>
        <td>${i + 1}</td>
        <td>${p.date ? format(new Date(p.date), "dd MMM yyyy") : "—"}</td>
        <td>${p.description || "Payment"}</td>
        <td style="text-transform:capitalize">${p.method || "—"}</td>
        <td>${p.reference || "—"}</td>
        <td class="amount green">₦${(Number(p.amount) || 0).toLocaleString()}</td>
        <td class="amount ${(Number(p.outstanding_after) || 0) > 0 ? "red" : "green"}">₦${(Number(p.outstanding_after) || 0).toLocaleString()}</td>
      </tr>`).join("");

    const total = filteredHistory.reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0);
    const dateRange = filterFrom || filterTo
      ? `${filterFrom ? format(new Date(filterFrom), "dd MMM yyyy") : "—"}  –  ${filterTo ? format(new Date(filterTo), "dd MMM yyyy") : "—"}`
      : "All Dates";
    const refNo = "TXR-" + Date.now().toString().slice(-8);

    const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"/>
<title>Transaction Transcript – ${name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #1a1a2e; background: #fff; font-size: 13px; }

  /* ── Page shell ── */
  .page { max-width: 860px; margin: 0 auto; padding: 0; }

  /* ── School header band ── */
  .school-header {
    background: #0a2342;
    padding: 28px 40px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .school-header .name {
    color: #fff;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .school-header .tagline {
    color: rgba(255,255,255,0.45);
    font-size: 11px;
    margin-top: 3px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .school-header .ref-block { text-align: right; }
  .school-header .ref-block .label {
    color: rgba(255,255,255,0.45);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .school-header .ref-block .value {
    color: #facc15;
    font-size: 13px;
    font-weight: 700;
    margin-top: 2px;
  }

  /* ── Yellow accent strip ── */
  .accent-strip { height: 4px; background: #facc15; }

  /* ── Document title ── */
  .doc-title {
    background: #f8fafc;
    padding: 18px 40px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .doc-title h1 {
    font-size: 15px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #0a2342;
  }
  .doc-title .meta { font-size: 11px; color: #94a3b8; }

  /* ── Body ── */
  .body { padding: 32px 40px; }

  /* ── Info grid ── */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 28px;
  }
  .info-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px 18px;
  }
  .info-card .card-title {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }
  .info-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .info-row:last-child { margin-bottom: 0; }
  .info-label { color: #64748b; font-size: 12px; }
  .info-value { font-weight: 600; font-size: 12px; color: #1a1a2e; text-align: right; }

  /* ── Fee summary card ── */
  .fee-summary {
    background: #0a2342;
    border-radius: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    overflow: hidden;
    margin-bottom: 28px;
  }
  .fee-cell {
    padding: 16px 20px;
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .fee-cell:last-child { border-right: none; background: rgba(250,204,21,0.12); }
  .fee-cell .fc-label { color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  .fee-cell .fc-value { color: #fff; font-size: 18px; font-weight: 800; }
  .fee-cell:last-child .fc-label { color: #facc15; }
  .fee-cell:last-child .fc-value { color: #facc15; }
  .fc-value.red { color: #fca5a5 !important; }

  /* ── Section heading ── */
  .section-heading {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #94a3b8;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
  }

  /* ── Transaction table ── */
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  thead tr { background: #0a2342; }
  thead th {
    padding: 10px 12px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  tbody tr { border-bottom: 1px solid #f1f5f9; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  tbody td { padding: 10px 12px; color: #374151; vertical-align: middle; }
  .amount { font-weight: 700; text-align: right; }
  .green { color: #15803d; }
  .red { color: #dc2626; }
  thead th:last-child, thead th:nth-last-child(2) { text-align: right; }

  /* ── Totals row ── */
  .totals-row { background: #0a2342 !important; border: none !important; }
  .totals-row td {
    padding: 12px 12px;
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    border: none;
  }
  .totals-row td.amount { color: #facc15; font-size: 14px; }

  /* ── Footer ── */
  .footer {
    margin-top: 36px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .footer .note { font-size: 10px; color: #94a3b8; max-width: 340px; line-height: 1.5; }
  .footer .stamp { text-align: right; }
  .footer .stamp .stamp-line { width: 140px; border-top: 1px solid #cbd5e1; margin-left: auto; margin-top: 32px; }
  .footer .stamp .stamp-label { font-size: 10px; color: #94a3b8; margin-top: 4px; text-align: center; }

  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head><body>
<div class="page">

  <!-- School Header -->
  <div class="school-header">
    <div>
      <div class="name">${schoolName.toUpperCase()}</div>
      <div class="tagline">Official Payment Transaction Transcript</div>
    </div>
    <div class="ref-block">
      <div class="label">Document Ref</div>
      <div class="value">${refNo}</div>
      <div class="label" style="margin-top:8px">Date Issued</div>
      <div class="value" style="color:#fff">${format(new Date(), "dd MMM yyyy")}</div>
    </div>
  </div>
  <div class="accent-strip"></div>

  <!-- Document Title -->
  <div class="doc-title">
    <h1>Payment Transaction Transcript</h1>
    <div class="meta">Period: ${dateRange}</div>
  </div>

  <div class="body">

    <!-- Info Grid -->
    <div class="info-grid">
      <div class="info-card">
        <div class="card-title">Student Details</div>
        <div class="info-row"><span class="info-label">Full Name</span><span class="info-value">${name}</span></div>
        <div class="info-row"><span class="info-label">Admission No.</span><span class="info-value">${admNo}</span></div>
        <div class="info-row"><span class="info-label">Class</span><span class="info-value">${cls}</span></div>
      </div>
      <div class="info-card">
        <div class="card-title">Fee Summary</div>
        <div class="info-row"><span class="info-label">Current Term Fee</span><span class="info-value">₦${currentTermTotal.toLocaleString()}</span></div>
        <div class="info-row"><span class="info-label">Prev. Term Outstanding</span><span class="info-value" style="color:#dc2626">₦${outstandingCarried.toLocaleString()}</span></div>
        <div class="info-row"><span class="info-label">Total to be Paid</span><span class="info-value" style="color:#0a2342;font-weight:800">₦${totalOutstanding.toLocaleString()}</span></div>
      </div>
    </div>

    <!-- Transactions -->
    <div class="section-heading">Transaction Records &nbsp;(${filteredHistory.length} ${filteredHistory.length === 1 ? "entry" : "entries"})</div>
    <table>
      <thead>
        <tr>
          <th style="width:30px">#</th>
          <th>Date</th>
          <th>Description</th>
          <th>Method</th>
          <th>Reference</th>
          <th>Amount Paid</th>
          <th>Outstanding After</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tr class="totals-row">
        <td colspan="5">Total Amount Paid</td>
        <td class="amount">₦${total.toLocaleString()}</td>
        <td></td>
      </tr>
    </table>

    <!-- Footer -->
    <div class="footer">
      <div class="note">
        This is an official payment transcript generated by ${schoolName}.<br/>
        For enquiries, please contact the school's accounts office.
      </div>
      <div class="stamp">
        <div class="stamp-line"></div>
        <div class="stamp-label">Authorised Signature</div>
      </div>
    </div>

  </div>
</div>
</body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* ── Hero Header ── */}
      <div className="relative bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        <div className="relative z-10 container mx-auto px-5 pt-6 pb-6 max-w-2xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-gray-900 font-extrabold text-2xl shadow-lg shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{name}</h1>
              <p className="text-white/50 text-sm mt-1">{cls} &nbsp;·&nbsp; {admNo}</p>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="relative z-10 container mx-auto max-w-2xl">
          <div className="flex px-5">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 flex-1 justify-center py-3.5 text-sm font-bold transition-all border-b-2 ${
                    active
                      ? "border-yellow-400 text-white"
                      : "border-transparent text-white/50 hover:text-white/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="container mx-auto px-5 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >

            {/* ══════════ FEES ══════════ */}
            {activeTab === "fees" && (
              <div className="space-y-6">
                {!classFeeStructure ? (
                  <Card><Empty text="No fee structure set for this class yet" /></Card>
                ) : (
                  <>
                    {/* Summary row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-2xl p-5 text-white">
                        <p className="text-white/50 text-xs font-bold uppercase tracking-wide">Total Paid</p>
                        <p className="text-3xl font-extrabold mt-1">₦{totalPaid.toLocaleString()}</p>
                        <p className="text-white/30 text-[10px] mt-1">Current term only</p>
                      </div>
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                        <p className="text-red-400 text-xs font-bold uppercase tracking-wide">Outstanding</p>
                        <p className="text-3xl font-extrabold text-red-600 mt-1">₦{totalOutstanding.toLocaleString()}</p>
                        <p className="text-red-300 text-[10px] mt-1">Current + previous term</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <Card>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-bold text-gray-600">Payment Progress</span>
                        </div>
                        <span className="font-extrabold text-[#0a2342] text-sm">{paymentProgress}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${paymentProgress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${paymentProgress >= 80 ? "bg-green-500" : paymentProgress >= 40 ? "bg-amber-400" : "bg-red-400"}`}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-400">₦{totalPaid.toLocaleString()} paid</span>
                        <span className="text-xs text-gray-400">₦{currentTermTotal.toLocaleString()} total</span>
                      </div>
                    </Card>

                    {/* Current Term Bill */}
                    <Card title="Current Term Bill">
                      <div className="space-y-0.5">
                        {classFeeStructure.termly_fees?.length > 0 && (
                          <>
                            <SectionLabel>Termly Components</SectionLabel>
                            {classFeeStructure.termly_fees.map((f: any, i: number) => (
                              <BillRow key={i} label={f.name} amount={Number(f.amount) || 0} />
                            ))}
                          </>
                        )}
                        {classFeeStructure.books?.length > 0 && (
                          <>
                            <SectionLabel className="mt-3">Books &amp; Stationery</SectionLabel>
                            {classFeeStructure.books.map((b: any, i: number) => (
                              <BillRow key={i} label={b.name} amount={Number(b.price) || 0} />
                            ))}
                          </>
                        )}
                        {/* Total + Previous Outstanding in one card */}
                        <div className="mt-3 bg-[#0a2342] rounded-2xl overflow-hidden">
                          <div className="flex justify-between items-center px-4 py-3.5">
                            <span className="font-extrabold text-white">Total Termly Fee</span>
                            <span className="font-extrabold text-yellow-400 text-lg">₦{(Number(classFeeStructure.total) || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center px-4 py-3 bg-red-600/20 border-t border-white/10">
                            <span className="font-bold text-red-300 text-sm">Previous Term Outstanding</span>
                            <span className="font-extrabold text-red-300">₦{outstandingCarried.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Make Payment */}
                    <button
                      onClick={() => setPayModal(true)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0a2342] to-[#1a5276] rounded-2xl text-white font-extrabold hover:opacity-90 transition-opacity shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                          <Banknote className="w-5 h-5 text-yellow-300" />
                        </div>
                        <span>Make Payment</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/50" />
                    </button>

                    {/* Payment History */}
                    <Card title="Payment History" action={
                      paymentHistory.length > 0 ? (
                        <button onClick={downloadPaymentHistory} className="flex items-center gap-1.5 text-xs font-bold text-[#0a2342] hover:opacity-70 transition-opacity">
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </button>
                      ) : undefined
                    }>
                      {paymentHistory.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-6">No payments recorded yet</p>
                      ) : (
                        <div className="space-y-4">
                          {/* Date filter */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">From</label>
                              <input
                                type="date"
                                value={filterFrom}
                                onChange={e => setFilterFrom(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0a2342]/20"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">To</label>
                              <input
                                type="date"
                                value={filterTo}
                                onChange={e => setFilterTo(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0a2342]/20"
                              />
                            </div>
                          </div>
                          {(filterFrom || filterTo) && (
                            <button onClick={() => { setFilterFrom(""); setFilterTo(""); }} className="text-xs text-gray-400 hover:text-gray-600 font-bold -mt-1">
                              Clear filter
                            </button>
                          )}

                          {filteredHistory.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-4">No payments in this date range</p>
                          ) : (
                            <div className="space-y-3">
                              {filteredHistory.map((p: any, i: number) => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                      <Banknote className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-gray-800 truncate">{p.description || "Payment"}</p>
                                      <p className="text-xs text-gray-400 mt-0.5">
                                        {p.date ? format(new Date(p.date), "MMM d, yyyy") : "—"}
                                        {p.method ? ` · ${p.method}` : ""}
                                        {p.term ? ` · ${p.term}` : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                                    <div>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Amount Paid</p>
                                      <p className="font-extrabold text-green-700 text-base mt-0.5">₦{(Number(p.amount) || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Outstanding After</p>
                                      <p className={`font-extrabold text-base mt-0.5 ${(Number(p.outstanding_after) || 0) > 0 ? "text-red-600" : "text-green-600"}`}>
                                        ₦{(Number(p.outstanding_after) || 0).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* ══════════ SCHOOL (Classes + Attendance + Assignments) ══════════ */}
            {activeTab === "school" && (
              <div className="space-y-6">

                {/* Today's Classes */}
                <Card title="Today's Classes" sub={DAYS[todayIndex]}>
                  {todaysClasses.length === 0 ? (
                    <Empty text="No classes scheduled today" />
                  ) : (
                    <div className="space-y-3">
                      {todaysClasses.map((t: any) => (
                        <div key={t._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{t.subject_id?.name ?? "—"}</p>
                            <p className="text-sm text-gray-400 mt-0.5">{t.start_time} – {t.end_time}</p>
                          </div>
                          {t.room_number && <span className="text-xs bg-white border border-gray-200 text-gray-500 px-3 py-1 rounded-lg font-bold">{t.room_number}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Attendance */}
                <Card title="Attendance">
                  {totalDays === 0 ? <Empty text="No attendance records yet" /> : (
                    <div className="space-y-5">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Present", count: present, cls: "bg-green-50 border-green-100 text-green-700" },
                          { label: "Late",    count: late,    cls: "bg-amber-50 border-amber-100 text-amber-700" },
                          { label: "Absent",  count: absent,  cls: "bg-red-50 border-red-100 text-red-600" },
                        ].map(({ label, count, cls }) => (
                          <div key={label} className={`${cls} border rounded-2xl p-4 text-center`}>
                            <p className="text-3xl font-extrabold">{count}</p>
                            <p className="text-xs font-bold mt-1">{label}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500 font-semibold">Attendance Rate</span>
                          <span className="font-extrabold text-[#0a2342]">{attendanceRate}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${attendanceRate}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${attendanceRate >= 80 ? "bg-green-500" : attendanceRate >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Recent Records</p>
                        {[...attendanceRecords]
                          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 10)
                          .map((r: any, i: number) => {
                            const statusMap: Record<string, { Icon: any; cls: string }> = {
                              present: { Icon: CheckCircle, cls: "text-green-600 bg-green-50" },
                              late:    { Icon: AlertCircle, cls: "text-amber-600 bg-amber-50" },
                              absent:  { Icon: XCircle,    cls: "text-red-500 bg-red-50"     },
                            };
                            const s = statusMap[r.status] ?? statusMap.absent;
                            return (
                              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.cls.split(" ")[1]}`}>
                                  <s.Icon className={`w-4 h-4 ${s.cls.split(" ")[0]}`} />
                                </div>
                                <p className="flex-1 text-sm font-semibold text-gray-700">
                                  {r.date ? format(new Date(r.date), "EEE, MMM d yyyy") : "—"}
                                </p>
                                <span className={`text-xs font-extrabold capitalize px-2.5 py-0.5 rounded-full ${s.cls}`}>{r.status}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </Card>

                {/* Assignments */}
                <Card title="Assignments">
                  {assignments.length === 0 ? <Empty text="No assignments yet" /> : (
                    <div className="space-y-3">
                      {assignments.map((a: any) => {
                        const due = a.due_date ? new Date(a.due_date) : null;
                        const overdue = due && isPast(due);
                        return (
                          <div key={a._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${overdue ? "bg-red-100" : "bg-amber-100"}`}>
                              <FileText className={`w-5 h-5 ${overdue ? "text-red-500" : "text-amber-600"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 truncate">{a.title}</p>
                              <p className="text-sm text-gray-400 mt-0.5">{a.class_subject_id?.subject_id?.name ?? "—"}</p>
                            </div>
                            {due && (
                              <span className={`text-xs px-3 py-1 rounded-full font-extrabold shrink-0 ${overdue ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
                                {overdue ? "Overdue" : format(due, "MMM d")}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>

                {/* Weekly Timetable */}
                <Card title="Weekly Timetable">
                  {timetables.length === 0 ? <Empty text="No timetable set yet" /> : (
                    <div className="space-y-3">
                      {["Monday","Tuesday","Wednesday","Thursday","Friday"].map((day, i) => {
                        const dayClasses = timetables
                          .filter((t: any) => t.day_of_week === i + 1)
                          .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
                        const isToday = i + 1 === todayIndex;
                        return (
                          <div key={day} className={`rounded-2xl border p-4 ${isToday ? "border-[#0a2342]/30 bg-[#0a2342]/5" : "border-gray-100 bg-gray-50"}`}>
                            <p className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${isToday ? "text-[#0a2342]" : "text-gray-400"}`}>
                              {day}{isToday ? " · Today" : ""}
                            </p>
                            {dayClasses.length === 0 ? (
                              <p className="text-xs text-gray-300 font-semibold">No classes</p>
                            ) : (
                              <div className="space-y-2">
                                {dayClasses.map((c: any) => (
                                  <div key={c._id} className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 font-mono w-24 shrink-0">{c.start_time} – {c.end_time}</span>
                                    <span className="text-sm font-bold text-gray-800">{c.subject_id?.name ?? "—"}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ══════════ RESULTS ══════════ */}
            {activeTab === "results" && (
              <div className="space-y-6">
                {academicResults.length === 0 ? (
                  <Card><Empty text="No results recorded yet" /></Card>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-2xl p-5 text-white">
                        <p className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1">GPA</p>
                        <p className="text-5xl font-extrabold">{(Number(raw.gpa) || 0).toFixed(1)}</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-1">Grade</p>
                        <p className="text-5xl font-extrabold text-[#0a2342]">{raw.grade || raw.gradeLevel || "—"}</p>
                      </div>
                    </div>

                    <Card title="Subject Performance">
                      <div className="space-y-2">
                        {academicResults.map((r: any, i: number) => {
                          const score = Number(r.score) || 0;
                          const good  = score >= 60;
                          return (
                            <div key={i} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${good ? "bg-green-100" : "bg-red-100"}`}>
                                <Award className={`w-4 h-4 ${good ? "text-green-600" : "text-red-500"}`} />
                              </div>
                              <p className="flex-1 font-bold text-gray-900 text-sm">{r.subject || "—"}</p>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-extrabold text-[#0a2342]">{score}<span className="text-xs text-gray-400">/100</span></span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${good ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                  {r.grade || (score >= 70 ? "B" : score >= 60 ? "C" : "F")}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* ══════════ INFO ══════════ */}
            {activeTab === "info" && (
              <Card title="Child Information">
                <div className="space-y-2">
                  {[
                    { label: "Full Name",         value: name        },
                    { label: "Admission Number",  value: admNo       },
                    { label: "Class",             value: cls         },
                    { label: "Level",             value: level       },
                    { label: "Gender",            value: gender      },
                    { label: "Date of Birth",     value: dob         },
                    { label: "Address",           value: address     },
                    { label: "Parent / Guardian", value: parentName  },
                    { label: "Parent Phone",      value: parentPhone },
                    { label: "Parent Email",      value: parentEmail },
                  ].filter(f => f.value && f.value !== "—").map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{label}</p>
                        <p className="text-sm font-bold text-gray-900 mt-0.5 capitalize">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </motion.div>
        </AnimatePresence>

        <div className="h-10" />
      </div>

      {/* ── Payment Modal ── */}
      <AnimatePresence>
        {payModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] px-6 py-5 flex items-start justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center mb-3">
                    <Banknote className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h2 className="text-white font-extrabold text-xl">Make Payment</h2>
                  <p className="text-white/50 text-sm mt-0.5">{name}</p>
                </div>
                <button onClick={() => setPayModal(false)} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mt-1">
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Amount (₦)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-gray-400 text-lg">₦</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-3.5 rounded-2xl border border-gray-200 text-lg font-extrabold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ value: "transfer", label: "Bank Transfer" }, { value: "cash", label: "Cash" }, { value: "card", label: "Card" }].map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setPayMethod(m.value)}
                        className={`py-3 rounded-2xl text-xs font-extrabold border-2 transition-all ${payMethod === m.value ? "border-primary bg-primary/5 text-primary" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"}`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. First term tuition"
                    value={payDesc}
                    onChange={(e) => setPayDesc(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  onClick={() => payMutation.mutate({
                    amount: Number(payAmount),
                    method: payMethod,
                    description: payDesc,
                    reference: "PAY-" + Date.now().toString().slice(-6),
                  })}
                  disabled={!payAmount || !payMethod || !payDesc || payMutation.isPending}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white font-extrabold text-base hover:opacity-90 transition-opacity disabled:opacity-40 mt-1"
                >
                  {payMutation.isPending ? "Processing…" : `Pay ₦${Number(payAmount || 0).toLocaleString()}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Shared UI helpers ──

const Card = ({ title, sub, action, children }: {
  title?: string; sub?: string; action?: React.ReactNode; children: React.ReactNode;
}) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
    {title && (
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-gray-900">{title}</h3>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const SectionLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pt-2 pb-1 ${className}`}>{children}</p>
);

const BillRow = ({ label, amount }: { label: string; amount: number }) => (
  <div className="flex justify-between items-center py-3.5 px-1 border-b border-gray-50 last:border-0">
    <span className="text-gray-600 font-semibold">{label}</span>
    <span className="font-extrabold text-gray-900">₦{amount.toLocaleString()}</span>
  </div>
);

const Empty = ({ text }: { text: string }) => (
  <div className="text-center py-10">
    <CheckCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
    <p className="text-gray-400 font-semibold text-sm">{text}</p>
  </div>
);

export default ParentChildDetail;

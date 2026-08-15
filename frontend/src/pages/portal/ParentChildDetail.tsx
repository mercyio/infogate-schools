import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, User,
  BookOpen, CreditCard, Award, CheckCircle,
  AlertCircle, XCircle, FileText, Banknote, Download,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format, isPast } from "date-fns";
import PublicNavbar from "@/components/layout/PublicNavbar";

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
  const todayIndex = new Date().getDay();

  const [activeTab, setActiveTab] = useState<Tab>("fees");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const { data: raw, isLoading } = useQuery({
    queryKey: ["child-detail", studentId],
    queryFn: async () => { const res = await api.get(`/users/students/${studentId}`); return res.data; },
    enabled: !!studentId,
  });

  const classLevel = sf(raw, "class_id.level");
  // creche classes share nursery timetable entries (Timetable model has no "creche" level)
  const timetableLevel = classLevel === "creche" ? "nursery" : classLevel;

  const { data: timetables = [] } = useQuery({
    queryKey: ["child-timetable", timetableLevel],
    enabled: !!timetableLevel,
    queryFn: async () => { const res = await api.get(`/timetables?level=${timetableLevel}`); return Array.isArray(res.data) ? res.data : []; },
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
          <th>Amount Paid</th>
          <th>Outstanding After</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tr class="totals-row">
        <td colspan="4">Total Amount Paid</td>
        <td class="amount">₦${total.toLocaleString()}</td>
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
                    {/* TOP SECTION: Fee Breakdown Summary */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-[#0a2342] to-[#1a5276] px-6 py-4">
                        <h3 className="font-extrabold text-white text-base">Payment Breakdown This Term</h3>
                        <p className="text-white/50 text-xs mt-1">Track what you owe this term</p>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        {/* Previous Term Arrears */}
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                          <div>
                            <p className="text-gray-600 text-sm font-semibold">Previous Term Arrears</p>
                            <p className="text-gray-400 text-xs mt-0.5">Amount carried over</p>
                          </div>
                          <div className={`text-right ${outstandingCarried > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            <p className="font-extrabold text-lg">₦{outstandingCarried.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Current Term Fees */}
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                          <div>
                            <p className="text-gray-600 text-sm font-semibold">Current Term Fees</p>
                            <p className="text-gray-400 text-xs mt-0.5">School fees for this term</p>
                          </div>
                          <div className="text-right text-amber-600">
                            <p className="font-extrabold text-lg">₦{currentTermTotal.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Total to Pay */}
                        <div className="flex justify-between items-center pt-2 bg-gradient-to-br from-[#0a2342]/5 to-[#1a5276]/5 rounded-xl p-4">
                          <div>
                            <p className="text-[#0a2342] text-sm font-extrabold">TOTAL TO PAY THIS TERM</p>
                            <p className="text-gray-500 text-xs mt-0.5">Arrears + Current Fees</p>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-2xl text-[#0a2342]">₦{totalOutstanding.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Term Bill */}
                    <Card title="Fee Breakdown">
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
                        <div className="mt-4 pt-3 border-t-2 border-gray-100 flex justify-between items-center">
                          <span className="font-extrabold text-gray-900">Total Termly Fee</span>
                          <span className="font-extrabold text-[#0a2342] text-lg">₦{(Number(classFeeStructure.total) || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </Card>

                    {/* BOTTOM SECTION: Payment Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Total Paid Card */}
                      <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-2xl p-6 text-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-wide">Total Paid</p>
                            <p className="text-white text-2xl font-extrabold mt-2">₦{totalPaid.toLocaleString()}</p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-300" />
                          </div>
                        </div>
                        <p className="text-white/50 text-[11px] mt-2">Payments received this term</p>
                      </div>

                      {/* Total Outstanding Card */}
                      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-red-600 text-xs font-bold uppercase tracking-wide">Total Outstanding</p>
                            <p className="text-red-900 text-2xl font-extrabold mt-2">₦{totalOutstanding.toLocaleString()}</p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-red-200 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-700" />
                          </div>
                        </div>
                        <p className="text-red-600/70 text-[11px] mt-2">Current + previous term outstanding</p>
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

                    {/* Payment History */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                      {/* Card header */}
                      <div className="bg-gradient-to-r from-[#0a2342] to-[#1a5276] px-6 py-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-white text-base">Payment History</h3>
                            <p className="text-white/40 text-xs mt-0.5">{paymentHistory.length} transaction{paymentHistory.length !== 1 ? "s" : ""} recorded</p>
                          </div>
                          {paymentHistory.length > 0 && (
                            <button
                              onClick={downloadPaymentHistory}
                              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-bold transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" /> Download PDF
                            </button>
                          )}
                        </div>

                        {/* Date filter inside header */}
                        {paymentHistory.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wide mb-1">From</label>
                              <input
                                type="date"
                                value={filterFrom}
                                onChange={e => setFilterFrom(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/30 [color-scheme:dark]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wide mb-1">To</label>
                              <input
                                type="date"
                                value={filterTo}
                                onChange={e => setFilterTo(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/30 [color-scheme:dark]"
                              />
                            </div>
                          </div>
                        )}
                        {(filterFrom || filterTo) && (
                          <button onClick={() => { setFilterFrom(""); setFilterTo(""); }} className="mt-2 text-xs text-white/40 hover:text-white/70 font-bold transition-colors">
                            ✕ Clear filter
                          </button>
                        )}
                      </div>

                      {/* Transactions */}
                      <div className="p-6">
                      {paymentHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Banknote className="w-6 h-6 text-gray-300" />
                          </div>
                          <p className="text-gray-400 font-semibold text-sm">No payments recorded yet</p>
                        </div>
                      ) : filteredHistory.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-6">No payments in this date range</p>
                      ) : (
                        <div className="space-y-3">
                          {filteredHistory.map((p: any, i: number) => {
                            const outstanding = Number(p.outstanding_after) || 0;
                            return (
                            <div key={i} className="relative pl-10">
                              {/* Timeline line */}
                              {i < filteredHistory.length - 1 && (
                                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-100" />
                              )}
                              {/* Timeline dot */}
                              <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-green-100 border-2 border-white shadow-sm flex items-center justify-center">
                                <Banknote className="w-3.5 h-3.5 text-green-600" />
                              </div>

                              <div className="bg-gray-50 rounded-2xl p-4 ml-2">
                                {/* Top row */}
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <div className="min-w-0">
                                    <p className="font-extrabold text-gray-900 truncate">{p.description || "Payment"}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                      {p.date ? format(new Date(p.date), "dd MMM yyyy") : "—"}
                                      {p.method ? ` · ${p.method}` : ""}
                                    </p>
                                  </div>
                                  <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Paid</span>
                                </div>

                                {/* Amount row */}
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                                  <div className="text-center bg-white rounded-xl py-2.5 px-3">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Amount Paid</p>
                                    <p className="font-extrabold text-green-700 text-lg mt-0.5">₦{(Number(p.amount) || 0).toLocaleString()}</p>
                                  </div>
                                  <div className="text-center bg-white rounded-xl py-2.5 px-3">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Outstanding After</p>
                                    <p className={`font-extrabold text-lg mt-0.5 ${outstanding > 0 ? "text-red-600" : "text-green-600"}`}>
                                      ₦{outstanding.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )})}
                        </div>
                      )}
                      </div>
                    </div>

                  </>
                )}
              </div>
            )}

            {/* ══════════ SCHOOL ══════════ */}
            {activeTab === "school" && (
              <div className="space-y-5">

                {/* Today's Classes */}
                <SchoolSection label={`Today · ${DAYS[todayIndex]}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Today's classes</p>
                        <p className="text-xs text-gray-400 mt-0.5">{todaysClasses.length} period{todaysClasses.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    {todaysClasses.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-gray-400">No classes scheduled today</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {todaysClasses.map((t: any) => {
                          const name = t.subject_id?.name ?? "—";
                          const isBreak = name.toLowerCase().includes("lunch") || name.toLowerCase().includes("break");
                          const isAssembly = name.toLowerCase().includes("assembly");
                          const now = new Date();
                          const [sh, sm] = t.start_time.split(":").map(Number);
                          const [eh, em] = t.end_time.split(":").map(Number);
                          const start = sh * 60 + sm;
                          const end   = eh * 60 + em;
                          const cur   = now.getHours() * 60 + now.getMinutes();
                          const isNow  = cur >= start && cur < end && now.getDay() === todayIndex;
                          const isDone = cur >= end && now.getDay() === todayIndex;
                          return (
                            <div key={t._id} className="flex items-center gap-4 px-4 py-3">
                              <div className="w-16 shrink-0">
                                <p className="text-xs text-gray-400 leading-tight">{t.start_time}</p>
                                <p className="text-xs text-gray-300 leading-tight">{t.end_time}</p>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${isBreak ? "text-amber-700" : isAssembly ? "text-blue-700" : "text-gray-900"}`}>{name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{isBreak ? "Break" : isAssembly ? "All school" : "Subject"}</p>
                              </div>
                              {isNow  && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">Now</span>}
                              {isDone && !isNow && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 shrink-0">Done</span>}
                              {isBreak && !isNow && !isDone && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">Break</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </SchoolSection>

                {/* Attendance */}
                <SchoolSection label="Attendance">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {totalDays === 0 ? (
                      <div className="px-4 py-8 text-center"><p className="text-sm text-gray-400">No attendance records yet</p></div>
                    ) : (
                      <>
                        <div className="px-4 pt-4 pb-3">
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                              { label: "Present", count: present, bg: "bg-green-50",  num: "text-green-800",  sub: "text-green-600" },
                              { label: "Late",    count: late,    bg: "bg-amber-50",  num: "text-amber-800", sub: "text-amber-600" },
                              { label: "Absent",  count: absent,  bg: "bg-red-50",    num: "text-red-700",   sub: "text-red-500"   },
                            ].map(({ label, count, bg, num, sub }) => (
                              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                                <p className={`text-2xl font-extrabold ${num}`}>{count}</p>
                                <p className={`text-xs font-bold mt-0.5 ${sub}`}>{label}</p>
                              </div>
                            ))}
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${attendanceRate}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${attendanceRate >= 80 ? "bg-green-500" : attendanceRate >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                            />
                          </div>
                          <div className="flex justify-between mt-1.5">
                            <span className="text-xs text-gray-400">Attendance rate</span>
                            <span className="text-xs font-bold text-gray-700">{attendanceRate}%</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-50 px-4 pt-3 pb-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Recent</p>
                          <div className="divide-y divide-gray-50">
                            {[...attendanceRecords]
                              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .slice(0, 8)
                              .map((r: any, i: number) => {
                                const cfg: Record<string, { dot: string; tag: string; text: string }> = {
                                  present: { dot: "bg-green-500",  tag: "bg-green-50 text-green-700",  text: "Present" },
                                  late:    { dot: "bg-amber-400",  tag: "bg-amber-50 text-amber-700",  text: "Late"    },
                                  absent:  { dot: "bg-red-400",    tag: "bg-red-50 text-red-600",      text: "Absent"  },
                                };
                                const c = cfg[r.status] ?? cfg.absent;
                                return (
                                  <div key={i} className="flex items-center gap-3 py-2.5">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                                    <p className="flex-1 text-sm text-gray-600">
                                      {r.date ? format(new Date(r.date), "EEE, MMM d yyyy") : "—"}
                                    </p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.tag}`}>{c.text}</span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </SchoolSection>

                {/* Assignments */}
                <SchoolSection label="Assignments">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {assignments.length === 0 ? (
                      <div className="px-4 py-8 text-center"><p className="text-sm text-gray-400">No assignments yet</p></div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {assignments.map((a: any) => {
                          const due = a.due_date ? new Date(a.due_date) : null;
                          const overdue = due && isPast(due);
                          return (
                            <div key={a._id} className="flex items-center gap-3 px-4 py-3.5">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${overdue ? "bg-red-50" : "bg-amber-50"}`}>
                                <FileText className={`w-4 h-4 ${overdue ? "text-red-500" : "text-amber-600"}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{a.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{a.class_subject_id?.subject_id?.name ?? "—"}</p>
                              </div>
                              {due && (
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                                  overdue ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                                }`}>
                                  {overdue ? "Overdue" : format(due, "MMM d")}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </SchoolSection>

                {/* Weekly Timetable */}
                <SchoolSection label="Weekly timetable">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {timetables.length === 0 ? (
                      <div className="px-4 py-8 text-center"><p className="text-sm text-gray-400">No timetable set yet</p></div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {["Monday","Tuesday","Wednesday","Thursday","Friday"].map((day, i) => {
                          const dayNum = i + 1;
                          const isToday = dayNum === todayIndex;
                          const daySlots = timetables
                            .filter((t: any) => t.day_of_week === dayNum)
                            .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
                          return (
                            <div key={day} className="px-4 py-3">
                              <div className="flex items-center gap-2 mb-2">
                                <p className={`text-xs font-bold uppercase tracking-wider ${isToday ? "text-[#0a2342]" : "text-gray-400"}`}>{day}</p>
                                {isToday && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Today</span>}
                              </div>
                              {daySlots.length === 0 ? (
                                <p className="text-xs text-gray-300">No classes</p>
                              ) : (
                                <div className="space-y-1">
                                  {daySlots.map((s: any) => {
                                    const sname = s.subject_id?.name ?? "—";
                                    const isBreak = sname.toLowerCase().includes("lunch") || sname.toLowerCase().includes("break");
                                    const isAssembly = sname.toLowerCase().includes("assembly");
                                    return (
                                      <div key={s._id} className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg ${
                                        isBreak ? "bg-amber-50" : isAssembly ? "bg-blue-50" : "bg-gray-50"
                                      }`}>
                                        <span className="text-[11px] text-gray-400 w-20 shrink-0">{s.start_time} – {s.end_time}</span>
                                        <span className={`text-xs font-bold ${
                                          isBreak ? "text-amber-700" : isAssembly ? "text-blue-700" : "text-gray-800"
                                        }`}>{sname}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </SchoolSection>

              </div>
            )}

            {/* ══════════ RESULTS ══════════ */}
            {activeTab === "results" && (
              <div className="space-y-5">
                {academicResults.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 px-4 py-12 text-center">
                    <Award className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No results recorded yet</p>
                  </div>
                ) : (
                  <>
                    {/* GPA + Grade summary */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#0a2342] rounded-2xl p-5">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">GPA</p>
                        <p className="text-4xl font-extrabold text-white">{(Number(raw.gpa) || 0).toFixed(1)}</p>
                        <p className="text-white/30 text-xs mt-1">Current term</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Overall grade</p>
                        <p className="text-4xl font-extrabold text-[#0a2342]">{raw.grade || raw.gradeLevel || "—"}</p>
                        <p className="text-gray-300 text-xs mt-1">This session</p>
                      </div>
                    </div>

                    {/* Subject breakdown */}
                    <SchoolSection label="Subject performance">
                      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-50">
                          {academicResults.map((r: any, i: number) => {
                            const score = Number(r.score) || 0;
                            const grade = r.grade || (score >= 70 ? "B" : score >= 60 ? "C" : "F");
                            const pct   = Math.min(100, score);
                            const color = score >= 70
                              ? { bar: "bg-green-500",  badge: "bg-green-50 text-green-700",  score: "text-green-700" }
                              : score >= 50
                              ? { bar: "bg-amber-400",  badge: "bg-amber-50 text-amber-700",  score: "text-amber-700" }
                              : { bar: "bg-red-400",    badge: "bg-red-50 text-red-600",      score: "text-red-600"   };
                            return (
                              <div key={i} className="px-4 py-3.5">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-gray-900">{r.subject || "—"}</p>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-sm font-extrabold ${color.score}`}>{score}<span className="text-xs text-gray-300">/100</span></span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color.badge}`}>{grade}</span>
                                  </div>
                                </div>
                                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                                    className={`h-full rounded-full ${color.bar}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </SchoolSection>
                  </>
                )}
              </div>
            )}

            {/* ══════════ INFO ══════════ */}
            {activeTab === "info" && (
              <div className="space-y-5">
                {/* Student */}
                <SchoolSection label="Student details">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {[
                        { label: "Full name",        value: name,  icon: User     },
                        { label: "Admission number", value: admNo, icon: FileText },
                        { label: "Class",            value: cls,   icon: BookOpen },
                        { label: "Level",            value: level, icon: Award    },
                        { label: "Gender",           value: gender,icon: User     },
                        { label: "Date of birth",    value: dob,   icon: null     },
                        { label: "Address",          value: address,icon: null    },
                      ].filter(f => f.value && f.value !== "—").map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-4 px-4 py-3.5">
                          {Icon && (
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          {!Icon && <div className="w-8 h-8 shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5 capitalize truncate">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </SchoolSection>

                {/* Parent / Guardian */}
                {(parentName !== "—" || parentPhone !== "—" || parentEmail !== "—") && (
                  <SchoolSection label="Parent / guardian">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      {/* Avatar strip */}
                      <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-50">
                        <div className="w-10 h-10 rounded-full bg-[#0a2342] flex items-center justify-center shrink-0">
                          <span className="text-sm font-extrabold text-white">
                            {parentName !== "—" ? parentName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "P"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{parentName !== "—" ? parentName : "Guardian"}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Parent / Guardian</p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {[
                          { label: "Phone",  value: parentPhone, icon: "📞" },
                          { label: "Email",  value: parentEmail, icon: "✉️"  },
                        ].filter(f => f.value && f.value !== "—").map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between px-4 py-3">
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-sm font-bold text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SchoolSection>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        <div className="h-10" />
      </div>

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

const SchoolSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{label}</p>
    {children}
  </div>
);

export default ParentChildDetail;

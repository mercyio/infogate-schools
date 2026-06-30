import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  BookOpen,
  Layers,
  X,
  GraduationCap,
  Wrench,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeeItem { name: string; amount: string }
interface BookItem { name: string; price: string }

interface ClassFee {
  id: string;
  className: string;
  level: string;
  termly_fees: { name: string; amount: number }[];
  books: { name: string; price: number }[];
  total_termly: number;
  total_books: number;
  total: number;
}

type DrawerMode = "add" | "edit" | null;

// ─── Level helpers ────────────────────────────────────────────────────────────

const LEVEL_META: Record<string, { icon: typeof BookOpen; color: string; badge: string }> = {
  nursery:    { icon: Layers,        color: "from-pink-500 to-rose-400",      badge: "bg-pink-50 text-pink-700 border-pink-200" },
  primary:    { icon: BookOpen,      color: "from-blue-600 to-blue-400",      badge: "bg-blue-50 text-blue-700 border-blue-200" },
  secondary:  { icon: GraduationCap, color: "from-purple-600 to-violet-400",  badge: "bg-purple-50 text-purple-700 border-purple-200" },
  vocational: { icon: Wrench,        color: "from-amber-500 to-orange-400",   badge: "bg-amber-50 text-amber-700 border-amber-200" },
};

function levelMeta(level: string) {
  return LEVEL_META[level?.toLowerCase()] ?? { icon: DollarSign, color: "from-[#0a2342] to-[#1a5276]", badge: "bg-gray-100 text-gray-700 border-gray-200" };
}

// ─── Fee Drawer ───────────────────────────────────────────────────────────────

function FeeDrawer({
  mode,
  classes,
  editTarget,
  onClose,
  onSave,
  saving,
}: {
  mode: DrawerMode;
  classes: ClassFee[];
  editTarget: ClassFee | null;
  onClose: () => void;
  onSave: (classId: string, data: { termly_fees: { name: string; amount: number }[]; books: { name: string; price: number }[]; total_termly: number; total_books: number; total: number }) => void;
  saving: boolean;
}) {
  const isEdit = mode === "edit";

  const [selectedClassName, setSelectedClassName] = useState(editTarget?.className ?? "");
  const [termlyFees, setTermlyFees] = useState<FeeItem[]>(
    editTarget ? editTarget.termly_fees.map(f => ({ name: f.name, amount: String(f.amount) })) : []
  );
  const [books, setBooks] = useState<BookItem[]>(
    editTarget ? editTarget.books.map(b => ({ name: b.name, price: String(b.price) })) : []
  );

  const selectedClass = classes.find(c => c.className === selectedClassName);
  const meta = levelMeta(selectedClass?.level ?? "");

  const totalTermly = termlyFees.reduce((s, f) => s + (parseInt(f.amount) || 0), 0);
  const totalBooks  = books.reduce((s, b) => s + (parseInt(b.price) || 0), 0);
  const grandTotal  = totalTermly + totalBooks;

  const handleSave = () => {
    const classId = isEdit ? editTarget!.id : selectedClass?.id;
    if (!classId) { toast.error("Please select a class"); return; }
    const tf = termlyFees.map(f => ({ name: f.name, amount: parseInt(f.amount) || 0 }));
    const bk = books.map(b => ({ name: b.name, price: parseInt(b.price) || 0 }));
    onSave(classId, {
      termly_fees: tf,
      books: bk,
      total_termly: totalTermly,
      total_books: totalBooks,
      total: grandTotal,
    });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] px-6 py-5 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-gray-900" />
            </div>
            <h2 className="text-lg font-extrabold text-white">
              {isEdit ? "Edit Fee Structure" : "Add Fee Structure"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {isEdit && <p className="text-white/50 text-xs ml-12">{editTarget?.className} · {editTarget?.level}</p>}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Class selector (add mode only) */}
        {!isEdit && (
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Select Class</Label>
            <Select value={selectedClassName} onValueChange={setSelectedClassName}>
              <SelectTrigger className="h-11 border-gray-200 focus:border-[#0a2342] focus:ring-[#0a2342]/20">
                <SelectValue placeholder="Choose a class…" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.className}>{c.className} — {c.level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClass && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border mt-1 ${meta.badge}`}>
                <meta.icon className="w-3 h-3" />
                {selectedClass.level.charAt(0).toUpperCase() + selectedClass.level.slice(1)}
              </span>
            )}
          </div>
        )}

        {/* Termly Fees */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#0a2342]" /> Termly Fees
            </h3>
            <button
              onClick={() => setTermlyFees([...termlyFees, { name: "", amount: "" }])}
              className="text-xs font-bold text-[#0a2342] hover:text-[#1a5276] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Row
            </button>
          </div>
          {termlyFees.length === 0 && (
            <p className="text-xs text-gray-400 italic py-3 text-center border border-dashed border-gray-200 rounded-xl">
              No termly fee components yet
            </p>
          )}
          <div className="space-y-2">
            {termlyFees.map((tf, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Description (e.g. Tuition)"
                  value={tf.name}
                  onChange={e => { const u = [...termlyFees]; u[i].name = e.target.value; setTermlyFees(u); }}
                  className="flex-1 h-10 text-sm border-gray-200 focus:border-[#0a2342]"
                />
                <div className="relative w-32 shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₦</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={tf.amount}
                    onChange={e => { const u = [...termlyFees]; u[i].amount = e.target.value; setTermlyFees(u); }}
                    className="pl-7 h-10 text-sm border-gray-200 focus:border-[#0a2342]"
                  />
                </div>
                <button
                  onClick={() => setTermlyFees(termlyFees.filter((_, j) => j !== i))}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {termlyFees.length > 0 && (
            <div className="flex justify-between text-sm px-1">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-extrabold text-gray-900">₦{totalTermly.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Books & Supplies */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0a2342]" /> Books & Supplies
            </h3>
            <button
              onClick={() => setBooks([...books, { name: "", price: "" }])}
              className="text-xs font-bold text-[#0a2342] hover:text-[#1a5276] flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Row
            </button>
          </div>
          {books.length === 0 && (
            <p className="text-xs text-gray-400 italic py-3 text-center border border-dashed border-gray-200 rounded-xl">
              No books or supplies added yet
            </p>
          )}
          <div className="space-y-2">
            {books.map((b, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="Item (e.g. Math Textbook)"
                  value={b.name}
                  onChange={e => { const u = [...books]; u[i].name = e.target.value; setBooks(u); }}
                  className="flex-1 h-10 text-sm border-gray-200 focus:border-[#0a2342]"
                />
                <div className="relative w-32 shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₦</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={b.price}
                    onChange={e => { const u = [...books]; u[i].price = e.target.value; setBooks(u); }}
                    className="pl-7 h-10 text-sm border-gray-200 focus:border-[#0a2342]"
                  />
                </div>
                <button
                  onClick={() => setBooks(books.filter((_, j) => j !== i))}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {books.length > 0 && (
            <div className="flex justify-between text-sm px-1">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-extrabold text-gray-900">₦{totalBooks.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="bg-gradient-to-r from-[#0a2342] to-[#1a5276] rounded-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wide">Grand Total</p>
            <p className="text-white/80 text-xs mt-0.5">Termly + Books & Supplies</p>
          </div>
          <p className="text-2xl font-extrabold text-yellow-400">₦{grandTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-6 py-4 flex gap-3 shrink-0">
        <Button variant="outline" onClick={onClose} className="flex-1 border-gray-200">Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={saving || (!isEdit && !selectedClassName)}
          className="flex-1 bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:from-[#0d3460] text-white font-bold"
        >
          {saving ? "Saving…" : "Save Structure"}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Fee Card ─────────────────────────────────────────────────────────────────

function FeeCard({
  fee,
  onEdit,
  onDuplicate,
  index,
}: {
  fee: ClassFee;
  onEdit: () => void;
  onDuplicate: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="playful-card p-6 bg-white border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{fee.className}</h3>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{fee.level}</p>
        </div>
        <div className="p-2 rounded-lg bg-primary/5 text-primary"><DollarSign className="w-5 h-5" /></div>
      </div>

      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mb-6">
        <p className="text-xs text-slate-500 font-bold mb-1 uppercase">Total Termly Fee</p>
        <p className="text-3xl font-black text-primary">₦{fee.total.toLocaleString()}</p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="text-xs font-bold text-slate-700 border-b pb-1 mb-2">Termly Components</h4>
          {fee.termly_fees.map((tf, i) => (
            <div key={i} className="flex justify-between text-sm py-0.5">
              <span className="text-slate-600">{tf.name}</span>
              <span className="font-semibold text-slate-800">₦{tf.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 border-b pb-1 mb-2">Books & Stationary</h4>
          {fee.books.map((b, i) => (
            <div key={i} className="flex justify-between text-sm py-0.5">
              <span className="text-slate-600">{b.name}</span>
              <span className="font-semibold text-slate-800">₦{b.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button variant="ghost" className="flex-1 gap-2 text-primary hover:bg-primary/10" onClick={onEdit}>
          <Edit className="w-4 h-4" /> Edit
        </Button>
        <Button variant="ghost" className="flex-1 gap-2 text-secondary hover:bg-secondary/10" onClick={onDuplicate}>
          <Copy className="w-4 h-4" /> Duplicate
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const FeesManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [editTarget, setEditTarget] = useState<ClassFee | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const { data: classFees = [], isLoading } = useQuery<ClassFee[]>({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await api.get("/classes");
      return (res.data?.data || res.data || []).map((c: any) => ({
        id: c._id,
        className: c.name,
        level: c.level || "",
        termly_fees: c.fee_structure?.termly_fees || [],
        books: c.fee_structure?.books || [],
        total_termly: c.fee_structure?.total_termly || 0,
        total_books: c.fee_structure?.total_books || 0,
        total: c.fee_structure?.total || 0,
      }));
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/classes/${id}`, { fee_structure: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Fee structure saved");
      setDrawerMode(null);
      setEditTarget(null);
    },
    onError: () => toast.error("Failed to save fee structure"),
  });

  const handleSave = (classId: string, data: any) => {
    saveMutation.mutate({ id: classId, data });
  };

  const levels = useMemo(() => ["all", ...Array.from(new Set(classFees.map(c => c.level).filter(Boolean)))], [classFees]);

  const filtered = useMemo(() => {
    return classFees.filter(f => {
      const matchSearch = f.className.toLowerCase().includes(search.toLowerCase()) || f.level.toLowerCase().includes(search.toLowerCase());
      const matchLevel = levelFilter === "all" || f.level === levelFilter;
      return matchSearch && matchLevel;
    });
  }, [classFees, search, levelFilter]);

  const configured = classFees.filter(f => f.total > 0).length;
  const totalRevTarget = classFees.reduce((s, f) => s + f.total, 0);

  const openAdd = () => { setEditTarget(null); setDrawerMode("add"); };
  const openEdit = (fee: ClassFee) => { setEditTarget(fee); setDrawerMode("edit"); };
  const openDuplicate = (fee: ClassFee) => { setEditTarget({ ...fee, id: "", className: "" }); setDrawerMode("add"); };
  const closeDrawer = () => { setDrawerMode(null); setEditTarget(null); };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Backdrop */}
      <AnimatePresence>
        {drawerMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={closeDrawer}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {drawerMode && (
          <FeeDrawer
            mode={drawerMode}
            classes={classFees}
            editTarget={editTarget}
            onClose={closeDrawer}
            onSave={handleSave}
            saving={saveMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md">
                <DollarSign className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Fee Management</h1>
                <p className="text-white/50 text-sm">Set termly fee structures per class</p>
              </div>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl shadow-md transition-colors self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Fee Structure
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-5">

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Classes",    value: classFees.length,    sub: "Registered",          accent: "text-[#0a2342]" },
            { label: "Configured",       value: configured,          sub: "With fee structure",  accent: "text-green-700" },
            { label: "Revenue Target",   value: `₦${(totalRevTarget / 1000).toFixed(0)}k`, sub: "Per term aggregate", accent: "text-amber-700" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4"
            >
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-extrabold mt-1 ${s.accent}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by class name or level…"
              className="w-full pl-10 pr-4 h-10 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0a2342] focus:ring-2 focus:ring-[#0a2342]/10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {levels.map(l => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all capitalize ${
                  levelFilter === l
                    ? "bg-[#0a2342] text-white border-[#0a2342]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {l === "all" ? "All Levels" : l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ──────────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-[#0a2342] border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <DollarSign className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-semibold">No classes match your filters</p>
            <button onClick={openAdd} className="mt-4 text-sm font-bold text-[#0a2342] underline underline-offset-2">
              Add a fee structure
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-gray-400 font-medium">{filtered.length} class{filtered.length !== 1 ? "es" : ""}</p>
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {configured} / {classFees.length} configured
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((fee, i) => (
                <FeeCard
                  key={fee.id}
                  fee={fee}
                  index={i}
                  onEdit={() => openEdit(fee)}
                  onDuplicate={() => openDuplicate(fee)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeesManagement;

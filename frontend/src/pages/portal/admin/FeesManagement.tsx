import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  DollarSign,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Bell,
  LogOut,
  Copy,
  Eye,
  Save,
  BookOpen,
  Shirt,
  TrendingUp,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

const FeesManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);

  const { data: classFees = [], isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data.map((c: any) => ({
        id: c._id,
        className: c.name,
        level: c.level,
        termly_fees: c.fee_structure?.termly_fees || [],
        books: c.fee_structure?.books || [],
        total_termly: c.fee_structure?.total_termly || 0,
        total_books: c.fee_structure?.total_books || 0,
        total: c.fee_structure?.total || 0,
        status: "active",
      }));
    }
  });

  const [newFee, setNewFee] = useState({
    className: "",
    level: "",
    termly_fees: [] as { name: string, amount: string }[],
    books: [] as { name: string, price: string }[],
  });
  const [editFee, setEditFee] = useState({
    className: "",
    level: "",
    termly_fees: [] as { name: string, amount: string }[],
    books: [] as { name: string, price: string }[],
  });

  const filteredClasses = classFees.filter(
    (fee: any) =>
      fee.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateClassMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.put(`/classes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Fee structure updated successfully");
      setIsEditDialogOpen(false);
      setIsAddDialogOpen(false);
      setEditingFeeId(null);
      setNewFee({ className: "", level: "", termly_fees: [], books: [] });
    },
    onError: () => {
      toast.error("Failed to update fee structure");
    },
  });

  const handleAddFee = () => {
    const selectedClass = classFees.find((c: any) => c.className === newFee.className);
    if (!selectedClass) {
      toast.error("Please select a valid class");
      return;
    }

    const termly = newFee.termly_fees.map(f => ({ name: f.name, amount: parseInt(f.amount) || 0 }));
    const total_termly = termly.reduce((sum, f) => sum + f.amount, 0);

    const books = newFee.books.map(f => ({ name: f.name, price: parseInt(f.price) || 0 }));
    const total_books = books.reduce((sum, f) => sum + f.price, 0);

    const total = total_termly + total_books;

    updateClassMutation.mutate({
      id: selectedClass.id,
      data: {
        fee_structure: {
          termly_fees: termly,
          books: books,
          total_termly,
          total_books,
          total,
        },
      },
    });
  };

  const handleEditFee = (feeId: string) => {
    const fee = classFees.find((f: any) => f.id === feeId);
    if (fee) {
      setEditingFeeId(feeId);
      setEditFee({
        className: fee.className,
        level: fee.level,
        termly_fees: fee.termly_fees.map((f: any) => ({ name: f.name, amount: f.amount.toString() })),
        books: fee.books.map((f: any) => ({ name: f.name, price: f.price.toString() })),
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveFee = () => {
    if (!editingFeeId) return;
    const termly = editFee.termly_fees.map(f => ({ name: f.name, amount: parseInt(f.amount) || 0 }));
    const total_termly = termly.reduce((sum, f) => sum + f.amount, 0);

    const books = editFee.books.map(f => ({ name: f.name, price: parseInt(f.price) || 0 }));
    const total_books = books.reduce((sum, f) => sum + f.price, 0);

    const total = total_termly + total_books;

    updateClassMutation.mutate({
      id: editingFeeId,
      data: {
        fee_structure: {
          termly_fees: termly,
          books: books,
          total_termly,
          total_books,
          total,
        },
      },
    });
  };

  const handleDuplicateFee = (fee: any) => {
    setNewFee({
      className: fee.className,
      level: fee.level,
      termly_fees: fee.termly_fees.map((f: any) => ({ name: f.name, amount: f.amount.toString() })),
      books: fee.books.map((f: any) => ({ name: f.name, price: f.price.toString() })),
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/15 to-primary/10 border border-primary/20 shadow-xl p-8 md:p-12"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                Class Fee Management
              </h2>
              <p className="text-muted-foreground text-lg">
                Create and manage fee structures for each class. Set tuition,
                books, and other termly components.
              </p>
            </div>
          </motion.div>

          {/* Header with Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
                All Class Fees
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredClasses.length} classes configured
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:min-w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by class or level..."
                  className="pl-10 h-11 rounded-lg border-primary/30 focus:border-primary bg-background/70"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg h-11">
                      <Plus className="w-4 h-4" />
                      Add Fee
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                  <DialogHeader className="bg-gradient-to-r from-primary/95 to-secondary/95 -m-6 mb-0 px-8 py-8 rounded-t-2xl border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <DollarSign className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-3xl font-bold text-white">
                          Add New Class Fee
                        </DialogTitle>
                        <p className="text-sm text-white/90 mt-1">Configure fee structure for a specific class</p>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6 py-8 px-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Shield className="w-3 h-3 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Class Information</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-200/50">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-800">Select Class</Label>
                          <Select 
                            value={newFee.className} 
                            onValueChange={(val) => {
                              const selected = classFees.find((c: any) => c.className === val);
                              setNewFee({ ...newFee, className: val, level: selected?.level || "" });
                            }}
                          >
                            <SelectTrigger className="h-11 rounded-lg border border-slate-300">
                              <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                              {classFees.map((c: any) => (
                                <SelectItem key={c.id} value={c.className}>{c.className}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-800">Level</Label>
                          <Input readOnly value={newFee.level} className="h-11 bg-slate-100 italic" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <Zap className="w-3 h-3 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">Termly Fees</h3>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setNewFee({ ...newFee, termly_fees: [...newFee.termly_fees, { name: "", amount: "" }] })}>+ Add Row</Button>
                      </div>
                      <div className="space-y-3">
                        {newFee.termly_fees.map((tf, index) => (
                          <div key={`tf-${index}`} className="flex gap-2 items-center">
                            <Input placeholder="Description (e.g. Tuition)" value={tf.name} onChange={(e) => {
                              const updated = [...newFee.termly_fees];
                              updated[index].name = e.target.value;
                              setNewFee({ ...newFee, termly_fees: updated });
                            }} />
                            <Input type="number" placeholder="Amount" value={tf.amount} onChange={(e) => {
                              const updated = [...newFee.termly_fees];
                              updated[index].amount = e.target.value;
                              setNewFee({ ...newFee, termly_fees: updated });
                            }} />
                            <Button variant="ghost" size="icon" onClick={() => {
                              const updated = newFee.termly_fees.filter((_, i) => i !== index);
                              setNewFee({ ...newFee, termly_fees: updated });
                            }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <BookOpen className="w-3 h-3 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">Books & Stationary</h3>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setNewFee({ ...newFee, books: [...newFee.books, { name: "", price: "" }] })}>+ Add Row</Button>
                      </div>
                      <div className="space-y-3">
                        {newFee.books.map((b, index) => (
                          <div key={`b-${index}`} className="flex gap-2 items-center">
                            <Input placeholder="Item (e.g. Math Set)" value={b.name} onChange={(e) => {
                              const updated = [...newFee.books];
                              updated[index].name = e.target.value;
                              setNewFee({ ...newFee, books: updated });
                            }} />
                            <Input type="number" placeholder="Price" value={b.price} onChange={(e) => {
                              const updated = [...newFee.books];
                              updated[index].price = e.target.value;
                              setNewFee({ ...newFee, books: updated });
                            }} />
                            <Button variant="ghost" size="icon" onClick={() => {
                              const updated = newFee.books.filter((_, i) => i !== index);
                              setNewFee({ ...newFee, books: updated });
                            }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 underline underline-offset-4">TOTAL ESTIMATED FEE</span>
                        <span className="text-3xl font-bold text-primary">
                          ₦{(
                            newFee.termly_fees.reduce((sum, f) => sum + (parseInt(f.amount) || 0), 0) +
                            newFee.books.reduce((sum, b) => sum + (parseInt(b.price) || 0), 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button 
                        onClick={handleAddFee} 
                        disabled={!newFee.className}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Save Fee Structure
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading ? (
              <div className="col-span-full py-20 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
            ) : filteredClasses.length > 0 ? (
              filteredClasses.map((fee: any) => (
                <motion.div
                  key={fee.id}
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
                      {fee.termly_fees?.map((tf: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm py-0.5">
                          <span className="text-slate-600">{tf.name}</span>
                          <span className="font-semibold text-slate-800">₦{tf.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 border-b pb-1 mb-2">Books & Stationary</h4>
                      {fee.books?.map((b: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm py-0.5">
                          <span className="text-slate-600">{b.name}</span>
                          <span className="font-semibold text-slate-800">₦{b.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="flex-1 gap-2 text-primary hover:bg-primary/10"
                      onClick={() => handleEditFee(fee.id)}
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex-1 gap-2 text-secondary hover:bg-secondary/10"
                      onClick={() => handleDuplicateFee(fee)}
                    >
                      <Copy className="w-4 h-4" /> Duplicate
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 italic font-medium">No fee structures found matching your search</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-y-auto">
          <DialogHeader className="bg-primary/10 -m-6 mb-6 p-8 border-b border-primary/20">
            <DialogTitle className="text-3xl font-bold text-primary">Edit Fee Structure</DialogTitle>
            <p className="text-slate-500">Updating fees for {editFee.className}</p>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl">
              <div className="space-y-2">
                <Label>Class Name</Label>
                <Input readOnly value={editFee.className} className="bg-slate-100" />
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Input readOnly value={editFee.level} className="bg-slate-100" />
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> Termly Fees</h3>
                <Button variant="outline" size="sm" onClick={() => setEditFee({ ...editFee, termly_fees: [...editFee.termly_fees, { name: "", amount: "" }] })}>+ Add</Button>
              </div>
              <div className="space-y-3">
                {editFee.termly_fees.map((tf, index) => (
                  <div key={index} className="flex gap-2">
                    <Input placeholder="Component" value={tf.name} onChange={(e) => {
                      const updated = [...editFee.termly_fees];
                      updated[index].name = e.target.value;
                      setEditFee({ ...editFee, termly_fees: updated });
                    }} />
                    <Input type="number" placeholder="Amount" value={tf.amount} onChange={(e) => {
                      const updated = [...editFee.termly_fees];
                      updated[index].amount = e.target.value;
                      setEditFee({ ...editFee, termly_fees: updated });
                    }} />
                    <Button variant="ghost" size="icon" onClick={() => {
                      const updated = editFee.termly_fees.filter((_, i) => i !== index);
                      setEditFee({ ...editFee, termly_fees: updated });
                    }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <h3 className="text-lg font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Books & Supplies</h3>
                <Button variant="outline" size="sm" onClick={() => setEditFee({ ...editFee, books: [...editFee.books, { name: "", price: "" }] })}>+ Add</Button>
              </div>
              <div className="space-y-3">
                {editFee.books.map((b, index) => (
                  <div key={index} className="flex gap-2">
                    <Input placeholder="Item" value={b.name} onChange={(e) => {
                      const updated = [...editFee.books];
                      updated[index].name = e.target.value;
                      setEditFee({ ...editFee, books: updated });
                    }} />
                    <Input type="number" placeholder="Price" value={b.price} onChange={(e) => {
                      const updated = [...editFee.books];
                      updated[index].price = e.target.value;
                      setEditFee({ ...editFee, books: updated });
                    }} />
                    <Button variant="ghost" size="icon" onClick={() => {
                      const updated = editFee.books.filter((_, i) => i !== index);
                      setEditFee({ ...editFee, books: updated });
                    }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/20 flex justify-between items-center">
              <span className="font-bold text-slate-700">UPDATED TOTAL</span>
              <span className="text-3xl font-black text-primary">
                ₦{(
                  editFee.termly_fees.reduce((sum, f) => sum + (parseInt(f.amount) || 0), 0) +
                  editFee.books.reduce((sum, b) => sum + (parseInt(b.price) || 0), 0)
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveFee} className="bg-primary hover:bg-primary/90 px-8">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeesManagement;

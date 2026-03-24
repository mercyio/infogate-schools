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

const classFees = [
  {
    id: 1,
    className: "Nursery 1",
    level: "Nursery",
    tuition: 150000,
    books: 25000,
    uniform: 15000,
    development: 10000,
    sports: 5000,
    total: 205000,
    status: "active",
  },
  {
    id: 2,
    className: "Nursery 2",
    level: "Nursery",
    tuition: 150000,
    books: 25000,
    uniform: 15000,
    development: 10000,
    sports: 5000,
    total: 205000,
    status: "active",
  },
  {
    id: 3,
    className: "Grade 1",
    level: "Primary",
    tuition: 180000,
    books: 30000,
    uniform: 18000,
    development: 12000,
    sports: 6000,
    total: 246000,
    status: "active",
  },
  {
    id: 4,
    className: "Grade 5",
    level: "Primary",
    tuition: 200000,
    books: 35000,
    uniform: 18000,
    development: 12000,
    sports: 6000,
    total: 271000,
    status: "active",
  },
  {
    id: 5,
    className: "JSS 1",
    level: "Secondary",
    tuition: 250000,
    books: 40000,
    uniform: 20000,
    development: 15000,
    sports: 8000,
    total: 333000,
    status: "active",
  },
  {
    id: 6,
    className: "SS 3",
    level: "Secondary",
    tuition: 280000,
    books: 45000,
    uniform: 20000,
    development: 15000,
    sports: 8000,
    total: 368000,
    status: "active",
  },
];

const FeesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFeeId, setEditingFeeId] = useState<number | null>(null);
  const [newFee, setNewFee] = useState({
    className: "",
    level: "",
    tuition: "",
    books: "",
    uniform: "",
    development: "",
    sports: "",
  });
  const [editFee, setEditFee] = useState({
    className: "",
    level: "",
    tuition: "",
    books: "",
    uniform: "",
    development: "",
    sports: "",
  });

  const filteredClasses = classFees.filter(
    (fee) =>
      fee.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFee = () => {
    console.log("Adding new fee:", newFee);
    setIsAddDialogOpen(false);
    setNewFee({
      className: "",
      level: "",
      tuition: "",
      books: "",
      uniform: "",
      development: "",
      sports: "",
    });
  };

  const handleEditFee = (feeId: number) => {
    const fee = classFees.find((f) => f.id === feeId);
    if (fee) {
      setEditingFeeId(feeId);
      setEditFee({
        className: fee.className,
        level: fee.level,
        tuition: fee.tuition.toString(),
        books: fee.books.toString(),
        uniform: fee.uniform.toString(),
        development: fee.development.toString(),
        sports: fee.sports.toString(),
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveFee = () => {
    console.log("Saving fee:", editingFeeId, editFee);
    setIsEditDialogOpen(false);
    setEditFee({
      className: "",
      level: "",
      tuition: "",
      books: "",
      uniform: "",
      development: "",
      sports: "",
    });
    setEditingFeeId(null);
  };

  const handleDuplicateFee = (fee: (typeof classFees)[0]) => {
    setNewFee({
      className: `${fee.className} (Copy)`,
      level: fee.level,
      tuition: fee.tuition.toString(),
      books: fee.books.toString(),
      uniform: fee.uniform.toString(),
      development: fee.development.toString(),
      sports: fee.sports.toString(),
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-primary/20 sticky top-0 z-50 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <DollarSign className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Fees Management
              </h1>
              <p className="text-xs text-muted-foreground">Infogate Schools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Link to="/portal/admin">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

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
                books, uniform, and other fees per class level.
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
                         <p className="text-sm text-white/90 mt-1">Create and configure fee structure</p>
                       </div>
                     </div>
                   </DialogHeader>

                   <div className="space-y-6 py-8 px-8">
                     {/* Class Information Card */}
                     <div className="space-y-4">
                       <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                           <Shield className="w-3 h-3 text-primary" />
                         </div>
                         <h3 className="text-lg font-semibold text-slate-900">Class Information</h3>
                       </div>
                       <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-200/50">
                         <div className="space-y-2">
                           <Label className="text-sm font-semibold text-slate-800">Class Name</Label>
                           <Input
                             placeholder="e.g., Grade 5A"
                             value={newFee.className}
                             onChange={(e) =>
                               setNewFee({ ...newFee, className: e.target.value })
                             }
                             className="h-11 rounded-lg border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                           />
                         </div>
                         <div className="space-y-2">
                           <Label className="text-sm font-semibold text-slate-800">Education Level</Label>
                           <Input
                             placeholder="e.g., Primary"
                             value={newFee.level}
                             onChange={(e) =>
                               setNewFee({ ...newFee, level: e.target.value })
                             }
                             className="h-11 rounded-lg border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                           />
                         </div>
                       </div>
                     </div>

                     {/* Fee Components Grid */}
                     <div className="space-y-4">
                       <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                           <DollarSign className="w-3 h-3 text-primary" />
                         </div>
                         <h3 className="text-lg font-semibold text-slate-900">Fee Breakdown</h3>
                       </div>
                       <div className="grid grid-cols-5 gap-4">
                         {/* Tuition Fee Card */}
                         <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/30 border border-blue-200/40 hover:border-blue-300/60 transition-all">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                               <Zap className="w-4 h-4 text-blue-700" />
                             </div>
                             <Label className="text-xs font-bold text-blue-900">TUITION</Label>
                           </div>
                           <Input
                             type="number"
                             placeholder="0"
                             value={newFee.tuition}
                             onChange={(e) =>
                               setNewFee({ ...newFee, tuition: e.target.value })
                             }
                             className="h-10 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-semibold text-blue-900 bg-white"
                           />
                           <p className="text-xs text-blue-700/70 font-medium">Annual charges</p>
                         </div>

                         {/* Books Card */}
                         <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-50/30 border border-green-200/40 hover:border-green-300/60 transition-all">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                               <BookOpen className="w-4 h-4 text-green-700" />
                             </div>
                             <Label className="text-xs font-bold text-green-900">BOOKS</Label>
                           </div>
                           <Input
                             type="number"
                             placeholder="0"
                             value={newFee.books}
                             onChange={(e) =>
                               setNewFee({ ...newFee, books: e.target.value })
                             }
                             className="h-10 rounded-lg border border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 font-semibold text-green-900 bg-white"
                           />
                           <p className="text-xs text-green-700/70 font-medium">Learning materials</p>
                         </div>

                         {/* Uniform Card */}
                         <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-50/30 border border-purple-200/40 hover:border-purple-300/60 transition-all">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                               <Shirt className="w-4 h-4 text-purple-700" />
                             </div>
                             <Label className="text-xs font-bold text-purple-900">UNIFORM</Label>
                           </div>
                           <Input
                             type="number"
                             placeholder="0"
                             value={newFee.uniform}
                             onChange={(e) =>
                               setNewFee({ ...newFee, uniform: e.target.value })
                             }
                             className="h-10 rounded-lg border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 font-semibold text-purple-900 bg-white"
                           />
                           <p className="text-xs text-purple-700/70 font-medium">School attire</p>
                         </div>

                         {/* Development Card */}
                         <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/30 border border-amber-200/40 hover:border-amber-300/60 transition-all">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                               <TrendingUp className="w-4 h-4 text-amber-700" />
                             </div>
                             <Label className="text-xs font-bold text-amber-900">DEVELOPMENT</Label>
                           </div>
                           <Input
                             type="number"
                             placeholder="0"
                             value={newFee.development}
                             onChange={(e) =>
                               setNewFee({
                                 ...newFee,
                                 development: e.target.value,
                               })
                             }
                             className="h-10 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-semibold text-amber-900 bg-white"
                           />
                           <p className="text-xs text-amber-700/70 font-medium">Infrastructure</p>
                         </div>

                         {/* Sports Card */}
                         <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-red-50 to-red-50/30 border border-red-200/40 hover:border-red-300/60 transition-all">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                               <Zap className="w-4 h-4 text-red-700" />
                             </div>
                             <Label className="text-xs font-bold text-red-900">SPORTS</Label>
                           </div>
                           <Input
                             type="number"
                             placeholder="0"
                             value={newFee.sports}
                             onChange={(e) =>
                               setNewFee({ ...newFee, sports: e.target.value })
                             }
                             className="h-10 rounded-lg border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 font-semibold text-red-900 bg-white"
                           />
                           <p className="text-xs text-red-700/70 font-medium">Activities</p>
                         </div>
                       </div>
                     </div>

                     {/* Total Summary Card */}
                     <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 p-6 rounded-xl border border-primary/20 backdrop-blur-sm">
                       <div className="flex items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                             <CheckCircle className="w-5 h-5 text-primary" />
                           </div>
                           <div>
                             <p className="text-xs font-semibold text-slate-600">TOTAL ANNUAL FEE</p>
                             <p className="text-xs text-slate-500">Sum of all components</p>
                           </div>
                         </div>
                         <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                           ₦{(
                             (parseInt(newFee.tuition) || 0) +
                             (parseInt(newFee.books) || 0) +
                             (parseInt(newFee.uniform) || 0) +
                             (parseInt(newFee.development) || 0) +
                             (parseInt(newFee.sports) || 0)
                           ).toLocaleString()}
                         </span>
                       </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex justify-end gap-3 pt-4">
                       <Button
                         variant="outline"
                         onClick={() => setIsAddDialogOpen(false)}
                         className="h-11 px-6 rounded-lg font-semibold text-slate-700 border-slate-300 hover:bg-slate-50"
                       >
                         Cancel
                       </Button>
                       <Button
                         onClick={handleAddFee}
                         className="h-11 px-8 rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all font-semibold text-white"
                       >
                         <Save className="w-4 h-4 mr-2" />
                         Save Fee Structure
                       </Button>
                     </div>
                   </div>
                 </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Classes Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredClasses.length > 0 ? (
              filteredClasses.map((fee, idx) => (
                <motion.div
                  key={fee.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="playful-card p-6 bg-gradient-to-br from-card to-card/80 border border-primary/20 hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {fee.className}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {fee.level}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Total */}
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 mb-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Annual Fee
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ₦{fee.total.toLocaleString()}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tuition</span>
                      <span className="font-semibold">
                        ₦{fee.tuition.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Books</span>
                      <span className="font-semibold">
                        ₦{fee.books.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Uniform</span>
                      <span className="font-semibold">
                        ₦{fee.uniform.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Development</span>
                      <span className="font-semibold">
                        ₦{fee.development.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Sports</span>
                      <span className="font-semibold">
                        ₦{fee.sports.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-primary/10">
                    <Dialog
                      open={
                        isEditDialogOpen && editingFeeId === fee.id
                      }
                      onOpenChange={(open) => {
                        if (!open) setIsEditDialogOpen(false);
                      }}
                    >
                      <DialogTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditFee(fee.id)}
                          className="flex-1 flex items-center justify-center gap-1 h-9 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </motion.button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                         <DialogHeader className="bg-gradient-to-r from-primary/95 to-secondary/95 -m-6 mb-0 px-8 py-8 rounded-t-2xl border-0">
                           <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                               <Edit className="w-7 h-7 text-white" />
                             </div>
                             <div>
                               <DialogTitle className="text-3xl font-bold text-white">
                                 Edit Class Fee
                               </DialogTitle>
                               <p className="text-sm text-white/90 mt-1">Update fee structure for {editFee.className}</p>
                             </div>
                           </div>
                         </DialogHeader>

                         <div className="space-y-6 py-8 px-8">
                           {/* Class Information Card */}
                           <div className="space-y-4">
                             <div className="flex items-center gap-3">
                               <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                 <Shield className="w-3 h-3 text-primary" />
                               </div>
                               <h3 className="text-lg font-semibold text-slate-900">Class Information</h3>
                             </div>
                             <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-200/50">
                               <div className="space-y-2">
                                 <Label className="text-sm font-semibold text-slate-800">Class Name</Label>
                                 <Input
                                   placeholder="e.g., Grade 5A"
                                   value={editFee.className}
                                   onChange={(e) =>
                                     setEditFee({
                                       ...editFee,
                                       className: e.target.value,
                                     })
                                   }
                                   className="h-11 rounded-lg border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-sm font-semibold text-slate-800">Education Level</Label>
                                 <Input
                                   placeholder="e.g., Primary"
                                   value={editFee.level}
                                   onChange={(e) =>
                                     setEditFee({
                                       ...editFee,
                                       level: e.target.value,
                                     })
                                   }
                                   className="h-11 rounded-lg border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                                 />
                               </div>
                             </div>
                           </div>

                           {/* Fee Components Grid */}
                           <div className="space-y-4">
                             <div className="flex items-center gap-3">
                               <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                 <DollarSign className="w-3 h-3 text-primary" />
                               </div>
                               <h3 className="text-lg font-semibold text-slate-900">Fee Breakdown</h3>
                             </div>
                             <div className="grid grid-cols-5 gap-4">
                               {/* Tuition Fee Card */}
                               <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/30 border border-blue-200/40 hover:border-blue-300/60 transition-all">
                                 <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                     <Zap className="w-4 h-4 text-blue-700" />
                                   </div>
                                   <Label className="text-xs font-bold text-blue-900">TUITION</Label>
                                 </div>
                                 <Input
                                   type="number"
                                   placeholder="0"
                                   value={editFee.tuition}
                                   onChange={(e) =>
                                     setEditFee({
                                       ...editFee,
                                       tuition: e.target.value,
                                     })
                                   }
                                   className="h-10 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-semibold text-blue-900 bg-white"
                                 />
                                 <p className="text-xs text-blue-700/70 font-medium">Annual charges</p>
                               </div>

                               {/* Books Card */}
                               <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-50/30 border border-green-200/40 hover:border-green-300/60 transition-all">
                                 <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                     <BookOpen className="w-4 h-4 text-green-700" />
                                   </div>
                                   <Label className="text-xs font-bold text-green-900">BOOKS</Label>
                                 </div>
                                 <Input
                                   type="number"
                                   placeholder="0"
                                   value={editFee.books}
                                   onChange={(e) =>
                                     setEditFee({
                                       ...editFee,
                                       books: e.target.value,
                                     })
                                   }
                                   className="h-10 rounded-lg border border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 font-semibold text-green-900 bg-white"
                                 />
                                 <p className="text-xs text-green-700/70 font-medium">Learning materials</p>
                               </div>

                               {/* Uniform Card */}
                               <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-50/30 border border-purple-200/40 hover:border-purple-300/60 transition-all">
                                 <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                     <Shirt className="w-4 h-4 text-purple-700" />
                                   </div>
                                   <Label className="text-xs font-bold text-purple-900">UNIFORM</Label>
                                 </div>
                                 <Input
                                   type="number"
                                   placeholder="0"
                                   value={editFee.uniform}
                                   onChange={(e) =>
                                     setEditFee({
                                       ...editFee,
                                       uniform: e.target.value,
                                     })
                                   }
                                   className="h-10 rounded-lg border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 font-semibold text-purple-900 bg-white"
                                 />
                                 <p className="text-xs text-purple-700/70 font-medium">School attire</p>
                               </div>

                               {/* Development Card */}
                               <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/30 border border-amber-200/40 hover:border-amber-300/60 transition-all">
                                 <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                     <TrendingUp className="w-4 h-4 text-amber-700" />
                                   </div>
                                   <Label className="text-xs font-bold text-amber-900">DEVELOPMENT</Label>
                                 </div>
                                 <Input
                                   type="number"
                                   placeholder="0"
                                   value={editFee.development}
                                   onChange={(e) =>
                                     setEditFee({
                                       ...editFee,
                                       development: e.target.value,
                                     })
                                   }
                                   className="h-10 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-semibold text-amber-900 bg-white"
                                 />
                                 <p className="text-xs text-amber-700/70 font-medium">Infrastructure</p>
                               </div>

                               {/* Sports Card */}
                               <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-red-50 to-red-50/30 border border-red-200/40 hover:border-red-300/60 transition-all">
                                 <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                     <Zap className="w-4 h-4 text-red-700" />
                                   </div>
                                   <Label className="text-xs font-bold text-red-900">SPORTS</Label>
                                 </div>
                                 <Input
                                   type="number"
                                   placeholder="0"
                                   value={editFee.sports}
                                   onChange={(e) =>
                                     setEditFee({
                                       ...editFee,
                                       sports: e.target.value,
                                     })
                                   }
                                   className="h-10 rounded-lg border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 font-semibold text-red-900 bg-white"
                                 />
                                 <p className="text-xs text-red-700/70 font-medium">Activities</p>
                               </div>
                             </div>
                           </div>

                           {/* Total Summary Card */}
                           <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 p-6 rounded-xl border border-primary/20 backdrop-blur-sm">
                             <div className="flex items-center justify-between gap-4">
                               <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                   <CheckCircle className="w-5 h-5 text-primary" />
                                 </div>
                                 <div>
                                   <p className="text-xs font-semibold text-slate-600">TOTAL ANNUAL FEE</p>
                                   <p className="text-xs text-slate-500">Sum of all components</p>
                                 </div>
                               </div>
                               <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                 ₦{(
                                   (parseInt(editFee.tuition) || 0) +
                                   (parseInt(editFee.books) || 0) +
                                   (parseInt(editFee.uniform) || 0) +
                                   (parseInt(editFee.development) || 0) +
                                   (parseInt(editFee.sports) || 0)
                                 ).toLocaleString()}
                               </span>
                             </div>
                           </div>

                           {/* Action Buttons */}
                           <div className="flex justify-end gap-3 pt-4">
                             <Button
                               variant="outline"
                               onClick={() => setIsEditDialogOpen(false)}
                               className="h-11 px-6 rounded-lg font-semibold text-slate-700 border-slate-300 hover:bg-slate-50"
                             >
                               Cancel
                             </Button>
                             <Button
                               onClick={handleSaveFee}
                               className="h-11 px-8 rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all font-semibold text-white"
                             >
                               <Save className="w-4 h-4 mr-2" />
                               Save Changes
                             </Button>
                           </div>
                         </div>
                       </DialogContent>
                    </Dialog>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDuplicateFee(fee)}
                      className="flex-1 flex items-center justify-center gap-1 h-9 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium text-sm transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Duplicate
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">
                  No classes match your search
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeesManagement;

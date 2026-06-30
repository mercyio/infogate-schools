import { useState } from "react";
import { motion } from "framer-motion";
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
  Users, Plus, Search, Mail, Phone, Briefcase, Heart,
  Edit, Trash2, Save, Copy, KeyRound,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

interface Parent {
  _id: string;
  occupation?: string;
  relationship?: string;
  user_id?: {
    _id: string;
    full_name: string;
    email: string;
    phone?: string;
    reg_number?: string;
    password?: string;
  };
}

const RELATIONSHIPS = ["Father", "Mother", "Guardian", "Uncle", "Aunt", "Grandparent", "Other"];

const emptyForm = { full_name: "", email: "", phone: "", occupation: "", relationship: "" };

export default function ManageParents() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [credentials, setCredentials] = useState<{ reg_number: string; password: string } | null>(null);

  const { data: parents = [], isLoading } = useQuery<Parent[]>({
    queryKey: ["parents"],
    queryFn: async () => {
      const res = await api.get("/users/parents");
      return res.data || [];
    },
  });

  const filtered = parents.filter((p) => {
    const name = p.user_id?.full_name?.toLowerCase() ?? "";
    const email = p.user_id?.email?.toLowerCase() ?? "";
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const addMutation = useMutation({
    mutationFn: (data: typeof emptyForm) => api.post("/users/parents", data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["parents"] });
      setCredentials(res.data.credentials);
      setAddOpen(false);
      setForm({ ...emptyForm });
      if (res.data.matched) {
        toast.info("Existing parent matched by phone number — no duplicate created.");
      }
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to add parent"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof emptyForm }) =>
      api.put(`/users/parents/${id}`, {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        occupation: data.occupation,
        relationship: data.relationship,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parents"] });
      toast.success("Parent updated successfully");
      setEditOpen(false);
      setEditId(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update parent"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/parents/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parents"] });
      toast.success("Parent deleted");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete parent"),
  });

  const handleAdd = () => {
    if (!form.full_name || !form.email) {
      toast.error("Full name and email are required");
      return;
    }
    addMutation.mutate(form);
  };

  const handleEdit = (parent: Parent) => {
    setEditId(parent._id);
    setEditForm({
      full_name: parent.user_id?.full_name ?? "",
      email: parent.user_id?.email ?? "",
      phone: parent.user_id?.phone ?? "",
      occupation: parent.occupation ?? "",
      relationship: parent.relationship ?? "",
    });
    setEditOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this parent? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-violet-500 via-violet-400 to-violet-300 rounded-2xl flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold">Manage Parents</h2>
                <p className="text-muted-foreground mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                  {parents.length} parent{parents.length !== 1 ? "s" : ""} registered
                </p>
              </div>
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 shadow-lg">
                  <Plus className="w-4 h-4" /> Add Parent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="bg-gradient-to-r from-violet-500/10 to-violet-300/10 -m-6 mb-6 p-6 rounded-t-lg border-b">
                  <DialogTitle className="text-2xl font-bold text-violet-700">Add New Parent</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">Login credentials will be generated automatically.</p>
                </DialogHeader>

                <div className="space-y-4 px-1">
                  <div className="space-y-4 p-4 bg-violet-50/50 rounded-xl border border-violet-200/50">
                    <h3 className="font-semibold flex items-center gap-2">👤 Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name <span className="text-destructive">*</span></Label>
                        <Input placeholder="Jane Doe" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email <span className="text-destructive">*</span></Label>
                        <Input type="email" placeholder="jane@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input placeholder="080XXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Occupation</Label>
                        <Input placeholder="e.g. Engineer" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship to Student</Label>
                      <Select value={form.relationship} onValueChange={(v) => setForm({ ...form, relationship: v })}>
                        <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                        <SelectContent>
                          {RELATIONSHIPS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                  <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                  <Button
                    onClick={handleAdd}
                    disabled={addMutation.isPending}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-violet-500"
                  >
                    <Save className="w-4 h-4" />
                    {addMutation.isPending ? "Adding…" : "Add Parent"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="playful-card p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="pl-12 h-11 rounded-xl"
              />
            </div>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No parents yet. Add one to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((parent, i) => (
                <motion.div
                  key={parent._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="playful-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-300 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {(parent.user_id?.full_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base">{parent.user_id?.full_name}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {parent.user_id?.email && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                            <Mail className="w-3 h-3" /> {parent.user_id.email}
                          </span>
                        )}
                        {parent.user_id?.phone && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                            <Phone className="w-3 h-3" /> {parent.user_id.phone}
                          </span>
                        )}
                        {parent.relationship && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                            <Heart className="w-3 h-3" /> {parent.relationship}
                          </span>
                        )}
                        {parent.occupation && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                            <Briefcase className="w-3 h-3" /> {parent.occupation}
                          </span>
                        )}
                        {parent.user_id?.reg_number && (
                          <span className="flex items-center gap-1 text-xs font-mono bg-muted/50 px-2 py-0.5 rounded-full">
                            {parent.user_id.reg_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {parent.user_id?.password && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setCredentials({ reg_number: parent.user_id!.reg_number!, password: parent.user_id!.password! })}
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Credentials
                      </Button>
                    )}
                    <Button
                      size="icon" variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEdit(parent)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon" variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(parent._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-gradient-to-r from-violet-500/10 to-violet-300/10 -m-6 mb-6 p-6 rounded-t-lg border-b">
            <DialogTitle className="text-2xl font-bold text-violet-700">Edit Parent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-1">
            <div className="space-y-4 p-4 bg-violet-50/50 rounded-xl border border-violet-200/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Input value={editForm.occupation} onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Select value={editForm.relationship} onValueChange={(v) => setEditForm({ ...editForm, relationship: v })}>
                  <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIPS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              onClick={() => editId && updateMutation.mutate({ id: editId, data: editForm })}
              disabled={updateMutation.isPending}
              className="gap-2 bg-gradient-to-r from-violet-600 to-violet-500"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credentials Modal */}
      <Dialog open={!!credentials} onOpenChange={(open) => !open && setCredentials(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-violet-600" /> Login Credentials
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Share these credentials with the parent to log in.</p>
          <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-muted-foreground">Registration Number</p>
                <p className="font-mono font-semibold">{credentials?.reg_number}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => copy(credentials!.reg_number, "Reg number")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-muted-foreground">Password</p>
                <p className="font-mono font-semibold">{credentials?.password}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => copy(credentials!.password, "Password")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button className="w-full mt-2" onClick={() => setCredentials(null)}>Done</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

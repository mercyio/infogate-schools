import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  GraduationCap,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const AttendanceMonitor = () => {
  const [date, setDate] = useState<Date>(new Date());
  const formattedDate = format(date, 'yyyy-MM-dd');

  // 1. Fetch All Teachers
  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const res = await api.get('/users/teachers');
      return res.data;
    }
  });

  // 2. Fetch Teacher Attendance for the date
  const { data: teacherRecords = [] } = useQuery({
    queryKey: ['attendance', 'teachers', formattedDate],
    queryFn: async () => {
      const res = await api.get(`/attendance/teachers?date=${formattedDate}`);
      return res.data;
    }
  });

  // 3. Fetch All Student Attendance records for the date to see which classes are marked
  const { data: studentRecords = [] } = useQuery({
    queryKey: ['attendance', 'students', 'all', formattedDate],
    queryFn: async () => {
      const res = await api.get(`/attendance?date=${formattedDate}`);
      return res.data;
    }
  });

  const markedClasses = Array.from(new Set(studentRecords.map((r: any) => r.class_id?.name || r.class_id)));
  const allAvailableClasses = ["Daycare", "Preparatory", "KG 1", "KG 2", "Nursery 1", "Nursery 2", "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3", "Vocational Training"];

  const teachersMarked = teachers.filter((t: any) => 
    teacherRecords.some((r: any) => (r.teacher_id?._id || r.teacher_id) === t._id)
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Attendance Monitor</h1>
          <p className="text-muted-foreground mt-1">Track daily marking compliance for teachers and classes</p>
        </div>

        <div className="flex items-center gap-4 bg-card p-2 rounded-2xl border shadow-sm">
          <CalendarIcon className="w-5 h-5 text-primary ml-2" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="font-semibold text-lg hover:bg-transparent">
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl border-primary/10 shadow-lg bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-2">
            <CardDescription className="font-bold uppercase tracking-wider text-xs">Teacher Compliance</CardDescription>
            <CardTitle className="text-3xl font-black text-primary flex items-baseline gap-2">
              {teachersMarked.length} <span className="text-sm font-medium text-muted-foreground">/ {teachers.length} Marked</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(teachersMarked.length / (teachers.length || 1)) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-secondary/10 shadow-lg bg-gradient-to-br from-card to-secondary/5">
          <CardHeader className="pb-2">
            <CardDescription className="font-bold uppercase tracking-wider text-xs">Class Compliance</CardDescription>
            <CardTitle className="text-3xl font-black text-secondary flex items-baseline gap-2">
              {markedClasses.length} <span className="text-sm font-medium text-muted-foreground">/ {allAvailableClasses.length} Marked</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-secondary h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(markedClasses.length / allAvailableClasses.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-accent/10 shadow-lg bg-gradient-to-br from-card to-accent/5">
          <CardHeader className="pb-2">
            <CardDescription className="font-bold uppercase tracking-wider text-xs">Global Punctuality</CardDescription>
            <CardTitle className="text-3xl font-black text-accent">
              {Math.round((studentRecords.filter((r:any) => r.status === 'present').length / (studentRecords.length || 1)) * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Present across all marked classes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="teachers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl p-1 bg-muted/30 h-14 max-w-md border shadow-sm">
          <TabsTrigger value="teachers" className="gap-2 rounded-xl text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            <GraduationCap className="w-5 h-5" />
            Teachers Marking
          </TabsTrigger>
          <TabsTrigger value="students" className="gap-2 rounded-xl text-lg data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all duration-300">
            <Users className="w-5 h-5" />
            Class Marking
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="teachers">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="border-primary/10 shadow-xl overflow-hidden rounded-3xl">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-muted-foreground uppercase tracking-wider">Teacher</th>
                      <th className="px-6 py-4 text-left font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left font-bold text-muted-foreground uppercase tracking-wider">Marked At</th>
                      <th className="px-6 py-4 text-center font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted">
                    {teachers.map((teacher: any) => {
                      const record = teacherRecords.find((r: any) => (r.teacher_id?._id || r.teacher_id) === teacher._id);
                      return (
                        <tr key={teacher._id} className="hover:bg-primary/5 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                {teacher.user_id?.full_name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{teacher.user_id?.full_name}</p>
                                <p className="text-xs text-muted-foreground">{teacher.specialization || 'Teacher'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {record ? (
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 rounded-full px-3 py-1">
                                <CheckCircle className="w-3 h-3" /> Marked: {record.status}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-destructive border-destructive/20 gap-1 rounded-full px-3 py-1">
                                <AlertCircle className="w-3 h-3" /> Not Marked
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-5 text-sm text-muted-foreground">
                            {record ? format(new Date(record.updatedAt), 'hh:mm a') : '--:--'}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-center">
                               <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary rounded-xl" disabled={!record}>
                                 <Eye className="w-4 h-4" /> View
                               </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="students">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAvailableClasses.map((cls) => {
                  const isMarked = markedClasses.includes(cls);
                  const classRecords = studentRecords.filter((r: any) => (r.class_id?.name || r.class_id) === cls);
                  const presenCount = classRecords.filter((r: any) => r.status === 'present').length;
                  
                  return (
                    <Card key={cls} className={cn(
                      "rounded-3xl border shadow-md transition-all hover:shadow-xl",
                      isMarked ? "bg-secondary/5 border-secondary/20" : "bg-card border-border border-dashed opacity-70"
                    )}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-white",
                            isMarked ? "bg-secondary shadow-lg shadow-secondary/20" : "bg-muted"
                          )}>
                            <Users className="w-6 h-6" />
                          </div>
                          {isMarked ? (
                            <Badge className="bg-green-500 text-white rounded-full">Completed</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground rounded-full italic">Pending</Badge>
                          )}
                        </div>
                        <h4 className="text-xl font-black mb-1">{cls}</h4>
                        <p className="text-sm text-muted-foreground">
                          {isMarked ? `${presenCount} / ${classRecords.length} Students Present` : 'Records not yet uploaded'}
                        </p>
                        
                        <Button 
                          variant="ghost" 
                          className="w-full mt-4 rounded-xl gap-2 hover:bg-secondary/10 hover:text-secondary group"
                          disabled={!isMarked}
                        >
                          <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
                          View Detailed Report
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default AttendanceMonitor;

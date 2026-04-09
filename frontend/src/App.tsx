import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast as sonnerToast } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Admissions from "./pages/Admissions";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import RegisterSuccessPage from "./pages/registerSucess";
import AdminDashboard from "./pages/portal/AdminDashboard";
import TeacherDashboard from "./pages/portal/TeacherDashboard";
import StudentDashboard from "./pages/portal/StudentDashboard";
import ParentDashboard from "./pages/portal/ParentDashboard";
import ManageStudents from "./pages/portal/admin/ManageStudents";
import ManageTeachers from "./pages/portal/admin/ManageTeachers";
import StudentRegistration from "./pages/portal/admin/StudentRegistration";
import Reports from "./pages/portal/admin/Reports";
import Announcements from "./pages/portal/admin/Announcements";
import FeesManagement from "./pages/portal/admin/FeesManagement";
import ClassManagement from "./pages/portal/admin/ClassManagement";
import ClassDetail from "./pages/portal/admin/ClassDetail";
import StudentDetail from "./pages/portal/admin/StudentDetail";
import RolePermissions from "./pages/portal/admin/RolePermissions";
import ContentManagement from "./pages/portal/admin/ContentManagement";
import FeedbackReview from "./pages/portal/admin/FeedbackReview";
import AssignmentsFeed from "./pages/portal/admin/Assignments";
import TeacherDetail from "./pages/portal/admin/TeacherDetail";
import EnrollmentReport from "./pages/portal/admin/EnrollmentReport";
import AdminLayout from "./components/layout/AdminLayout";
import AcademicReport from "./pages/portal/admin/AcademicReport";
import AttendanceReport from "./pages/portal/admin/AttendanceReport";
import FinancialReport from "./pages/portal/admin/FinancialReport";
import TeacherPerformanceReport from "./pages/portal/admin/TeacherPerformanceReport";
import CustomReport from "./pages/portal/admin/CustomReport";
import AttendanceManagement from "./pages/portal/teacher/AttendanceManagement";
import Gradebook from "./pages/portal/teacher/Gradebook";
import AssignmentManagement from "./pages/portal/teacher/AssignmentManagement";
import ResourcesManagement from "./pages/portal/teacher/ResourcesManagement";
import ParentCommunication from "./pages/portal/teacher/ParentCommunication";
import TeacherReports from "./pages/portal/teacher/TeacherReports";
import AttendanceMonitor from "./pages/portal/admin/AttendanceMonitor";
import NotFound from "./pages/NotFound";

const globalErrorHandler = (error: any) => {
  if (error?.response?.status !== 401) { // 401s are handled quietly by AuthContext logic
    const message = error?.response?.data?.message || error?.message || "An unexpected error occurred.";
    sonnerToast.error("Network Error", { description: message });
  }
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: globalErrorHandler,
  }),
  mutationCache: new MutationCache({
    onError: globalErrorHandler,
  }),
  defaultOptions: {
    queries: {
      retry: 1, // Only retry once on failure
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register-success" element={<RegisterSuccessPage />} />
            {/* Admin Portal */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/portal/admin" element={<AdminDashboard />} />
                <Route path="/portal/admin/students" element={<ManageStudents />} />
                <Route path="/portal/admin/students/:studentId" element={<StudentDetail />} />
                <Route path="/portal/admin/students/register" element={<StudentRegistration />} />
                <Route path="/portal/admin/teachers" element={<ManageTeachers />} />
                <Route path="/portal/admin/teachers/:teacherId" element={<TeacherDetail />} />
                <Route path="/portal/admin/attendance" element={<AttendanceMonitor />} />
                <Route path="/portal/admin/reports" element={<Reports />} />
                <Route path="/portal/admin/enrollment-report" element={<EnrollmentReport />} />
                <Route path="/portal/admin/academic-report" element={<AcademicReport />} />
                <Route path="/portal/admin/attendance-report" element={<AttendanceReport />} />
                <Route path="/portal/admin/financial-report" element={<FinancialReport />} />
                <Route path="/portal/admin/teacher-performance-report" element={<TeacherPerformanceReport />} />
                <Route path="/portal/admin/custom-report" element={<CustomReport />} />
                <Route path="/portal/admin/announcements" element={<Announcements />} />
                <Route path="/portal/admin/fees" element={<FeesManagement />} />
                <Route path="/portal/admin/classes" element={<ClassManagement />} />
                <Route path="/portal/admin/classes/:classId" element={<ClassDetail />} />
                <Route path="/portal/admin/classes/:classId/students/:studentId" element={<StudentDetail />} />
                <Route path="/portal/admin/permissions" element={<RolePermissions />} />
                <Route path="/portal/admin/content" element={<ContentManagement />} />
                <Route path="/portal/admin/feedback" element={<FeedbackReview />} />
                <Route path="/portal/admin/assignments" element={<AssignmentsFeed />} />
              </Route>
            </Route>

            {/* Teacher Portal */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route path="/portal/teacher" element={<TeacherDashboard />} />
              <Route path="/portal/teacher/attendance" element={<AttendanceManagement />} />
              <Route path="/portal/teacher/gradebook" element={<Gradebook />} />
              <Route path="/portal/teacher/assignments" element={<AssignmentManagement />} />
              <Route path="/portal/teacher/resources" element={<ResourcesManagement />} />
              <Route path="/portal/teacher/communication" element={<ParentCommunication />} />
              <Route path="/portal/teacher/reports" element={<TeacherReports />} />
            </Route>

            {/* Student & Parent Portals */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/portal/student" element={<StudentDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
              <Route path="/portal/parent" element={<ParentDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;

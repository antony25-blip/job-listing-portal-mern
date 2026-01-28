import { BrowserRouter, Routes, Route as RouteDom } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { JobsProvider } from "@/lib/jobs-context";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Jobs from "@/pages/jobs";
import JobDetail from "@/pages/job-detail";
import EmployerDashboard from "@/pages/employer/dashboard";
import PostJob from "@/pages/employer/post-job";
import MyJobs from "@/pages/employer/my-jobs";
import Applicants from "@/pages/employer/applicants";
import EmployerProfile from "@/pages/employer/profile";
import SeekerDashboard from "@/pages/seeker/dashboard";
import MyApplications from "@/pages/seeker/applications";
import Profile from "@/pages/seeker/profile";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/protected-route";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <RouteDom path="/" element={<Home />} />
        <RouteDom path="/login" element={<Login />} />
        <RouteDom path="/register" element={<Register />} />

        {/* Public Job Routes */}
        <RouteDom path="/jobs" element={<Jobs />} />
        <RouteDom path="/jobs/:id" element={<JobDetail />} />

        {/* Employer Routes */}
        <RouteDom path="/employer/dashboard" element={<ProtectedRoute allowedRole="employer"><EmployerDashboard /></ProtectedRoute>} />
        <RouteDom path="/employer/post-job" element={<ProtectedRoute allowedRole="employer"><PostJob /></ProtectedRoute>} />
        <RouteDom path="/employer/jobs" element={<ProtectedRoute allowedRole="employer"><MyJobs /></ProtectedRoute>} />
        <RouteDom path="/employer/applicants" element={<ProtectedRoute allowedRole="employer"><Applicants /></ProtectedRoute>} />
        <RouteDom path="/employer/settings" element={<ProtectedRoute allowedRole="employer"><EmployerProfile /></ProtectedRoute>} />

        {/* Seeker Routes */}
        <RouteDom path="/seeker/dashboard" element={<ProtectedRoute allowedRole="jobseeker"><SeekerDashboard /></ProtectedRoute>} />
        <RouteDom path="/seeker/applications" element={<ProtectedRoute allowedRole="jobseeker"><MyApplications /></ProtectedRoute>} />
        <RouteDom path="/seeker/profile" element={<ProtectedRoute allowedRole="jobseeker"><Profile /></ProtectedRoute>} />

        <RouteDom path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <JobsProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </JobsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

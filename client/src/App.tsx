import { Switch, Route } from "wouter";
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
import SeekerDashboard from "@/pages/seeker/dashboard";
import MyApplications from "@/pages/seeker/applications";
import Profile from "@/pages/seeker/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/jobs/:id" component={JobDetail} />
      <Route path="/employer/dashboard" component={EmployerDashboard} />
      <Route path="/employer/post-job" component={PostJob} />
      <Route path="/employer/jobs" component={MyJobs} />
      <Route path="/employer/applicants" component={Applicants} />
      <Route path="/seeker/dashboard" component={SeekerDashboard} />
      <Route path="/seeker/applications" component={MyApplications} />
      <Route path="/seeker/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
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

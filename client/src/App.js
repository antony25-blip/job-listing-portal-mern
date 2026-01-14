import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import CareerAdvice from "./pages/CareerAdvice";
import JobSeekerProfile from "./pages/JobSeekerProfile";
import JobSeekerProfileView from "./pages/JobSeekerProfileView";

import EmployerProfile from "./pages/EmployerProfile";
import EmployerProfileView from "./pages/EmployerProfileView";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import EmployerJobs from "./pages/EmployerJobs"; // 👈 NEW

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ========== Public Routes ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/career-advice" element={<CareerAdvice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ========== Protected Routes ========== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ========== Role-Based Routes ========== */}
        <Route
          path="/profile/jobseeker"
          element={
            <RoleRoute allowedRole="jobseeker">
              <JobSeekerProfile />
            </RoleRoute>
          }
        />

        <Route
          path="/profile/employer"
          element={
            <RoleRoute allowedRole="employer">
              <EmployerProfile />
            </RoleRoute>
          }
        />

        <Route
          path="/profile/employer/view"
          element={
            <RoleRoute allowedRole="employer">
              <EmployerProfileView />
            </RoleRoute>
          }
        />

        <Route
          path="/profile/jobseeker/view"
          element={
            <RoleRoute allowedRole="jobseeker">
              <JobSeekerProfileView />
            </RoleRoute>
          }
        />

        <Route
          path="/my-jobs"
          element={
            <RoleRoute allowedRole="employer">
              <EmployerJobs />
            </RoleRoute>
          }
        />

        <Route
          path="/jobs/create"
          element={
            <RoleRoute allowedRole="employer">
              <CreateJob />
            </RoleRoute>
          }
        />

        <Route
          path="/jobs/edit/:jobId"
          element={
            <RoleRoute allowedRole="employer">
              <EditJob />
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote"; // Frontend legacy property
  jobType?: "Full-time" | "Part-time" | "Contract" | "Remote"; // Backend property
  salary: string; // Frontend legacy property
  salaryMin?: number; // Backend property
  salaryMax?: number; // Backend property
  description: string;
  requirements: string[]; // Frontend naming (sometimes mapped from qualifications)
  qualifications?: string[]; // Backend property
  responsibilities?: string[]; // Backend property
  postedAt: string;
  employerId: string;
  applicants: Application[];
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  // New detailed fields
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  education: string;
  coverLetter: string;
  resume?: string; // Changed from resumeUrl to match backend
  // Legacy/computed fields (optional or derived)
  applicantName?: string;
  applicantEmail?: string;
  applicantAvatar?: string;

  appliedAt: string;
  status: "applied" | "pending" | "reviewed" | "shortlisted" | "rejected";
}

interface JobsContextType {
  jobs: Job[];
  addJob: (job: any) => Promise<void>; // Relaxed type to allow backend fields
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => void;
  applyToJob: (jobId: string, application: Omit<Application, "id" | "appliedAt" | "status" | "applicantId" | "jobId">) => Promise<boolean | void>;
  updateApplicationStatus: (jobId: string, applicationId: string, status: Application["status"]) => Promise<void>;
  getJobsByEmployer: (employerId: string) => Job[];
  getApplicationsByJobSeeker: () => { job: Job; application: Application }[];
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

// Helper to map backend job to frontend interface
const mapBackendToFrontendJob = (backendJob: any): Job => {
  return {
    ...backendJob,
    id: backendJob._id || backendJob.id,
    employerId: typeof backendJob.employerId === 'object' ? backendJob.employerId._id : backendJob.employerId, // Handle populated field
    type: backendJob.jobType || backendJob.type || "Full-time", // Fallback or map
    salary: backendJob.salaryMin && backendJob.salaryMax
      ? `$${(backendJob.salaryMin / 1000).toFixed(0)}k - $${(backendJob.salaryMax / 1000).toFixed(0)}k`
      : (backendJob.salary || "Competitive"),
    requirements: backendJob.qualifications || backendJob.requirements || [],
    postedAt: backendJob.createdAt ? new Date(backendJob.createdAt).toLocaleDateString() : (backendJob.postedAt || "Recently"),
    applicants: backendJob.applicants || [],
    jobType: backendJob.jobType, // Keep original
    salaryMin: backendJob.salaryMin,
    salaryMax: backendJob.salaryMax
  };
};

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userApplications, setUserApplications] = useState<{ job: Job; application: Application }[]>([]);

  useEffect(() => {
    fetchJobs();
    fetchUserApplications();
  }, []);

  const fetchUserApplications = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const res = await apiRequest("GET", "/api/applications/my-applications");
      if (res.ok) {
        const data = await res.json();
        const mappedApps = data.map((app: any) => {
          // Map backend application to frontend structure
          const application: Application = {
            id: app._id,
            jobId: app.jobId._id,
            applicantId: app.applicantId,
            fullName: app.fullName,
            email: app.email,
            phone: app.phone,
            skills: app.skills,
            experience: app.experience,
            education: app.education,
            coverLetter: app.coverLetter,
            resume: app.resume,
            appliedAt: app.createdAt,
            status: app.status
          };

          // Map populated job to frontend structure
          const job = mapBackendToFrontendJob(app.jobId);

          return { job, application };
        });
        setUserApplications(mappedApps);
      }
    } catch (e) {
      console.error("Failed to fetch user applications:", e);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await apiRequest("GET", "/api/jobs");
      const data = await res.json();
      let allJobs: Job[] = [];

      if (data.jobs) {
        allJobs = data.jobs.map(mapBackendToFrontendJob);
      }

      // If user is logged in, try to fetch "my-jobs" to get applicant details (employer only)
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const resMy = await apiRequest("GET", "/api/jobs/my-jobs");
          if (resMy.ok) {
            const myData = await resMy.json();
            if (myData.success && myData.jobs) {
              const myJobsDetailed = myData.jobs.map(mapBackendToFrontendJob);
              // Create a map of updated jobs
              const myJobsMap = new Map<string, Job>(myJobsDetailed.map((j: Job) => [j.id, j]));

              // Update existing jobs or add new ones (though they should be in public list usually)
              allJobs = allJobs.map(j => myJobsMap.has(j.id) ? myJobsMap.get(j.id)! : j);

              // Add any myJobs that weren't in public list (e.g. if filtering applied to public list)
              const allJobIds = new Set(allJobs.map(j => j.id));
              myJobsDetailed.forEach((j: Job) => {
                if (!allJobIds.has(j.id)) {
                  allJobs.push(j);
                }
              });
            }
          }
        } catch (e) {
          // Ignore error (e.g. 403 if not employer)
        }
      }

      setJobs(allJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const addJob = async (job: any) => {
    try {
      const res = await apiRequest("POST", "/api/jobs", job);
      const data = await res.json();
      if (data.success && data.job) {
        // Ensure applicants is initialized and map fields
        const newJob = mapBackendToFrontendJob(data.job);
        newJob.applicants = []; // Initialize empty for new job
        setJobs([newJob, ...jobs]);
      }
    } catch (error) {
      console.error("Failed to add job:", error);
    }
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    try {
      const res = await apiRequest("PUT", `/api/jobs/${id}`, updates);
      const data = await res.json();
      if (data.success && data.job) {
        // Preserve existing applicants if backend doesn't return them populated
        const updatedJobBase = mapBackendToFrontendJob(data.job);
        setJobs(jobs.map((job) => (job.id === id ? { ...updatedJobBase, applicants: job.applicants || [] } : job)));
      }
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  const deleteJob = (id: string) => {
    // TODO: Implement API Endpoint
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const applyToJob = async (jobId: string, application: Omit<Application, "id" | "appliedAt" | "status" | "applicantId" | "jobId">) => {
    try {
      const res = await apiRequest("POST", "/api/applications/apply", {
        jobId,
        ...application
      });
      const data = await res.json();

      if (data.application) {
        // Refetch jobs and user applications to ensure consistency
        await fetchJobs();
        await fetchUserApplications();
        return true;
      }
    } catch (error) {
      console.error("Failed to apply:", error);
      throw error;
    }
  };

  const updateApplicationStatus = async (jobId: string, applicationId: string, status: Application["status"]) => {
    try {
      const res = await apiRequest("PUT", `/api/applications/${applicationId}/status`, { status });
      const data = await res.json();

      if (data.application) {
        setJobs(
          jobs.map((job) =>
            job.id === jobId
              ? {
                ...job,
                applicants: job.applicants.map((app) =>
                  app.id === applicationId ? { ...app, status } : app
                ),
              }
              : job
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      throw error;
    }
  };

  const getJobsByEmployer = (employerId: string) => {
    return jobs.filter((job) => job.employerId === employerId);
  };

  const getApplicationsByJobSeeker = () => {
    return userApplications;
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        addJob,
        updateJob,
        deleteJob,
        applyToJob,
        updateApplicationStatus,
        getJobsByEmployer,
        getApplicationsByJobSeeker,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}

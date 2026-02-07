import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote" | "Internship" | "Freelance";
  salary: string;
  description: string;
  requirements: string[]; // Backend sends as responsibilities/qualifications. Need mapping.
  postedAt: string;
  employerId: string;
  applicants: Application[]; // Backend might not send this by default on list view
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantAvatar?: string;
  resumeUrl?: string;
  coverLetter: string;
  appliedAt: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
}

interface JobsContextType {
  jobs: Job[];
  isLoading: boolean;
  addJob: (job: any) => Promise<void>; // Relaxed type for now
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  applyToJob: (jobId: string, application: { coverLetter: string; resumeUrl?: string }) => Promise<void>;
  updateApplicationStatus: (jobId: string, applicationId: string, status: Application["status"]) => Promise<void>;
  getJobsByEmployer: (employerId: string) => Job[];
  getApplicationsByJobSeeker: (applicantId: string) => { job: Job; application: Application }[];
  myApplications: Application[];
  employerApplications: any[]; // Or properly typed Application[]
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all jobs
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/jobs");
      const data = await res.json();
      return data.jobs || [];
    }
  });

  // Fetch user applications
  const { data: myApplications } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return [];
        const res = await apiRequest("GET", "/api/applications/my-applications");
        const data = await res.json();
        return data.applications || [];
      } catch (e) {
        return [];
      }
    }
  });


  // Fetch employer applications (for employers only)
  const { data: employerApplications } = useQuery({
    queryKey: ["employer-applications"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return [];
        // We only fetch if user is employer, but we can't easily access user state here without circular dependency 
        // or passing it in. However, the API endpoint is protected by role.
        // A better way is to rely on the API returning 403/401 if not authorized, or just empty.

        // Check local storage or decode token to see if employer? 
        // For simplicity, we'll try to fetch, and if it fails (e.g. 403 because jobseeker), we return empty.
        const res = await apiRequest("GET", "/api/applications/employer");
        if (!res.ok) return [];
        const data = await res.json();
        return data.applications || [];
      } catch (e) {
        return [];
      }
    },
    // Only run this query if we have a token. 
    enabled: !!localStorage.getItem("token")
  });

  const [localJobs, setLocalJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (jobsData) {
      const mappedJobs = jobsData.map((job: any) => ({
        id: job._id,
        title: job.title,
        company: job.companyName || "Confidential",
        companyLogo: job.companyLogo,
        location: job.location,
        type: job.jobType,
        salary: `$${job.salaryMin} - $${job.salaryMax}`, // Map salary range
        description: job.description,
        requirements: job.qualifications || [], // Map qualifications
        postedAt: job.createdAt,
        employerId: job.employerId?._id || job.employerId,
        applicants: [] // Applications are fetched separately or by employer
      }));
      setLocalJobs(mappedJobs);
    }
  }, [jobsData]);

  const addJobMutation = useMutation({
    mutationFn: async (job: any) => {
      const res = await apiRequest("POST", "/api/jobs", job);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job Posted", description: "Your job listing is now live." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to post job", description: error.message });
    }
  });

  const applyJobMutation = useMutation({
    mutationFn: async ({ jobId, data }: { jobId: string; data: any }) => {
      const res = await apiRequest("POST", "/api/applications/apply", { jobId, ...data });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      // Also invalidate employer applications so employers see updates immediately (if testing on same machine)
      queryClient.invalidateQueries({ queryKey: ["employer-applications"] });
      toast({ title: "Application Sent", description: "Good luck!" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Application Failed", description: error.message });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string, status: string }) => {
      const res = await apiRequest("PUT", `/api/applications/${applicationId}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-applications"] });
    }
  });

  const addJob = async (job: any) => {
    await addJobMutation.mutateAsync(job);
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    // Implement update logic
  };

  const deleteJob = async (id: string) => {
    // Implement delete logic
  };

  const applyToJob = async (jobId: string, application: { coverLetter: string; resumeUrl?: string }) => {
    await applyJobMutation.mutateAsync({ jobId, data: application });
  };

  const updateApplicationStatus = async (jobId: string, applicationId: string, status: Application["status"]) => {
    await updateStatusMutation.mutateAsync({ applicationId, status });
  };

  const getJobsByEmployer = (employerId: string) => {
    return localJobs.filter((job) => job.employerId === employerId);
  };

  const getApplicationsByJobSeeker = (applicantId: string) => {
    // This logic mimics the old behavior but ideally should come from backend
    // Since we fetch "my-applications", we can map them here.
    if (!myApplications) return [];

    return myApplications.map((app: any) => ({
      job: {
        id: app.jobId._id,
        title: app.jobId.title,
        company: app.jobId.companyName || "Confidential",
        companyLogo: app.jobId.companyLogo,
        location: app.jobId.location,
        type: app.jobId.jobType,
        salary: `$${app.jobId.salaryMin} - $${app.jobId.salaryMax}`,
        // ... other job fields partial
      } as Job,
      application: {
        id: app._id,
        jobId: app.jobId._id,
        applicantId: app.applicantId,
        coverLetter: app.coverLetter,
        resumeUrl: app.resumeUrl,
        status: app.status,
        appliedAt: app.createdAt
      } as Application
    }));
  };

  return (
    <JobsContext.Provider
      value={{
        jobs: localJobs,
        isLoading,
        addJob,
        updateJob, // Placeholder
        deleteJob, // Placeholder
        applyToJob,
        updateApplicationStatus,
        getJobsByEmployer,
        getApplicationsByJobSeeker,
        myApplications: myApplications || [],
        employerApplications: employerApplications || [],
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

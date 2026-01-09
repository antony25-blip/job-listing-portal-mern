import { createContext, useContext, useState, ReactNode } from "react";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  description: string;
  requirements: string[];
  postedAt: string;
  employerId: string;
  applicants: Application[];
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatar?: string;
  resumeUrl?: string;
  coverLetter: string;
  appliedAt: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
}

interface JobsContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, "id" | "postedAt" | "applicants">) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  applyToJob: (jobId: string, application: Omit<Application, "id" | "appliedAt" | "status">) => void;
  updateApplicationStatus: (jobId: string, applicationId: string, status: Application["status"]) => void;
  getJobsByEmployer: (employerId: string) => Job[];
  getApplicationsByJobSeeker: (applicantId: string) => { job: Job; application: Application }[];
}

const initialJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=techcorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "We're looking for a skilled frontend developer to join our team and help build amazing user experiences.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Strong CSS skills", "Team leadership experience"],
    postedAt: "2024-01-15",
    employerId: "emp1",
    applicants: [
      {
        id: "app1",
        jobId: "1",
        applicantId: "seek1",
        applicantName: "John Doe",
        applicantEmail: "john@email.com",
        applicantAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        coverLetter: "I'm excited to apply for this position...",
        appliedAt: "2024-01-16",
        status: "pending",
      },
    ],
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "StartupXYZ",
    companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=startupxyz",
    location: "Remote",
    type: "Remote",
    salary: "$100k - $140k",
    description: "Join our growing team to build scalable backend systems.",
    requirements: ["Node.js expertise", "Database design", "API development", "Cloud services (AWS/GCP)"],
    postedAt: "2024-01-14",
    employerId: "emp2",
    applicants: [],
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "DesignHub",
    companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=designhub",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $120k",
    description: "Create beautiful and intuitive user interfaces for our products.",
    requirements: ["Figma mastery", "User research experience", "Design system knowledge", "Prototyping skills"],
    postedAt: "2024-01-13",
    employerId: "emp3",
    applicants: [],
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudScale",
    companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=cloudscale",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$130k - $170k",
    description: "Build and maintain our cloud infrastructure and CI/CD pipelines.",
    requirements: ["Kubernetes", "Terraform", "CI/CD experience", "Monitoring & logging"],
    postedAt: "2024-01-12",
    employerId: "emp4",
    applicants: [],
  },
  {
    id: "5",
    title: "Product Manager",
    company: "InnovateTech",
    companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=innovatetech",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$140k - $180k",
    description: "Lead product strategy and work with cross-functional teams.",
    requirements: ["5+ years PM experience", "Technical background", "Agile methodology", "Data-driven decisions"],
    postedAt: "2024-01-11",
    employerId: "emp5",
    applicants: [],
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "DataDriven Co.",
    companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=datadriven",
    location: "Boston, MA",
    type: "Contract",
    salary: "$150k - $200k",
    description: "Apply machine learning to solve complex business problems.",
    requirements: ["Python/R proficiency", "ML frameworks", "Statistical analysis", "PhD preferred"],
    postedAt: "2024-01-10",
    employerId: "emp6",
    applicants: [],
  },
];

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const addJob = (job: Omit<Job, "id" | "postedAt" | "applicants">) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      postedAt: new Date().toISOString().split("T")[0],
      applicants: [],
    };
    setJobs([newJob, ...jobs]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, ...updates } : job)));
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const applyToJob = (jobId: string, application: Omit<Application, "id" | "appliedAt" | "status">) => {
    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      appliedAt: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, applicants: [...job.applicants, newApplication] } : job
      )
    );
  };

  const updateApplicationStatus = (jobId: string, applicationId: string, status: Application["status"]) => {
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
  };

  const getJobsByEmployer = (employerId: string) => {
    return jobs.filter((job) => job.employerId === employerId);
  };

  const getApplicationsByJobSeeker = (applicantId: string) => {
    const results: { job: Job; application: Application }[] = [];
    jobs.forEach((job) => {
      job.applicants.forEach((app) => {
        if (app.applicantId === applicantId) {
          results.push({ job, application: app });
        }
      });
    });
    return results;
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

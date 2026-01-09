import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Users, Mail, FileText, Calendar, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { useJobs, Application } from "@/lib/jobs-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function Applicants() {
  const { jobs, updateApplicationStatus } = useJobs();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedApplicant, setSelectedApplicant] = useState<(Application & { jobTitle: string; jobId: string }) | null>(null);
  const [jobFilter, setJobFilter] = useState<string>("all");

  const myJobs = jobs.filter((job) => job.employerId === user?.id || job.company === user?.company);

  const allApplicants = myJobs.flatMap((job) =>
    job.applicants.map((app) => ({
      ...app,
      jobTitle: job.title,
      jobId: job.id,
    }))
  );

  const filteredApplicants =
    jobFilter === "all"
      ? allApplicants
      : allApplicants.filter((app) => app.jobId === jobFilter);

  const handleStatusChange = (jobId: string, applicationId: string, status: Application["status"]) => {
    updateApplicationStatus(jobId, applicationId, status);
    toast({
      title: "Status Updated",
      description: `Application marked as ${status}`,
    });
  };

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "reviewed":
        return <Eye className="w-4 h-4" />;
      case "shortlisted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "reviewed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "shortlisted":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }} data-testid="text-page-title">
              Applicants
            </h1>
            <p className="text-muted-foreground mt-1">Review and manage job applications</p>
          </div>
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="w-[250px]" data-testid="select-job-filter">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {myJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: "Total", count: filteredApplicants.length, color: "from-primary to-purple-600" },
            { label: "Pending", count: filteredApplicants.filter((a) => a.status === "pending").length, color: "from-amber-500 to-orange-500" },
            { label: "Shortlisted", count: filteredApplicants.filter((a) => a.status === "shortlisted").length, color: "from-green-500 to-emerald-500" },
            { label: "Rejected", count: filteredApplicants.filter((a) => a.status === "rejected").length, color: "from-red-500 to-rose-500" },
          ].map((stat, i) => (
            <Card key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applicants List */}
        {filteredApplicants.length > 0 ? (
          <div className="grid gap-4">
            {filteredApplicants.map((applicant, index) => (
              <Card
                key={applicant.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`card-applicant-${applicant.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={applicant.applicantAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.applicantEmail}`}
                        alt={applicant.applicantName}
                        className="w-14 h-14 rounded-xl"
                      />
                      <div>
                        <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                          {applicant.applicantName}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {applicant.applicantEmail}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {applicant.jobTitle}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Applied {applicant.appliedAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={`gap-1 ${getStatusColor(applicant.status)}`}>
                        {getStatusIcon(applicant.status)}
                        {applicant.status}
                      </Badge>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApplicant(applicant)}
                            data-testid={`button-view-applicant-${applicant.id}`}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Applicant Details</DialogTitle>
                          </DialogHeader>
                          {selectedApplicant && (
                            <div className="space-y-6 mt-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={selectedApplicant.applicantAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedApplicant.applicantEmail}`}
                                  alt={selectedApplicant.applicantName}
                                  className="w-16 h-16 rounded-xl"
                                />
                                <div>
                                  <h3 className="text-lg font-semibold">{selectedApplicant.applicantName}</h3>
                                  <p className="text-muted-foreground">{selectedApplicant.applicantEmail}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Cover Letter
                                </h4>
                                <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                                  {selectedApplicant.coverLetter || "No cover letter provided."}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Update Status</h4>
                                <div className="flex flex-wrap gap-2">
                                  {(["pending", "reviewed", "shortlisted", "rejected"] as const).map((status) => (
                                    <Button
                                      key={status}
                                      variant={selectedApplicant.status === status ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => {
                                        handleStatusChange(selectedApplicant.jobId, selectedApplicant.id, status);
                                        setSelectedApplicant({ ...selectedApplicant, status });
                                      }}
                                      className={selectedApplicant.status === status ? "gradient-primary text-white border-0" : ""}
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Select
                        value={applicant.status}
                        onValueChange={(v: Application["status"]) => handleStatusChange(applicant.jobId, applicant.id, v)}
                      >
                        <SelectTrigger className="w-[130px]" data-testid={`select-status-${applicant.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                No Applicants Yet
              </h3>
              <p className="text-muted-foreground">
                {myJobs.length === 0
                  ? "Post a job to start receiving applications"
                  : "Applicants will appear here when they apply to your jobs"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Briefcase, MapPin, DollarSign, Calendar, Clock, CheckCircle, XCircle, Eye, ExternalLink } from "lucide-react";
import { useJobs } from "@/lib/jobs-context";
import { useAuth } from "@/lib/auth-context";

export default function MyApplications() {
  const { user } = useAuth();
  const { getApplicationsByJobSeeker } = useJobs();

  const myApplications = getApplicationsByJobSeeker(user?.id || "");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "reviewed":
        return <Eye className="w-4 h-4" />;
      case "shortlisted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "reviewed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "shortlisted":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }} data-testid="text-page-title">
              My Applications
            </h1>
            <p className="text-muted-foreground mt-1">Track the status of your job applications</p>
          </div>
          <Link href="/jobs">
            <Button className="gradient-primary text-white border-0 gap-2">
              Browse More Jobs
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: "Total", count: myApplications.length, color: "from-primary to-purple-600" },
            { label: "Pending", count: myApplications.filter((a) => a.application.status === "pending").length, color: "from-amber-500 to-orange-500" },
            { label: "Shortlisted", count: myApplications.filter((a) => a.application.status === "shortlisted").length, color: "from-green-500 to-emerald-500" },
            { label: "Rejected", count: myApplications.filter((a) => a.application.status === "rejected").length, color: "from-red-500 to-rose-500" },
          ].map((stat, i) => (
            <Card key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications List */}
        {myApplications.length > 0 ? (
          <div className="grid gap-4">
            {myApplications.map(({ job, application }, index) => (
              <Card
                key={application.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`card-application-${application.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                        {job.companyLogo ? (
                          <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-lg" />
                        ) : (
                          <Briefcase className="w-7 h-7 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground">{job.company}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied {application.appliedAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={`gap-1 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>

                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm" className="gap-1" data-testid={`button-view-job-${job.id}`}>
                          View Job
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Your cover letter:</span>{" "}
                        {application.coverLetter.slice(0, 150)}
                        {application.coverLetter.length > 150 && "..."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                No Applications Yet
              </h3>
              <p className="text-muted-foreground mb-6">Start applying to jobs to track your progress here</p>
              <Link href="/jobs">
                <Button className="gradient-primary text-white border-0">
                  Browse Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

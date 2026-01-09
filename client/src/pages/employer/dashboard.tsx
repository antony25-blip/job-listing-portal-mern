import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Briefcase, Users, Eye, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { useJobs } from "@/lib/jobs-context";
import { useAuth } from "@/lib/auth-context";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { jobs } = useJobs();

  const myJobs = jobs.filter((job) => job.employerId === user?.id || job.company === user?.company);
  const totalApplicants = myJobs.reduce((sum, job) => sum + job.applicants.length, 0);
  const pendingReview = myJobs.reduce(
    (sum, job) => sum + job.applicants.filter((a) => a.status === "pending").length,
    0
  );

  const stats = [
    { label: "Active Jobs", value: myJobs.length, icon: Briefcase, color: "from-primary to-purple-600" },
    { label: "Total Applicants", value: totalApplicants, icon: Users, color: "from-accent to-teal-500" },
    { label: "Pending Review", value: pendingReview, icon: Eye, color: "from-amber-500 to-orange-500" },
    { label: "This Month", value: "+12%", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }} data-testid="text-dashboard-title">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-1">Manage your job postings and review applicants</p>
          </div>
          <Link href="/employer/post-job">
            <Button className="gradient-primary text-white border-0 gap-2" data-testid="button-post-new-job">
              <Plus className="w-5 h-5" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="animate-slide-up overflow-hidden" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Jobs */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle style={{ fontFamily: "var(--font-display)" }}>Recent Job Postings</CardTitle>
            <Link href="/employer/jobs">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {myJobs.length > 0 ? (
              <div className="space-y-4">
                {myJobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors"
                    data-testid={`job-listing-${job.id}`}
                  >
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job.location} • {job.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">
                        <Users className="w-3 h-3 mr-1" />
                        {job.applicants.length} applicants
                      </Badge>
                      <Badge variant="outline">{job.salary}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No jobs posted yet</h3>
                <p className="text-muted-foreground mb-4">Start attracting talent by posting your first job</p>
                <Link href="/employer/post-job">
                  <Button className="gradient-primary text-white border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applicants */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle style={{ fontFamily: "var(--font-display)" }}>Recent Applicants</CardTitle>
            <Link href="/employer/applicants">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {totalApplicants > 0 ? (
              <div className="space-y-4">
                {myJobs
                  .flatMap((job) =>
                    job.applicants.map((app) => ({
                      ...app,
                      jobTitle: job.title,
                    }))
                  )
                  .slice(0, 5)
                  .map((applicant) => (
                    <div
                      key={applicant.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={applicant.applicantAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.applicantEmail}`}
                          alt={applicant.applicantName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium">{applicant.applicantName}</h4>
                          <p className="text-sm text-muted-foreground">Applied for {applicant.jobTitle}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          applicant.status === "pending"
                            ? "secondary"
                            : applicant.status === "shortlisted"
                            ? "default"
                            : "outline"
                        }
                        className={applicant.status === "shortlisted" ? "gradient-accent text-white border-0" : ""}
                      >
                        {applicant.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No applicants yet</h3>
                <p className="text-muted-foreground">Applicants will appear here when they apply to your jobs</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

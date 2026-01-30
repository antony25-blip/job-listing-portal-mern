import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Search, FileText, CheckCircle, Clock, Briefcase, ArrowRight, User, TrendingUp } from "lucide-react";
import { useJobs } from "@/lib/jobs-context";
import { useAuth } from "@/lib/auth-context";

export default function SeekerDashboard() {
  const { user } = useAuth();
  const { jobs, getApplicationsByJobSeeker } = useJobs();

  const myApplications = getApplicationsByJobSeeker();
  const pendingCount = myApplications.filter((a) => a.application.status === "pending" || a.application.status === "applied").length;
  const reviewedCount = myApplications.filter((a) => a.application.status === "reviewed" || a.application.status === "shortlisted").length;

  const profileCompletion = [
    !!user?.name,
    !!user?.email,
    !!user?.title,
    !!user?.bio,
    (user?.skills?.length || 0) > 0,
    (user?.experience?.length || 0) > 0,
  ].filter(Boolean).length;

  const profilePercent = Math.round((profileCompletion / 6) * 100);

  const stats = [
    { label: "Applications", value: myApplications.length, icon: FileText, color: "from-primary to-purple-600" },
    { label: "Pending Review", value: pendingCount, icon: Clock, color: "from-amber-500 to-orange-500" },
    { label: "In Progress", value: reviewedCount, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
    { label: "Jobs Available", value: jobs.length, icon: Briefcase, color: "from-accent to-teal-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }} data-testid="text-dashboard-title">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">Track your applications and discover new opportunities</p>
          </div>
          <Link to="/jobs">
            <Button className="gradient-primary text-white border-0 gap-2" data-testid="button-browse-jobs">
              <Search className="w-5 h-5" />
              Browse Jobs
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Completion */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <User className="w-5 h-5" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{profilePercent}%</span>
                  {profilePercent < 100 && (
                    <Badge variant="secondary">Incomplete</Badge>
                  )}
                </div>
                <Progress value={profilePercent} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {profilePercent < 100
                    ? "Complete your profile to stand out to employers"
                    : "Great job! Your profile is complete"}
                </p>
                {profilePercent < 100 && (
                  <Link to="/seeker/profile">
                    <Button variant="outline" className="w-full gap-2">
                      Complete Profile
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle style={{ fontFamily: "var(--font-display)" }}>Recent Applications</CardTitle>
              <Link to="/seeker/applications">
                <Button variant="ghost" className="gap-2">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {myApplications.length > 0 ? (
                <div className="space-y-4">
                  {myApplications.slice(0, 4).map(({ job, application }) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          application.status === "shortlisted"
                            ? "default"
                            : application.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                        className={application.status === "shortlisted" ? "gradient-accent text-white border-0" : ""}
                      >
                        {application.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet</p>
                  <Link to="/jobs">
                    <Button variant="outline" className="gap-2">
                      <Search className="w-4 h-4" />
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Jobs */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <TrendingUp className="w-5 h-5" />
              Recommended For You
            </CardTitle>
            <Link to="/jobs">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.slice(0, 3).map((job) => (
                <Link to={`/jobs/${job.id}`} key={job.id}>
                  <div className="p-4 rounded-lg border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-10 h-10 rounded-lg"
                      />
                      <Badge variant="secondary" className="text-xs">
                        {job.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium mb-1">{job.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                    <p className="text-sm font-medium text-primary">{job.salary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

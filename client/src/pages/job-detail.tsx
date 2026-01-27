import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, MapPin, DollarSign, Clock, Building2, ArrowLeft, CheckCircle, Send } from "lucide-react";
import { useJobs } from "@/lib/jobs-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function JobDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { jobs, applyToJob } = useJobs();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Link href="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const alreadyApplied = job.applicants.some((app) => app.applicantId === user?.id) || hasApplied;

  const handleApply = () => {
    if (!user) {
      setLocation("/login");
      return;
    }

    applyToJob(job.id, {
      fullName,
      email,
      phone,
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      experience,
      education,
      coverLetter,
      // Pass other fields if they are still part of the updated interface or remove them
      // Assuming context handles user mapping if we don't pass them, or we pass what's needed for the backend.
      // Based on previous context update, backend expects the above fields.
    });

    setHasApplied(true);
    setIsApplying(false);
    toast({
      title: "Application Submitted!",
      description: "Your application has been sent to the employer.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                JobFlow
              </span>
            </Link>
            <div className="flex items-center gap-3">
              {isAuthenticated && user?.role === "jobseeker" && (
                <Link href="/seeker/dashboard">
                  <Button variant="ghost" data-testid="button-my-dashboard">My Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="grid gap-6">
          {/* Job Header */}
          <Card className="animate-slide-up">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="w-14 h-14 rounded-xl" />
                  ) : (
                    <Building2 className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }} data-testid="text-job-title">
                        {job.title}
                      </h1>
                      <p className="text-lg text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge
                      variant={job.type === "Remote" ? "default" : "secondary"}
                      className={`text-sm ${job.type === "Remote" ? "gradient-accent text-white border-0" : ""}`}
                    >
                      {job.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Posted {job.postedAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {user?.role === "jobseeker" && !alreadyApplied && (
                  <Dialog open={isApplying} onOpenChange={setIsApplying}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="gradient-primary text-white border-0 px-8" data-testid="button-apply-now">
                        <Send className="w-5 h-5 mr-2" />
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle style={{ fontFamily: "var(--font-display)" }}>Apply for {job.title}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Education</label>
                            <Input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Highest degree" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Skills (comma separated)</label>
                          <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, TypeScript" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Experience</label>
                          <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="5 years in Frontend Development" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Cover Letter</label>
                          <Textarea
                            placeholder="Tell the employer why you're a great fit..."
                            rows={4}
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full gradient-primary text-white border-0"
                        onClick={handleApply}
                        data-testid="button-submit-application"
                      >
                        Submit Application
                      </Button>
                    </DialogContent>
                  </Dialog>
                )}

                {alreadyApplied && (
                  <Button size="lg" disabled className="px-8" data-testid="button-applied">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Applied
                  </Button>
                )}

                {!isAuthenticated && (
                  <Link href="/login">
                    <Button size="lg" className="gradient-primary text-white border-0 px-8">
                      Sign in to Apply
                    </Button>
                  </Link>
                )}

                {user?.role === "employer" && (
                  <p className="text-muted-foreground">You're viewing this as an employer.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle style={{ fontFamily: "var(--font-display)" }}>About this Role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle style={{ fontFamily: "var(--font-display)" }}>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle style={{ fontFamily: "var(--font-display)" }}>About {job.company}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-lg" />
                  ) : (
                    <Building2 className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{job.company}</h4>
                  <p className="text-muted-foreground text-sm">Technology Company</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                A leading company in the tech industry, dedicated to innovation and creating exceptional products that make a difference.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Briefcase, Users, MapPin, DollarSign, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useJobs, Job } from "@/lib/jobs-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function MyJobs() {
  const { jobs, updateJob, deleteJob } = useJobs();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const myJobs = jobs.filter((job) => {
    if (!user?.id) return false;
    // Handle both string ID and object comparison if necessary, though context ensures string
    return job.employerId === user.id || (typeof job.employerId === 'object' && (job.employerId as any)._id === user.id);
  });

  const handleUpdate = () => {
    if (editingJob) {
      updateJob(editingJob.id, editingJob);
      toast({
        title: "Job Updated",
        description: "Your job listing has been updated successfully.",
      });
      setEditingJob(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteJob(id);
    toast({
      title: "Job Deleted",
      description: "The job listing has been removed.",
    });
    setDeleteConfirm(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }} data-testid="text-page-title">
              My Job Postings
            </h1>
            <p className="text-muted-foreground mt-1">Manage and edit your job listings</p>
          </div>
          <Link href="/employer/post-job">
            <Button className="gradient-primary text-white border-0 gap-2">
              <Plus className="w-5 h-5" />
              Post New Job
            </Button>
          </Link>
        </div>

        {myJobs.length > 0 ? (
          <div className="grid gap-4">
            {myJobs.map((job, index) => (
              <Card
                key={job.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`card-job-${job.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </span>
                          <Badge variant="secondary">{job.type}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="gap-1">
                        <Users className="w-3 h-3" />
                        {(job.applicants || []).length} applicants
                      </Badge>

                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="ghost" size="icon" data-testid={`button-view-${job.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>

                      <Button variant="ghost" size="icon" onClick={() => setEditingJob(job)} data-testid={`button-edit-${job.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Dialog open={deleteConfirm === job.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirm(job.id)}
                            data-testid={`button-delete-${job.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Job Posting</DialogTitle>
                          </DialogHeader>
                          <p className="text-muted-foreground">
                            Are you sure you want to delete "{job.title}"? This action cannot be undone.
                          </p>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => handleDelete(job.id)}>
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                No Jobs Posted Yet
              </h3>
              <p className="text-muted-foreground mb-6">Create your first job posting to start receiving applications</p>
              <Link href="/employer/post-job">
                <Button className="gradient-primary text-white border-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Job
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog - Moved Outside Loop */}
        <Dialog open={!!editingJob} onOpenChange={(open) => !open && setEditingJob(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Job Posting</DialogTitle>
            </DialogHeader>
            {editingJob && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={editingJob.title || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={editingJob.location || ""}
                      onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={editingJob.type}
                      onValueChange={(v: Job["type"]) => setEditingJob({ ...editingJob, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <Input
                    value={editingJob.salary || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={4}
                    value={editingJob.description || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingJob(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate} className="gradient-primary text-white border-0">
                    Save Changes
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div >
    </DashboardLayout >
  );
}

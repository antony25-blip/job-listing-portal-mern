import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Plus, X } from "lucide-react";
import { useJobs } from "@/lib/jobs-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function PostJob() {
  const [, setLocation] = useLocation();
  const { addJob } = useJobs();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [location, setJobLocation] = useState("");
  const [type, setType] = useState<"Full-time" | "Part-time" | "Contract" | "Remote">("Full-time");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse salary range "120k - 150k" or "120000"
    const salaryNumbers = salary.match(/\d+/g)?.map(Number) || [0, 0];
    const salaryMin = salaryNumbers[0] || 0;
    const salaryMax = salaryNumbers[1] || salaryMin;

    addJob({
      title,
      company: user?.company || user?.name || "My Company",
      companyLogo: `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`,
      location,
      jobType: type, // Map type to jobType
      salaryMin, // Add parsed salaries
      salaryMax,
      description,
      qualifications: requirements.filter((r) => r.trim() !== ""), // Map requirements to qualifications
      responsibilities: ["Responsibilities to be added"], // Backend requires this field, need a dummy or UI input
      employerId: user?.id || "",
    });

    toast({
      title: "Job Posted Successfully!",
      description: "Your job listing is now live.",
    });

    setLocation("/employer/jobs");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }} data-testid="text-page-title">
            Post a New Job
          </h1>
          <p className="text-muted-foreground mt-1">Fill in the details to create your job listing</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Basic information about the position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Frontend Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  data-testid="input-job-title"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={location}
                    onChange={(e) => setJobLocation(e.target.value)}
                    required
                    data-testid="input-job-location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select value={type} onValueChange={(v: typeof type) => setType(v)}>
                    <SelectTrigger id="type" data-testid="select-job-type">
                      <SelectValue />
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
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  placeholder="e.g., $120k - $150k"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                  data-testid="input-salary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  data-testid="textarea-description"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Skills and qualifications needed for this role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Requirement ${index + 1}`}
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    data-testid={`input-requirement-${index}`}
                  />
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                      data-testid={`button-remove-requirement-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={addRequirement}
                data-testid="button-add-requirement"
              >
                <Plus className="w-4 h-4" />
                Add Requirement
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setLocation("/employer/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-white border-0 px-8" data-testid="button-submit-job">
              Post Job
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

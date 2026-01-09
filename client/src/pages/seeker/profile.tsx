import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Camera, Plus, X, MapPin, Briefcase, Mail, Phone, FileText, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [location, setLocation] = useState(user?.location || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState<string[]>(user?.experience || []);
  const [newExperience, setNewExperience] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addExperience = () => {
    if (newExperience.trim()) {
      setExperience([...experience, newExperience.trim()]);
      setNewExperience("");
    }
  };

  const removeExperience = (exp: string) => {
    setExperience(experience.filter((e) => e !== exp));
  };

  const handleSave = () => {
    updateProfile({
      name,
      title,
      location,
      phone,
      bio,
      skills,
      experience,
    });
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }} data-testid="text-page-title">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and preferences</p>
        </div>

        {/* Profile Header Card */}
        <Card className="animate-slide-up overflow-hidden">
          <div className="h-32 gradient-primary" />
          <CardContent className="relative pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-card shadow-lg">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-accent/20">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full gradient-primary text-white border-0"
                  data-testid="button-change-photo"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 pt-4 sm:pt-0">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {user?.name}
                </h2>
                <p className="text-muted-foreground">{user?.title || "Add your job title"}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {user?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-profile-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="title"
                    placeholder="e.g., Senior Developer"
                    className="pl-10"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    data-testid="input-profile-title"
                  />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State"
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    data-testid="input-profile-location"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-testid="input-profile-phone"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea
                id="bio"
                placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                data-testid="textarea-profile-bio"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add skills to help employers find you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 py-1.5 px-3">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                    data-testid={`button-remove-skill-${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                data-testid="input-new-skill"
              />
              <Button onClick={addSkill} variant="outline" className="gap-1" data-testid="button-add-skill">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
            <CardDescription>Add your work history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {experience.length > 0 && (
              <div className="space-y-3">
                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <span>{exp}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExperience(exp)}
                      data-testid={`button-remove-experience-${i}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 3 years at TechCorp as Developer"
                value={newExperience}
                onChange={(e) => setNewExperience(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExperience())}
                data-testid="input-new-experience"
              />
              <Button onClick={addExperience} variant="outline" className="gap-1" data-testid="button-add-experience">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resume */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
            <CardDescription>Upload your resume to apply faster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-medium mb-1">Drop your resume here or click to upload</p>
              <p className="text-sm text-muted-foreground mb-4">PDF, DOC, or DOCX (max 5MB)</p>
              <Button variant="outline" data-testid="button-upload-resume">
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gradient-primary text-white border-0 px-8 gap-2" data-testid="button-save-profile">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

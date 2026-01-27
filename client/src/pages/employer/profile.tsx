import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Building2, MapPin, Globe, Phone, FileText } from "lucide-react";

interface EmployerProfileData {
    companyName: string;
    companyEmail: string;
    phone: string;
    website: string;
    description: string;
    location: string;
    logo: string;
}

export default function EmployerProfile() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    // Fetch profile
    const { data: profileData, isLoading } = useQuery({
        queryKey: ["/api/profile/employer"],
        queryFn: async () => {
            const res = await apiRequest("GET", "/api/profile/employer");
            const data = await res.json();
            return data.success ? data.profile : null;
        }
    });

    const form = useForm<EmployerProfileData>({
        defaultValues: {
            companyName: user?.name || "",
            companyEmail: user?.email || "",
            phone: "",
            website: "",
            description: "",
            location: "",
            logo: ""
        }
    });

    // Update form when data is loaded
    useEffect(() => {
        if (profileData) {
            form.reset({
                companyName: profileData.companyName || user?.name || "",
                companyEmail: profileData.companyEmail || user?.email || "",
                phone: profileData.phone || "",
                website: profileData.website || "",
                description: profileData.description || "",
                location: profileData.location || "",
                logo: profileData.logo || ""
            });
        }
    }, [profileData, user, form]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data: EmployerProfileData) => {
            const res = await apiRequest("POST", "/api/profile/employer", data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Profile Updated",
                description: "Your company profile has been saved successfully.",
            });
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ["/api/profile/employer"] });
        },
        onError: (error) => {
            toast({
                title: "Update Failed",
                description: error.message || "Failed to update profile",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: EmployerProfileData) => {
        updateProfileMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        Company Settings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your company profile and contact information
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Company Details</CardTitle>
                                    <CardDescription>
                                        This information will be displayed on your job postings
                                    </CardDescription>
                                </div>
                                {!isEditing && (
                                    <Button type="button" onClick={() => setIsEditing(true)}>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4" />
                                        Company Name
                                    </Label>
                                    <Input
                                        {...form.register("companyName")}
                                        disabled={!isEditing}
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Website
                                    </Label>
                                    <Input
                                        {...form.register("website")}
                                        disabled={!isEditing}
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Company Email
                                    </Label>
                                    <Input
                                        {...form.register("companyEmail")}
                                        disabled={!isEditing}
                                        type="email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone
                                    </Label>
                                    <Input
                                        {...form.register("phone")}
                                        disabled={!isEditing}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </Label>
                                <Input
                                    {...form.register("location")}
                                    disabled={!isEditing}
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>About Company</Label>
                                <Textarea
                                    {...form.register("description")}
                                    disabled={!isEditing}
                                    rows={4}
                                    placeholder="Tell us about your company, mission, and culture..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Logo URL</Label>
                                <Input
                                    {...form.register("logo")}
                                    disabled={!isEditing}
                                    placeholder="https://example.com/logo.png"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter a direct URL to your company logo (optional)
                                </p>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            form.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="gradient-primary text-white border-0"
                                        disabled={updateProfileMutation.isPending}
                                    >
                                        {updateProfileMutation.isPending && (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        )}
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </form>
            </div>
        </DashboardLayout>
    );
}

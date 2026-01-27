import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Building2, Search, ArrowRight, Star, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
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
            <div className="hidden md:flex items-center gap-8">
              <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-browse-jobs">
                Browse Jobs
              </Link>
              <Link href="/employers" className="text-muted-foreground hover:text-foreground transition-colors">
                For Employers
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="gradient-primary text-white border-0" data-testid="button-register">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Star className="w-3 h-3 mr-1" /> Trusted by 10,000+ companies
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Find Your{" "}
              <span className="text-gradient">Dream Job</span>
              <br />
              or Hire Top Talent
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Connect with the best opportunities and candidates. Whether you're looking to advance your career or build your team, JobFlow makes it seamless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=jobseeker">
                <Button size="lg" className="gradient-primary text-white border-0 px-8 py-6 text-lg" data-testid="button-find-jobs">
                  <Search className="w-5 h-5 mr-2" />
                  Find Jobs
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/register?role=employer">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg" data-testid="button-post-job">
                  <Building2 className="w-5 h-5 mr-2" />
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Jobs", value: "50K+", icon: Briefcase },
              { label: "Companies", value: "10K+", icon: Building2 },
              { label: "Job Seekers", value: "500K+", icon: Users },
              { label: "Hired", value: "100K+", icon: CheckCircle },
            ].map((stat, i) => (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Why Choose JobFlow?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The modern platform designed for both job seekers and employers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Job Matching",
                description: "Our AI-powered system matches you with the most relevant opportunities based on your skills and preferences.",
                icon: "🎯",
              },
              {
                title: "Easy Application Tracking",
                description: "Keep track of all your applications in one place with real-time status updates.",
                icon: "📊",
              },
              {
                title: "Direct Messaging",
                description: "Communicate directly with employers and candidates through our secure messaging system.",
                icon: "💬",
              },
              {
                title: "Company Profiles",
                description: "Learn about company culture, benefits, and team before you apply.",
                icon: "🏢",
              },
              {
                title: "Resume Builder",
                description: "Create a professional resume that stands out with our easy-to-use builder.",
                icon: "📝",
              },
              {
                title: "Career Resources",
                description: "Access interview tips, salary guides, and career advice from industry experts.",
                icon: "📚",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-card border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of professionals who've found their perfect match on JobFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=jobseeker">
              <Button size="lg" className="bg-white text-foreground hover:bg-gray-100 px-8 py-6 text-lg">
                Start Job Search
              </Button>
            </Link>
            <Link href="/register?role=employer">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Hire Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                JobFlow
              </span>
            </div>
            <div className="flex gap-8 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 JobFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

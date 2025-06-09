"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stethoscope, BedDouble, Pill, FileText, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard requiredRoles={["patient", "admin", "pharmacy"]}> {/* Allow all roles to see a base dashboard */}
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-headline">
            Welcome, {user?.name || "User"}!
          </h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your health resources.</p>
        </header>

        {user?.role === 'patient' && (
          <PatientDashboardContent />
        )}
        {user?.role === 'admin' && (
           <AdminTeaserDashboardContent />
        )}
        {user?.role === 'pharmacy' && (
           <PharmacyTeaserDashboardContent />
        )}

      </div>
    </AuthGuard>
  );
}

function PatientDashboardContent() {
  const features = [
    { title: "AI Symptom Checker", description: "Get insights on your symptoms.", icon: Stethoscope, link: "/symptom-checker", cta: "Check Symptoms", dataAiHint: "medical examination", imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxkb2N0b3J8ZW58MHx8fHwxNzQ5NDE4Mjc0fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Bed Availability", description: "Find available hospital beds.", icon: BedDouble, link: "/bed-availability", cta: "Find Beds", dataAiHint: "hospital interior", imageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxob3NwaXRhbHxlbnwwfHx8fDE3NDk0ODM0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "Medicine Checker", description: "Check medicine availability.", icon: Pill, link: "/medicine-checker", cta: "Find Medicine", dataAiHint: "pharmacy shelf", imageUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8bWVkaWNpbmV8ZW58MHx8fHwxNzQ5NDgzMzYzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { title: "My Health Records", description: "Access your medical history (Demo).", icon: FileText, link: "#", cta: "View Records", dataAiHint: "medical chart", imageUrl: "https://placehold.co/300x150.png" },
  ];

  return (
     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <DashboardCard key={feature.title} {...feature} />
        ))}
      </div>
  );
}

function AdminTeaserDashboardContent() {
 return (
    <div className="text-center p-8 bg-card rounded-lg shadow-md">
      <UserCircle className="h-16 w-16 text-primary mx-auto mb-4" />
      <h2 className="text-2xl font-bold font-headline">Admin Portal</h2>
      <p className="text-muted-foreground mt-2 mb-4">You are logged in as an Administrator.</p>
      <Button asChild>
        <Link href="/admin/dashboard">Go to Admin Dashboard</Link>
      </Button>
    </div>
  );
}

function PharmacyTeaserDashboardContent() {
  return (
    <div className="text-center p-8 bg-card rounded-lg shadow-md">
      <Pill className="h-16 w-16 text-primary mx-auto mb-4" />
      <h2 className="text-2xl font-bold font-headline">Pharmacy Portal</h2>
      <p className="text-muted-foreground mt-2 mb-4">You are logged in as Pharmacy Staff.</p>
      <Button asChild>
        <Link href="/pharmacy/dashboard">Go to Pharmacy Dashboard</Link>
      </Button>
    </div>
  );
}


interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  cta: string;
  dataAiHint: string;
  imageUrl: string;
}

function DashboardCard({ title, description, icon: Icon, link, cta, dataAiHint, imageUrl }: DashboardCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Icon className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{description}</CardDescription>
        <Image src={imageUrl} alt={title} width={300} height={150} className="my-4 rounded-md mx-auto object-cover" data-ai-hint={dataAiHint} />
      </CardContent>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={link}>{cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

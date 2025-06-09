"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCog, BedDouble, Users, Activity, Settings, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const adminFeatures = [
    { title: "Manage Bed Availability", description: "Update hospital bed counts.", icon: BedDouble, link: "/bed-availability", cta: "Manage Beds", dataAiHint: "hospital staff" },
    { title: "User Management", description: "View and manage system users.", icon: Users, link: "#", cta: "Manage Users", dataAiHint: "data user interface" },
    { title: "System Analytics", description: "View usage statistics and reports.", icon: BarChart3, link: "#", cta: "View Analytics", dataAiHint: "dashboard chart" },
    { title: "Notifications Log", description: "Review system alerts and notifications.", icon: Activity, link: "#", cta: "View Logs", dataAiHint: "server room" },
    { title: "System Settings", description: "Configure application settings.", icon: Settings, link: "#", cta: "Configure Settings", dataAiHint: "gear mechanism" },
  ];

  return (
    <AuthGuard requiredRoles={["admin"]}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold font-headline">
                Administrator Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome, {user?.name || "Admin"}. Manage the system efficiently.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminFeatures.map((feature) => (
            <Card key={feature.title} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
                 <Image src={`https://placehold.co/300x150.png`} alt={feature.title} width={300} height={150} className="my-4 rounded-md mx-auto" data-ai-hint={feature.dataAiHint} />
              </CardContent>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={feature.link}>{feature.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Stats (Demo)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">1,234</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold">85%</p>
              <p className="text-sm text-muted-foreground">Bed Occupancy</p>
            </div>
            <div>
              <p className="text-3xl font-bold">56</p>
              <p className="text-sm text-muted-foreground">Symptom Checks Today</p>
            </div>
             <div>
              <p className="text-3xl font-bold text-green-500">Online</p>
              <p className="text-sm text-muted-foreground">System Status</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </AuthGuard>
  );
}

"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building, Pill, ListOrdered, Truck, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function PharmacyDashboardPage() {
  const { user } = useAuth();

  const pharmacyFeatures = [
    { title: "Manage Medicine Inventory", description: "Update stock levels and availability.", icon: Pill, link: "/medicine-checker", cta: "Manage Inventory", dataAiHint: "pharmacy inventory" },
    { title: "View Prescription Orders", description: "Process and manage incoming prescriptions (Demo).", icon: ListOrdered, link: "#", cta: "View Orders", dataAiHint: "prescription paper" },
    { title: "Supplier Management", description: "Track orders from suppliers (Demo).", icon: Truck, link: "#", cta: "Manage Suppliers", dataAiHint: "delivery truck" },
    { title: "Pharmacy Settings", description: "Update pharmacy details and operating hours (Demo).", icon: Settings, link: "#", cta: "Store Settings", dataAiHint: "storefront pharmacy" },
  ];

  return (
    <AuthGuard requiredRoles={["pharmacy"]}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
           <div className="flex items-center gap-3 mb-2">
            <Building className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold font-headline">
                Pharmacy Dashboard
              </h1>
              <p className="text-muted-foreground">Welcome, {user?.name || "Staff"}. Manage your pharmacy operations.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pharmacyFeatures.map((feature) => (
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
              <p className="text-3xl font-bold">125</p>
              <p className="text-sm text-muted-foreground">Prescriptions Today</p>
            </div>
            <div>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-muted-foreground">Inventory Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold">15</p>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
            </div>
             <div>
              <p className="text-3xl font-bold text-green-500">Open</p>
              <p className="text-sm text-muted-foreground">Store Status</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}

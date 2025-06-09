"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BedDouble, Hospital, MapPin, Search } from "lucide-react";
import type { BedAvailability } from "@/types";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const mockBedData: BedAvailability[] = [
  { id: "1", hospitalName: "City General Hospital", totalBeds: 200, availableBeds: 45, lastUpdated: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), location: "Metropolis", contact: "555-0101" },
  { id: "2", hospitalName: "St. Luke's Medical Center", totalBeds: 150, availableBeds: 12, lastUpdated: new Date(Date.now() - 3600 * 1000 * 1).toISOString(), location: "Metropolis", contact: "555-0102" },
  { id: "3", hospitalName: "Hope County Hospital", totalBeds: 80, availableBeds: 5, lastUpdated: new Date(Date.now() - 3600 * 1000 * 5).toISOString(), location: "Suburbia", contact: "555-0201" },
  { id: "4", hospitalName: "Riverdale Community Clinic", totalBeds: 50, availableBeds: 25, lastUpdated: new Date(Date.now() - 3600 * 1000 * 0.5).toISOString(), location: "Suburbia", contact: "555-0202" },
  { id: "5", hospitalName: "Downtown Emergency Care", totalBeds: 120, availableBeds: 0, lastUpdated: new Date(Date.now() - 3600 * 1000 * 3).toISOString(), location: "Metropolis", contact: "555-0103" },
];

function formatLastUpdated(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function BedAvailabilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [hospitals, setHospitals] = useState<BedAvailability[]>([]);

  useEffect(() => {
    // Simulate API call
    setHospitals(mockBedData);
  }, []);

  const locations = useMemo(() => {
    const allLocations = new Set(hospitals.map(h => h.location).filter(Boolean) as string[]);
    return ["all", ...Array.from(allLocations)];
  }, [hospitals]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(hospital => {
      const matchesSearch = hospital.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === "all" || hospital.location === locationFilter;
      return matchesSearch && matchesLocation;
    });
  }, [hospitals, searchTerm, locationFilter]);
  
  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = total > 0 ? (available / total) * 100 : 0;
    if (percentage === 0) return "text-destructive font-semibold";
    if (percentage < 20) return "text-yellow-600 dark:text-yellow-400 font-semibold";
    return "text-green-600 dark:text-green-400 font-semibold";
  };


  return (
    <AuthGuard requiredRoles={["patient", "admin"]}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-headline flex items-center justify-center gap-2">
            <BedDouble className="h-8 w-8 text-primary" /> Hospital Bed Availability
          </h1>
          <p className="text-muted-foreground mt-2">
            Find real-time (simulated) bed availability in hospitals.
          </p>
        </header>

        <Image 
          src="https://placehold.co/1200x300.png" 
          alt="Hospital exterior" 
          width={1200} 
          height={300} 
          className="w-full h-auto rounded-lg mb-8 object-cover"
          data-ai-hint="hospital building" 
        />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Available Beds</CardTitle>
            <CardDescription>
              Search and filter to find hospitals with available beds. Data is illustrative.
            </CardDescription>
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by hospital name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground inline-block"/>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>
                      {loc === "all" ? "All Locations" : loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredHospitals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Hospital Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Available Beds</TableHead>
                    <TableHead className="text-right">Total Beds</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHospitals.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Hospital className="h-5 w-5 text-primary shrink-0" /> {hospital.hospitalName}
                      </TableCell>
                      <TableCell>{hospital.location || "N/A"}</TableCell>
                      <TableCell className={`text-right ${getAvailabilityColor(hospital.availableBeds, hospital.totalBeds)}`}>
                        {hospital.availableBeds}
                      </TableCell>
                      <TableCell className="text-right">{hospital.totalBeds}</TableCell>
                      <TableCell>{formatLastUpdated(hospital.lastUpdated)}</TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" asChild>
                           <a href={`tel:${hospital.contact}`}>{hospital.contact || "N/A"}</a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <BedDouble className="h-12 w-12 mx-auto mb-4" />
                <p>No hospitals found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}

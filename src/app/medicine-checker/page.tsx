
"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pill, Store, MapPin, Search, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import type { PharmacyMedicineAvailability, Medicine } from "@/types";
import { useState, useMemo, useEffect } from "react";

const mockMedicines: Medicine[] = [
  { id: "med1", name: "Paracetamol 500mg", genericName: "Acetaminophen" },
  { id: "med2", name: "Amoxicillin 250mg", genericName: "Amoxicillin" },
  { id: "med3", name: "Ibuprofen 200mg", genericName: "Ibuprofen" },
  { id: "med4", name: "Cetirizine 10mg", genericName: "Cetirizine" },
];

const mockPharmacyData: Omit<PharmacyMedicineAvailability, 'medicine' | 'id'>[] = [
  { pharmacyName: "HealthFirst Pharmacy", pharmacyAddress: "123 Main St, Metropolis", availability: "In Stock", lastUpdated: new Date(Date.now() - 3600 * 1000 * 1).toISOString(), distance: "1.2 km" },
  { pharmacyName: "Wellness Drugstore", pharmacyAddress: "456 Oak Ave, Metropolis", availability: "Low Stock", lastUpdated: new Date(Date.now() - 3600 * 1000 * 3).toISOString(), distance: "2.5 km" },
  { pharmacyName: "Community Meds", pharmacyAddress: "789 Pine Ln, Suburbia", availability: "Out of Stock", lastUpdated: new Date(Date.now() - 3600 * 1000 * 0.5).toISOString(), distance: "5.1 km" },
  { pharmacyName: "QuickCare Pharma", pharmacyAddress: "101 Elm Rd, Metropolis", availability: "In Stock", lastUpdated: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), distance: "0.8 km" },
];

function formatLastUpdated(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const generateMapsUrl = (address?: string, name?: string) => {
  const query = address || name;
  if (!query) return "#"; 
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export default function MedicineCheckerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState(""); // Mock location search
  const [availabilityResults, setAvailabilityResults] = useState<PharmacyMedicineAvailability[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    setIsLoading(true);
    setSearched(true);
    // Simulate API call and filtering
    setTimeout(() => {
      const selectedMedicine = mockMedicines.find(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (selectedMedicine) {
        const results = mockPharmacyData.map((pharmacy, index) => ({
          ...pharmacy,
          id: `pharm${index + 1}`,
          medicine: selectedMedicine,
          // Randomize availability a bit for demo
          availability: Math.random() > 0.7 ? "Out of Stock" : (Math.random() > 0.4 ? "Low Stock" : "In Stock"),
        }));
        setAvailabilityResults(results);
      } else {
        setAvailabilityResults([]);
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const getAvailabilityChip = (availability: PharmacyMedicineAvailability['availability']) => {
    switch (availability) {
      case "In Stock":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"><CheckCircle className="w-3 h-3 mr-1" />In Stock</span>;
      case "Low Stock":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</span>;
      case "Out of Stock":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"><XCircle className="w-3 h-3 mr-1" />Out of Stock</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">N/A</span>;
    }
  };


  return (
    <AuthGuard requiredRoles={["patient", "pharmacy"]}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-headline flex items-center justify-center gap-2">
            <Pill className="h-8 w-8 text-primary" /> Medicine Availability Checker
          </h1>
          <p className="text-muted-foreground mt-2">
            Find availability of medicines in nearby pharmacies (simulated).
          </p>
        </header>

        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Search for Medicine</CardTitle>
            <CardDescription>
              Enter medicine name and your location to find availability.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSearch}>
            <CardContent className="space-y-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Enter medicine name (e.g., Paracetamol)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  list="medicine-suggestions"
                />
                <datalist id="medicine-suggestions">
                  {mockMedicines.map((med) => (
                    <option key={med.id} value={med.name} />
                  ))}
                </datalist>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your location (e.g., Metropolis or Zip Code)"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading || !searchTerm}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search Availability
              </Button>
            </CardFooter>
          </form>
        </Card>

        {searched && !isLoading && (
          <div className="mt-8">
            {availabilityResults.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold font-headline">Results for "{availabilityResults[0].medicine.name}"</h2>
                {availabilityResults.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5 text-primary" />{item.pharmacyName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" />{item.pharmacyAddress}</CardDescription>
                        </div>
                        {getAvailabilityChip(item.availability)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Distance: {item.distance || "N/A"}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <a href={generateMapsUrl(item.pharmacyAddress, item.pharmacyName)} target="_blank" rel="noopener noreferrer">
                          <MapPin className="mr-2 h-4 w-4" /> View on Map
                        </a>
                      </Button>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                      Last updated: {formatLastUpdated(item.lastUpdated)}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="mt-8 text-center py-10">
                <CardContent>
                  <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No results found for "{searchTerm}" in the specified location, or the medicine is not in our mock database.</p>
                  <p className="text-xs text-muted-foreground mt-2">Try searching for: Paracetamol, Amoxicillin, Ibuprofen, or Cetirizine.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}


"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pill, PackagePlus, Search, Edit3, PlusCircle } from "lucide-react";
import type { Medicine } from "@/types";
import { useState, useMemo, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Define a type for inventory items, extending Medicine with availability
interface InventoryMedicine extends Medicine {
  availability: "In Stock" | "Low Stock" | "Out of Stock";
}

// Mock initial data - ideally this would come from a backend
const baseMedicines: Medicine[] = [
  { id: "med1", name: "Paracetamol 500mg", genericName: "Acetaminophen" },
  { id: "med2", name: "Amoxicillin 250mg", genericName: "Amoxicillin" },
  { id: "med3", name: "Ibuprofen 200mg", genericName: "Ibuprofen" },
  { id: "med4", name: "Cetirizine 10mg", genericName: "Cetirizine" },
  { id: "med5", name: "Lisinopril 10mg", genericName: "Lisinopril" },
];

const initialInventory: InventoryMedicine[] = baseMedicines.map(med => ({
  ...med,
  availability: Math.random() > 0.7 ? "Out of Stock" : (Math.random() > 0.4 ? "Low Stock" : "In Stock"), // Random initial stock
}));


export default function PharmacyInventoryPage() {
  const [inventory, setInventory] = useState<InventoryMedicine[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddMedicineDialog, setShowAddMedicineDialog] = useState(false);

  // Form state for adding new medicine
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newGenericName, setNewGenericName] = useState("");
  const [newAvailability, setNewAvailability] = useState<InventoryMedicine['availability']>("In Stock");

  const filteredInventory = useMemo(() => {
    return inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => a.name.localeCompare(b.name));
  }, [inventory, searchTerm]);

  const handleAvailabilityChange = (medicineId: string, newAvailability: InventoryMedicine['availability']) => {
    setInventory(prevInventory =>
      prevInventory.map(item =>
        item.id === medicineId ? { ...item, availability: newAvailability } : item
      )
    );
  };

  const handleAddMedicine = (e: FormEvent) => {
    e.preventDefault();
    if (!newMedicineName) {
      alert("Medicine Name is required."); // Basic validation
      return;
    }
    const newMedicine: InventoryMedicine = {
      id: `med-${Date.now()}`, // Simple unique ID for demo
      name: newMedicineName,
      genericName: newGenericName,
      availability: newAvailability,
    };
    setInventory(prevInventory => [...prevInventory, newMedicine]);
    setShowAddMedicineDialog(false);
    // Reset form
    setNewMedicineName("");
    setNewGenericName("");
    setNewAvailability("In Stock");
  };
  
  const getAvailabilityColor = (availability: InventoryMedicine['availability']) => {
    if (availability === "Out of Stock") return "text-destructive";
    if (availability === "Low Stock") return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  return (
    <AuthGuard requiredRoles={["pharmacy"]}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-headline flex items-center justify-center gap-2">
            <Pill className="h-8 w-8 text-primary" /> Manage Medicine Inventory
          </h1>
          <p className="text-muted-foreground mt-2">
            Add new medicines and update stock availability for your pharmacy.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Current Inventory</CardTitle>
                <CardDescription>
                  View, search, and update medicine stock levels.
                </CardDescription>
              </div>
              <Dialog open={showAddMedicineDialog} onOpenChange={setShowAddMedicineDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Medicine
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleAddMedicine}>
                    <DialogHeader>
                      <DialogTitle>Add New Medicine to Inventory</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new medicine. Click save when done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="medName" className="text-right">Name*</Label>
                        <Input id="medName" value={newMedicineName} onChange={(e) => setNewMedicineName(e.target.value)} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="genericName" className="text-right">Generic Name</Label>
                        <Input id="genericName" value={newGenericName} onChange={(e) => setNewGenericName(e.target.value)} className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="availability" className="text-right">Availability*</Label>
                        <Select value={newAvailability} onValueChange={(val) => setNewAvailability(val as InventoryMedicine['availability'])}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select stock status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="In Stock">In Stock</SelectItem>
                                <SelectItem value="Low Stock">Low Stock</SelectItem>
                                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Medicine</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by medicine name or generic name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredInventory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Medicine Name</TableHead>
                      <TableHead>Generic Name</TableHead>
                      <TableHead className="text-center">Availability</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Pill className="h-5 w-5 text-primary shrink-0" /> {item.name}
                        </TableCell>
                        <TableCell>{item.genericName || "N/A"}</TableCell>
                        <TableCell className="text-center w-[200px]">
                          <Select
                            value={item.availability}
                            onValueChange={(value) => handleAvailabilityChange(item.id, value as InventoryMedicine['availability'])}
                          >
                            <SelectTrigger className={cn("w-full min-w-[120px]", getAvailabilityColor(item.availability))}>
                              <SelectValue placeholder="Set stock" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Stock">In Stock</SelectItem>
                              <SelectItem value="Low Stock">Low Stock</SelectItem>
                              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        {/* <TableCell className="text-right">
                          <Button variant="ghost" size="icon" disabled>
                            <Edit3 className="h-4 w-4" />
                            <span className="sr-only">Edit (Not Implemented)</span>
                          </Button>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <PackagePlus className="h-12 w-12 mx-auto mb-4" />
                <p>{searchTerm ? "No medicines found matching your search." : "Your inventory is empty. Add medicines to get started."}</p>
              </div>
            )}
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
                Changes made here are for demonstration and will not persist after leaving the page.
            </p>
           </CardFooter>
        </Card>
      </div>
    </AuthGuard>
  );
}

export type Role = "patient" | "admin" | "pharmacy" | null;

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
}

export interface BedAvailability {
  id: string;
  hospitalName: string;
  totalBeds: number;
  availableBeds: number;
  lastUpdated: string; // ISO date string
  location?: string; // Optional: City or address
  contact?: string; // Optional: Phone number
}

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  manufacturer?: string;
}

export interface PharmacyMedicineAvailability {
  id: string;
  pharmacyName: string;
  pharmacyAddress: string;
  medicine: Medicine;
  availability: "In Stock" | "Low Stock" | "Out of Stock" | "Not Available";
  lastUpdated: string; // ISO date string
  distance?: string; // Optional: e.g., "2.5 km"
}

export interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ElementType;
  roles?: Role[]; // If undefined, accessible to all authenticated users or public
  public?: boolean; // True if accessible without authentication
}

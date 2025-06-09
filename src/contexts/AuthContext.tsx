"use client";

import type { User, Role } from "@/types";
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  login: (role: Exclude<Role, null>) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<Exclude<Role, null>, User> = {
  patient: { id: "patient1", name: "John Patient", role: "patient", email: "patient@example.com" },
  admin: { id: "admin1", name: "Jane Admin", role: "admin", email: "admin@example.com" },
  pharmacy: { id: "pharmacy1", name: "Pat Pharmacy", role: "pharmacy", email: "pharmacy@example.com" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("currentUser");
    }
    setLoading(false);
  }, []);

  const login = useCallback((role: Exclude<Role, null>) => {
    const selectedUser = mockUsers[role];
    setUser(selectedUser);
    localStorage.setItem("currentUser", JSON.stringify(selectedUser));
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "pharmacy") {
      router.push("/pharmacy/dashboard");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("currentUser");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith('/login') && pathname !== '/') {
      //router.push('/login');
    }
  }, [user, loading, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

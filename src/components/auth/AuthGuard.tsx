"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: Exclude<Role, null>[];
}

export function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (requiredRoles && user.role && !requiredRoles.includes(user.role as Exclude<Role, null>)) {
      // If user role is not in requiredRoles, redirect to their default dashboard or login
      // This is a simple redirect, more sophisticated handling might be needed
      if (user.role === 'admin') router.replace('/admin/dashboard');
      else if (user.role === 'pharmacy') router.replace('/pharmacy/dashboard');
      else router.replace('/dashboard'); // Default for patient or if role doesn't match
    }
  }, [user, loading, router, requiredRoles]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (requiredRoles && user.role && !requiredRoles.includes(user.role as Exclude<Role, null>)) {
     // Still loading or redirecting
     return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

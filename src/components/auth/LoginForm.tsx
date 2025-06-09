"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";
import { AppLogo } from "@/components/icons/AppLogo";
import { siteConfig, ROLES } from "@/config/site";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: Exclude<Role, null>) => {
    // In a real app, you'd validate email and password here
    login(role);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <AppLogo className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">{siteConfig.name}</CardTitle>
          <CardDescription>Select your role to login.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {ROLES.map((role) => (
                <TabsTrigger key={role.value} value={role.value}>
                  <role.icon className="mr-2 h-4 w-4 inline-block" />
                  {role.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {ROLES.map((roleInfo) => (
              <TabsContent key={roleInfo.value} value={roleInfo.value}>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(roleInfo.value); }} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor={`${roleInfo.value}-email`}>Email</Label>
                    <Input id={`${roleInfo.value}-email`} type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${roleInfo.value}-password`}>Password</Label>
                    <Input id={`${roleInfo.value}-password`} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Login as {roleInfo.label}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account? <Button variant="link" className="p-0 h-auto">Sign up</Button>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              (This is a demo. Any email/password will work.)
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

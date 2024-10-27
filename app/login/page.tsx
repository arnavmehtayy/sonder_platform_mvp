"use client";
import { login, signup } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Analytics } from '@vercel/analytics/react';

export default function LoginPage() {
  return (
    <main>
      <style>{`body, html { touch-action: auto;
    overflow-y: scroll;
    overflow: auto;
    height: 100%;
    width: 100%; }`}</style>

      <div className="flex min-h-screen items-center justify-center bg-white">
        <Card className="w-[350px] bg-white bg-opacity-50 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-800">Welcome</CardTitle>
            <CardDescription className="text-center text-gray-700">Login to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-white bg-opacity-90 backdrop-blur-sm border-blue-800 focus:border-[#00A9C1]"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password"
                  className="bg-white bg-opacity-90 backdrop-blur-sm border-blue-800 focus:border-[#00A9C1]"
                  required 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button 
                  formAction={login}
                  className="flex-1 bg-gradient-to-r from-blue-800 to-[#00A9C1] text-white hover:opacity-90"
                >
                  Log in
                </Button>
                <Button 
                  formAction={signup}
                  variant="outline"
                  className="flex-1 border-blue-800 text-blue-800 hover:bg-white hover:bg-opacity-20"
                >
                  Sign up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Analytics />
    </main>
  )
}
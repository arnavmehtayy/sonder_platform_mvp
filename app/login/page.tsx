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

      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <Card className="w-[350px] bg-[#1E1E1E] border-[#01A9B2] border-2 shadow-[0_0_15px_rgba(1,169,178,0.3)]">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#01A9B2] font-bold">Welcome Back!</CardTitle>
            <CardDescription className="text-center text-gray-300">Sign in to continue your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-[#2D2D2D] border-[#01A9B2] focus:border-[#00D1DC] text-white placeholder:text-gray-400"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password"
                  className="bg-[#2D2D2D] border-[#01A9B2] focus:border-[#00D1DC] text-white placeholder:text-gray-400"
                  required 
                />
              </div>
              <div className="flex pt-4">
                <Button 
                  formAction={login}
                  className="flex-1 bg-[#01A9B2] hover:bg-[#00D1DC] text-white transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Log in
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
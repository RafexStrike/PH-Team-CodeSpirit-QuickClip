"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GithubIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { FaGooglePlusG } from "react-icons/fa";
import { Input } from '@/components/ui/input';

const page = () => {
const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;

  const email = form.email.value;     // 👈 works if name="email"
  const password = form.password.value; // 👈 works if name="password"

  console.log("Email:", email);
  console.log("Password:", password);
};


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores, iusto?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button className="w-full" variant="outline">
            <FaGooglePlusG />
            Sign In With Google
          </Button>

          <Button className="w-full" variant="outline">
            <GithubIcon className="size-4" />
            Sign In With Github
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-2">Or Login With</span>
          </div>
<form onSubmit={handleSubmit}>
  <div className="grid gap-2 my-2">
    <Label htmlFor="email">Email</Label>
    <Input 
      id="email" 
      name="email"  // 👈 this is required
      type="email" 
      placeholder="jhon@gmail.com" 
    />
  </div>
  <div className="grid gap-2">
    <Label htmlFor="password">Password</Label>
    <Input 
      id="password" 
      name="password"  // 👈 this is required
      type="password" 
      placeholder="********" 
    />
  </div>
  <Button type="submit" className="w-full mt-4">
    Continue With Email
  </Button>
</form>

        </CardContent>
      </Card>
    </div>
  );
};

export default page;

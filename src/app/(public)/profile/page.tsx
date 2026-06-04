"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const user = session?.user;

  if (status === "loading") return null;
  if (!user) redirect("/auth/login");

  return (
    <div className="flex justify-center items-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-md shadow-md border rounded-2xl">
        <CardHeader className="flex flex-col items-center space-y-3 pt-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? "User"}
            />
            <AvatarFallback>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>

          <CardTitle className="text-2xl font-semibold text-center">
            {user?.name ?? "No Name"}
          </CardTitle>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </CardHeader>

        <CardContent className="space-y-4 mt-4">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-700 font-medium">Full Name</span>
            <span className="text-gray-600">
              {user?.name ?? "Not provided"}
            </span>
          </div>

          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-700 font-medium">Email</span>
            <span className="text-gray-600">{user?.email}</span>
          </div>

          <div className="pt-4">
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

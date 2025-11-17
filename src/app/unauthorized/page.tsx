"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center  px-4">
      <div className="bg-white shadow-md rounded-xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">
          Unauthorized
        </h1>
        <p className="text-gray-700 mb-6">
          You don’t have permission to access this page.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="default" onClick={() => router.push("/")}>
            Go to Home
          </Button>
          <Button variant="outline" onClick={() => router.push("/auth/login")}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

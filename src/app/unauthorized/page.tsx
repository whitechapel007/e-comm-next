import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white shadow-md rounded-xl p-10 max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">403</h1>
        <p className="text-xl font-semibold mb-2">Access denied</p>
        <p className="text-gray-500 mb-8">
          You don&apos;t have permission to view this page.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

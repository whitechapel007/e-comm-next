"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Eboya Boi</p>
      <h1 className="text-4xl font-extrabold mb-2">Something went wrong</h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        An unexpected error occurred. Our team has been notified. Please try
        again or return to the homepage.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}

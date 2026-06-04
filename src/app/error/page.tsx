import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Eboya Boi</p>
      <h1 className="text-4xl font-extrabold mb-3">Something went wrong</h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        We ran into an unexpected error. Please go back and try again.
      </p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Eboya Boi</p>
      <h1 className="text-8xl font-extrabold text-black/10 mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-3">Page not found</h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/shop">Browse the collection</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}

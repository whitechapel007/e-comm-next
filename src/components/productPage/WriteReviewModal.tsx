"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface WriteReviewModalProps {
  productSlug: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WriteReviewModal({
  productSlug,
  onClose,
  onSuccess,
}: WriteReviewModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const effective = hovered || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Review must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to submit review.");
        return;
      }

      toast.success("Review submitted — thank you!");
      onSuccess();
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Prompt unauthenticated users to log in
  if (!session?.user) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>Sign in to leave a review</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-6">
            You need to be logged in to write a review.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => router.push("/auth/login")}>Sign in</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Star picker */}
          <div>
            <p className="text-sm font-medium mb-2">Your rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} out of 5`}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={32}
                    className={cn(
                      "transition-colors",
                      star <= effective
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
              {effective > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {ratingLabels[effective]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <p className="text-sm font-medium mb-2">Your review</p>
            <Textarea
              placeholder="Share your experience with this item — fit, quality, what you loved…"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {comment.length}/1000
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import ReviewCard from "@/components/common/ReviewCard";
import WriteReviewModal from "../WriteReviewModal";
import { ReviewsResponse } from "../../../../types/review";

interface ReviewsContentProps {
  productId: string;
  productSlug: string;
}

const LIMIT = 6;

const ReviewsContent = ({ productId: _, productSlug }: Readonly<ReviewsContentProps>) => {
  const queryClient = useQueryClient();
  const [sort, setSort]               = useState("latest");
  const [page, setPage]               = useState(1);
  const [modalOpen, setModalOpen]     = useState(false);

  const queryKey = ["reviews", productSlug, sort, page];

  const { data, isLoading, isError } = useQuery<ReviewsResponse>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(
        `/api/products/${productSlug}/reviews?sort=${sort}&page=${page}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error("Failed to load reviews");
      return res.json();
    },
    staleTime: 30_000,
  });

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleReviewSuccess = () => {
    // Invalidate all pages so the new review appears immediately
    queryClient.invalidateQueries({ queryKey: ["reviews", productSlug] });
    setPage(1);
  };

  // Render star distribution bar
  const renderRatingBar = (starCount: number, total: number, pct: number) => (
    <div key={starCount} className="flex items-center gap-2 text-xs">
      <span className="w-3 text-right text-gray-500">{starCount}</span>
      <Star size={10} className="text-yellow-400 fill-yellow-400 shrink-0" />
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: total > 0 ? `${pct}%` : "0%" }}
        />
      </div>
      <span className="w-6 text-gray-400">{pct}%</span>
    </div>
  );

  return (
    <section>
      {/* Header row */}
      <div className="flex items-center justify-between flex-col sm:flex-row mb-5 sm:mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl sm:text-2xl font-bold text-black">All Reviews</h3>
          {data && (
            <span className="text-sm text-black/60">({data.totalCount.toLocaleString()})</span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="min-w-32.5 font-medium text-xs sm:text-sm px-4 py-3 text-black bg-[#F0F0F0] border-none rounded-full h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest rated</SelectItem>
              <SelectItem value="lowest">Lowest rated</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-3 rounded-full bg-black font-medium text-xs sm:text-sm h-11"
          >
            Write a Review
          </Button>
        </div>
      </div>

      {/* Aggregate stats */}
      {data && data.ratingCount > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 bg-gray-50 rounded-2xl">
          <div className="flex flex-col items-center justify-center sm:pr-6 sm:border-r border-gray-200 min-w-25">
            <span className="text-5xl font-extrabold">{data.averageRating.toFixed(1)}</span>
            <div className="flex gap-0.5 my-1">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  className={s <= Math.round(data.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">{data.ratingCount} review{data.ratingCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex flex-col justify-center gap-1.5 flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = data.ratingCount > 0
                ? Math.round(
                    (data.reviews.filter((r) => r.rating === star).length / data.ratingCount) * 100
                  )
                : 0;
              return renderRatingBar(star, data.ratingCount, pct);
            })}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-center text-red-500 py-10 text-sm">
          Failed to load reviews. Please try again later.
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !isError && data?.reviews.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-black/70 mb-2">No reviews yet</p>
          <p className="text-sm text-black/40 mb-6">
            Be the first to share your experience with this item.
          </p>
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-full px-6"
          >
            Write the first review
          </Button>
        </div>
      )}

      {/* Review grid */}
      {data && data.reviews.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {data.reviews.map((review) => (
              <ReviewCard key={review.id} data={review} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-full"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Write review modal */}
      {modalOpen && (
        <WriteReviewModal
          productSlug={productSlug}
          onClose={() => setModalOpen(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </section>
  );
};

export default ReviewsContent;

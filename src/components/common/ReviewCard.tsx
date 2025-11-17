// components/common/ReviewCard.tsx

import { cn } from "@/lib/utils";
import { Review } from "../../../utils/mockData";
import Image from "next/image";
import RenderStars from "../ui/RenderStars";

type ReviewCardProps = {
  data: Review;
  className?: string;
};

export default function ReviewCard({ data, className }: ReviewCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-2xl shadow flex flex-col gap-3 bg-white",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-1">
        {data.avatarUrl ? (
          <Image
            src={data.avatarUrl}
            alt={data.name}
            className="w-10 h-10 rounded-full object-cover border"
            width={400}
            height={400}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-lg select-none">
            {data.name.slice(0, 1)}
          </div>
        )}
        <div>
          <div className="font-semibold text-base">{data.name}</div>
          {data.location && (
            <div className="text-xs text-gray-400">{data.location}</div>
          )}
        </div>
      </div>
      <div className="flex gap-1 items-center mb-2">
        <RenderStars rating={data.rating} />
        <span className="ml-2 text-xs text-gray-500 font-medium">
          {data.rating} / 5
        </span>
      </div>
      <div className="text-base text-gray-800 leading-relaxed">{data.text}</div>
      {data.product && (
        <div className="text-xs text-neutral-500 mt-3">
          Reviewed: <span className="font-semibold">{data.product}</span>
        </div>
      )}
      {data.date && (
        <div className="text-xs text-neutral-400 mt-1 text-right">
          {data.date}
        </div>
      )}
    </div>
  );
}

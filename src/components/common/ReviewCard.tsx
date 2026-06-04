import { cn } from "@/lib/utils";
import Image from "next/image";
import RenderStars from "../ui/RenderStars";
import { ReviewType } from "../../../types/review";

type ReviewCardProps = Readonly<{
  data: ReviewType;
  className?: string;
}>;

export default function ReviewCard({ data, className }: ReviewCardProps) {
  const displayName = data.user.name ?? "Anonymous";
  const initial     = displayName.charAt(0).toUpperCase();
  const date        = new Date(data.createdAt).toLocaleDateString("en-NG", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });

  return (
    <div className={cn("p-6 rounded-2xl shadow flex flex-col gap-3 bg-white", className)}>
      <div className="flex items-center gap-3 mb-1">
        {data.user.image ? (
          <Image
            src={data.user.image}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover border"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-base select-none shrink-0">
            {initial}
          </div>
        )}
        <div>
          <div className="font-semibold text-base">{displayName}</div>
          <div className="text-xs text-gray-400">{date}</div>
        </div>
      </div>

      <div className="flex gap-1 items-center">
        <RenderStars rating={data.rating} />
        <span className="ml-2 text-xs text-gray-500 font-medium">{data.rating}/5</span>
      </div>

      <p className="text-sm text-gray-800 leading-relaxed">{data.comment}</p>
    </div>
  );
}

import { Star } from "lucide-react";

function RenderStars({ rating = 5 }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        size={16}
        className={
          i < Math.floor(rating)
            ? "text-yellow-400 inline-block"
            : "text-gray-300 inline-block"
        }
        fill={i < Math.floor(rating) ? "#facc15" : "none"}
        strokeWidth={2}
      />
    );
  }
  return stars;
}

export default RenderStars;

export type Review = {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number; // e.g. 4.5
  text: string;
  date?: string;
  product?: string;
  location?: string;
};

export const reviewsData: Review[] = [
  {
    id: "1",
    name: "Amara O.",
    avatarUrl: "https://avatar.iran.liara.run/public/girl",
    rating: 5,
    text: "Absolutely love this linen shirt! The texture feels premium and airy. It’s perfect for Lagos weather — I’ve gotten so many compliments already.",
    date: "September 2, 2025",
    product: "Linen Relaxed Shirt",
    location: "Lagos, Nigeria",
  },
  {
    id: "2",
    name: "David R.",
    avatarUrl: "https://avatar.iran.liara.run/public/boy",
    rating: 4.5,
    text: "The tailoring on the blazer is exceptional. Fits perfectly around the shoulders and feels made-to-measure. The inner lining is a nice touch.",
    date: "August 28, 2025",
    product: "Tailored Grey Blazer",
    location: "London, UK",
  },
  {
    id: "3",
    name: "Chisom N.",
    avatarUrl: "https://avatar.iran.liara.run/public/girl",
    rating: 4,
    text: "Loved the style and color of the dress, but the length was slightly shorter than expected. Still, the fabric quality makes up for it!",
    date: "August 15, 2025",
    product: "Pleated Midi Dress",
    location: "Abuja, Nigeria",
  },
  {
    id: "4",
    name: "Isabella T.",
    avatarUrl: "https://avatar.iran.liara.run/public/girl",
    rating: 5,
    text: "Super comfortable sandals! Walked in them all day on vacation and didn’t feel any discomfort. The design is modern and minimal.",
    date: "August 12, 2025",
    product: "Sculptural Leather Sandals",
    location: "Barcelona, Spain",
  },
  {
    id: "5",
    name: "Kelvin M.",
    avatarUrl: "https://avatar.iran.liara.run/public/boy",
    rating: 4.5,
    text: "The cargo pants are my new favorite. Great fit and feel, plus plenty of pocket space without being bulky. Totally worth the price.",
    date: "July 29, 2025",
    product: "Utility Cargo Pants",
    location: "Nairobi, Kenya",
  },
  {
    id: "6",
    name: "Sophia A.",
    avatarUrl: "https://avatar.iran.liara.run/public/girl",
    rating: 5,
    text: "I’m in love with this sweater! It’s warm, soft, and holds its shape even after washing. The neutral tone makes it easy to style.",
    date: "July 14, 2025",
    product: "Minimal Knit Sweater",
    location: "Toronto, Canada",
  },
  {
    id: "7",
    name: "Leon K.",
    avatarUrl: "https://avatar.iran.liara.run/public/boy",
    rating: 3.5,
    text: "Good quality overall, but shipping took a bit longer than expected. The product itself is well-made and fits as shown.",
    date: "June 30, 2025",
    product: "Classic White Tee",
    location: "Berlin, Germany",
  },
  {
    id: "8",
    name: "Ada E.",
    avatarUrl: "https://avatar.iran.liara.run/public/girl",
    rating: 4.8,
    text: "This tote bag is everything I needed — roomy, sturdy, and stylish. I take it everywhere now, from the office to the weekend market.",
    date: "June 22, 2025",
    product: "Everyday Canvas Tote",
    location: "Accra, Ghana",
  },
  {
    id: "9",
    name: "Marcus W.",
    avatarUrl: "https://avatar.iran.liara.run/public/girl",
    rating: 4.7,
    text: "Nice relaxed fit jeans — exactly the vintage wash I was looking for. Slight stretch in the fabric makes them super comfy.",
    date: "June 18, 2025",
    product: "Relaxed Fit Denim Jeans",
    location: "New York, USA",
  },
  {
    id: "10",
    name: "Ruth C.",
    avatarUrl: "https://avatar.iran.liara.run/public/girl",
    rating: 5,
    text: "The attention to detail on this dress is stunning. Feels like a designer piece but at a much better price. Highly recommend!",
    date: "June 10, 2025",
    product: "Floral Wrap Dress",
    location: "Cape Town, South Africa",
  },
];

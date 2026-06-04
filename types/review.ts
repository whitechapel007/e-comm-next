export interface ReviewAuthor {
  id: string;
  name: string | null;
  image: string | null;
}

export interface ReviewType {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewAuthor;
}

export interface ReviewsResponse {
  reviews: ReviewType[];
  totalCount: number;
  totalPages: number;
  page: number;
  averageRating: number;
  ratingCount: number;
}

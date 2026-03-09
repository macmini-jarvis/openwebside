export type ProductStatus = "pending" | "approved" | "rejected";
export type VerificationStatus = "pending" | "verified" | "failed";

export interface Product {
  id: string;
  title: string;
  url: string;
  description: string;
  logo_url: string | null;
  screenshots: string[];
  category: string;
  sub_category: string;
  tags: string[];
  user_id: string;
  status: ProductStatus;
  reject_reason: string | null;
  avg_rating: number;
  review_count: number;
  upvote_count: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

export interface Upvote {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface SiteVerification {
  id: string;
  product_id: string;
  token: string;
  verified_at: string | null;
  status: VerificationStatus;
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
  subcategories: { name: string; slug: string }[];
}

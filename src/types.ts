export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "Writing" | "Music" | "Beauty" | "Fashion" | "Lifestyle";
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  isPremium?: boolean;
}

export interface MusicRelease {
  id: string;
  title: string;
  type: "Album" | "Single" | "EP" | "Demo";
  releaseDate: string;
  duration: string;
  image: string;
  audioUrl: string; // fallback URL or description
  description: string;
  spotifyEmbedId?: string;
  isPremiumOnly?: boolean;
}

export interface FashionLook {
  id: string;
  title: string;
  season: "Spring" | "Summer" | "Autumn" | "Winter" | "All";
  image: string;
  description: string;
  tags: string[];
}

export interface BeautyProduct {
  id: string;
  name: string;
  brand: string;
  category: "Skincare" | "Makeup" | "Hair" | "Fragrance";
  rating: number;
  reviewText: string;
  affiliateLink: string;
  image: string;
  isFavorite: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: "monthly" | "annually";
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroBio: string;
  aboutText1: string;
  aboutText2: string;
  contactEmail: string;
  contactPhone: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

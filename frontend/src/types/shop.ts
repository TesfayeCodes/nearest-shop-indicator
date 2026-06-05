export interface Shop {
  id: number;
  name: string;
  category: string | null;
  category_name: string | null;
  icon: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  image_url: string | null;
  rating: number;
  review_count: number;
  is_open: boolean;
  closing_time: string | null;
  distance?: number;
}

export interface ShopCreatePayload {
  name: string;
  category_slug?: string;
  latitude: number;
  longitude: number;
  address?: string;
}

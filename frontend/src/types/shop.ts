export interface Shop {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string | null;
  rating: number;
  reviewCount: number;
  open: boolean;
  closingTime?: string;
  distance?: number;
  walkTime?: string;
  phone?: string;
  image?: string;
  color: string;
  icon: string;
}

export interface ShopCreate {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
}

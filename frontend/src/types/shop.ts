export interface Shop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
}

export interface ShopCreate {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

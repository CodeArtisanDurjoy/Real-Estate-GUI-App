export interface Listing {
  id?: number;
  imageUrls: string[];
  name: string;
  description: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  parking: boolean;
  furnished: boolean;
  userId: string;
}

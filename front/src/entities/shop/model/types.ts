export interface Shop {
  id?: string | null;
  name: string;
  ownerName: string;
  description: string;
  imageUrl: string;
  rating: number;
  trusted: boolean;
}
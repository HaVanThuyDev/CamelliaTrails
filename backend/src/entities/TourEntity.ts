export interface TourEntity {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  max_guests: number;
  description: string;
  image: string;
  rating: number;
  featured: number; // 0 or 1
}

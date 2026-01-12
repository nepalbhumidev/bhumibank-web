export interface Testimonial {
  id: string;
  rating: number;
  author: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
}

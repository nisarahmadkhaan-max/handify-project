export interface Category {
  _id: string;
  id?: number;
  name: string;
  image: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 
export interface Profile {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contactInfo: {
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}
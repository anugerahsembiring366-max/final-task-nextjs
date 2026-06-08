export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};

export type Address = {
  city: string;
  street: string;
  number: number;
  zipcode: string;
  geolocation?: {
    lat: string;
    long: string;
  };
};

export type Name = {
  firstname: string;
  lastname: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  password?: string;
  name: Name;
  address?: Address;
  phone?: string;
};

export type LoginResponse = {
  token: string;
};


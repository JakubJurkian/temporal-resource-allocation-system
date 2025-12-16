export interface User {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'admin';
  city: 'Warsaw' | 'Gdansk' | 'Poznan' | 'Wroclaw';
}
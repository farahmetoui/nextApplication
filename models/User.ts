// models/User.ts
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId; 
  firstName: string;
  lastName: string; 
  dateOfBirth: Date; 
  address: [number, number]; 
  phoneNumber: string; 
  email: string;
}

import clientPromise from "./mongodb";
import { User } from "../models/User";
import { ObjectId } from "mongodb";

export const addUser = async (userData: User) => {
  try {
    const client = await clientPromise;
    const db = client.db("supremoDatabase"); 

    const result = await db.collection("users").insertOne(userData);
    return result;
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Failed to add user to the database");
  }
};

export const updateUser = async (userId: string, updatedData: Partial<User>) => {
  try {
    const client = await clientPromise;
    const db = client.db("supremoDatabase");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) }, 
      { $set: updatedData } 
    );

    if (result.matchedCount === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user in the database");
  }
};
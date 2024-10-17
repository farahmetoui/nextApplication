import { MongoClient } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const client: MongoClient = await clientPromise;
      const db = client.db("supremoDatabase");

      const { email } = req.query;

      console.log("Email reçu:", email);

      const existingUser = await db.collection("users").findOne({ email });

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(existingUser);
    } catch (error) {
      
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

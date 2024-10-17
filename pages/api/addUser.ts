// pages/api/addUser.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { addUser } from "../../lib/userService";
import { User } from "../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { firstName, lastName, dateOfBirth, address, phoneNumber,email } = req.body;

    const userData: User = {
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      address,
      phoneNumber,
      email
    };
    try {
      const result = await addUser(userData);
      res.status(201).json({ success: true, userId: result.insertedId });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'ajout de l'utilisateur",
        error,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

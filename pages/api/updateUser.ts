import type { NextApiRequest, NextApiResponse } from 'next';
import { updateUser } from '../../lib/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { userId, updatedData } = req.body;

    try {
      const result = await updateUser(userId, updatedData);
      res.status(200).json({ message: 'User updated successfully', modifiedCount: result.modifiedCount });
    }catch (error) {
        res.status(500).json({
          success: false,
          message: "Erreur lors de l'update de l'utilisateur",
          error,
        });
      }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

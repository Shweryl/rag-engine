// for checking user access for authorized endpoint
import prisma from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
 const { userUrl } = req.query;

  if (!userUrl) {
    return res.status(400).json({ allowed: false, message: "Missing token" });
  }

  const user = await prisma.user.findUnique({
    where: { userUrl: userUrl as string },
  });

  if (user) {
    return res.json({
      allowed: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  }

  res.status(403).json({ allowed: false, message: "Invalid or expired token" });
}

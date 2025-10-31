import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userEmail = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.userUrl) {
    const uploadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/upload/${user.userUrl}`;
    const chatUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${user.userUrl}`;
    return res.status(200).json({ uploadUrl, chatUrl });
  }

 
  const uniqueId = uuidv4();

  const updatedUser = await prisma.user.update({
    where: { email: userEmail },
    data: { userUrl: uniqueId },
  });

  const uploadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/upload/${uniqueId}`;
  const chatUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${uniqueId}`;

  return res.status(200).json({ uploadUrl, chatUrl });
}

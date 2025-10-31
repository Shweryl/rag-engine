// return document data for user (for showing in upload page)

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userUrl } = req.query;

  if (!userUrl) {
    return res.status(400).json({ allowed: false, message: "Missing userUrl" });
  }

  const user = await prisma.user.findUnique({
    where: { userUrl: userUrl as string },
  });

  if (!user) {
    return res.status(404).json({message: "User not found" });
  }

  const totalDocs = await prisma.document.count({
    where: { userId: user.id },
  });

  const totals = await prisma.document.aggregate({
    where: { userId: user.id },
    _sum: {
      vectorsCount: true,
      tokensCount: true,
    },
  });

  return res.status(200).json({
    totalDocs,
    totalVectors: totals._sum.vectorsCount || 0,
    totalTokens: totals._sum.tokensCount || 0,
    user,
  });
}

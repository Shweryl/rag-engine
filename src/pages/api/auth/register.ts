import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method !== "POST") return res.status(403).json({message : "Method is not allowed"})

   
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
        where : {email : email}
    });

    if(existingUser){
        return res.status(400).json({"message" : "User already exists."})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data : {name, email, password : hashedPassword}
    });

    return res.status(200).json({"message" : "User created", "user" : user})
}
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { prisma } from "@prisma/client";

const getUserFromHeader = async (req: NextApiRequest, res: NextApiResponse) => {
  let access_token;
  try {
    if (req.headers.authorization) {
      access_token = req.headers?.authorization?.split(" ")[1] ?? null;
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }
    if (!access_token) return null;
    return jwt.verify(
      access_token,
      process.env.JWT_SECRET!,
      (err: any, data: any) => {
        if (err) return null;
        return data;
      }
    );
  } catch (error) {
    return null;
  }
};

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  const user: any = await getUserFromHeader(req, res);
  return {
    req,
    res,
    prisma,
    user,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;

// [..] Define API handler and app router

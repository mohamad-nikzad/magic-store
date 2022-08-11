import prisma from "@/util/prisma";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../createRouter";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";

export const userRouter = createRouter()
  .mutation("register", {
    input: z.object({
      phonenumber: z.string({ required_error: "phonenumber is required" }),
      password: z.string(),
      instagram_id: z.string({ required_error: "instagram_id is required" }),
    }),
    async resolve({ input, ctx }) {
      const { req, res } = ctx;
      try {
        const products = await prisma.previewProduct.findMany({
          where: {
            accountInstagram_id: input.instagram_id,
          },
          select: {
            title: true,
            thumbnail_url: true,
          },
        });
        const user = await prisma.user.create({
          data: {
            phonenumber: input.phonenumber,
            instagram_id: input.instagram_id,
            password: CryptoJS.AES.encrypt(
              input.password,
              process.env.PASS_SECRET!
            ).toString(),
            products: {
              createMany: {
                data: products,
              },
            },
          },
          include: { products: true },
        });
        const access_token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET!,
          {
            expiresIn: "30d",
          }
        );
        setCookie("access_token", access_token, { req, res });
        const { password, ...info } = user;
        return { info, access_token };
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Phonenumber already exists",
            });
          }
        }
        throw err;
      }
    },
  })
  .mutation("login", {
    input: z.object({
      phonenumber: z.string(),
      password: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { req, res } = ctx;
      try {
        const user = await prisma.user.findUnique({
          where: {
            phonenumber: input.phonenumber,
          },
        });
        if (!user)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "user not exist !",
          });
        const bytes = CryptoJS.AES.decrypt(
          user.password!,
          process.env.PASS_SECRET!
        );
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        if (originalPassword !== input.password)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "wrong password!",
          });
        const access_token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET!,
          {
            expiresIn: "30d",
          }
        );
        setCookie("access_token", access_token, { req, res });
        const { password, ...info } = user;
        return { ...info, access_token };
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message || "bad req",
        });
      }
    },
  })
  .query("get", {
    async resolve({ ctx }) {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.user.id,
        },
        include: {
          products: {
            orderBy: {
              updatedAt: "desc",
            },
          },
        },
      });
      return user;
    },
  });

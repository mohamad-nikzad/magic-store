import prisma from "@/util/prisma";
import { Prisma } from "@prisma/client";
import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const userRouter = trpc
  .router()
  .mutation("register", {
    input: z.object({
      phonenumber: z.number({ required_error: "phonenumber is required" }),
      instagram_id: z.string({ required_error: "instagram_id is required" }),
    }),
    async resolve({ input }) {
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
            products: {
              createMany: {
                data: products,
              },
            },
          },
          include: { products: true },
        });
        return user;
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
  .query("get", {
    input: z.number(),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: {
          id: input,
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

import prisma from "@/util/prisma";
import * as trpc from "@trpc/server";
import { z } from "zod";

export const accountRouter = trpc
  .router()
  .mutation("check", {
    input: z.string(),
    async resolve({ input }) {
      const oldAccount = await prisma.account.findUnique({
        where: {
          instagram_id: input,
        },
      });
      if (!oldAccount) {
        const res = await fetch("https://fakestoreapi.com/products?limit=10");
        const fetchedProducts = await res.json();
        const newAccount = await prisma.account.create({
          data: {
            instagram_id: input,
            previewProducts: {
              createMany: {
                data: fetchedProducts?.map((item: any) => ({
                  title: item.title,
                  thumbnail_url: item.image,
                })),
              },
            },
          },
        });
        console.log(newAccount, "new account");
        return input;
      }
      return input;
    },
  })
  .query("get", {
    input: z.string(),
    async resolve({ input }) {
      const account = await prisma.account.findUnique({
        where: {
          instagram_id: input,
        },
        include: {
          previewProducts: true,
        },
      });
      return account;
    },
  });

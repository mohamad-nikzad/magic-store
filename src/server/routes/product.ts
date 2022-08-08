import prisma from "@/util/prisma";
import * as trpc from "@trpc/server";
import { z } from "zod";

export const productSchema = z.object({
  // id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  price: z.number().nullish(),
});

export const productRouter = trpc.router().mutation("update", {
  input: z.object({
    product_id: z.number({ required_error: "product_id is required" }),
    data: productSchema,
  }),
  async resolve({ input }) {
    try {
      const updatedProduct = await prisma.product.update({
        where: {
          id: input.product_id,
        },
        data: input.data,
      });
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  },
});
//   .query("get", {
//     input: z.string(),
//     async resolve({ input }) {
//       const account = await prisma.account.findUnique({
//         where: {
//           instagram_id: input,
//         },
//         include: {
//           products: true,
//         },
//       });
//       return account;
//     },
//   });

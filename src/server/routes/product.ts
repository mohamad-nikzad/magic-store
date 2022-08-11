import prisma from "@/util/prisma";
import { z } from "zod";
import { createRouter } from "../createRouter";

export const productSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  price: z.number().nullish(),
});

export const productRouter = createRouter().mutation("update", {
  input: z.object({
    product_id: z.number({ required_error: "product_id is required" }),
    data: productSchema,
  }),
  async resolve({ input, ctx }) {
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

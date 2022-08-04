import prisma from "@/util/prisma";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

export const appRouter = trpc
  .router()
  .query("get-user", {
    input: z.string(),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: {
          instagram_id: input,
        },
      });
      return {
        user,
      };
    },
  })
  .mutation("register", {
    input: z.string(),
    async resolve({ input }) {
      const user = await prisma.user.create({
        data: {
          instagram_id: input,
        },
      });
      return user;
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

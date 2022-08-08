import * as trpc from "@trpc/server";
import { accountRouter } from "./account";
import { productRouter } from "./product";
import { userRouter } from "./user";

export const appRouter = trpc
  .router()
  .query("healthz", {
    async resolve() {
      return "yay!";
    },
  })
  .merge("account-", accountRouter)
  .merge("user-", userRouter)
  .merge("product-", productRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

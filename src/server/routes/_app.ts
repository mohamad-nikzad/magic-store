import * as trpc from "@trpc/server";
import { accountRouter } from "./account";

export const appRouter = trpc
  .router()
  .query("healthz", {
    async resolve() {
      return "yay!";
    },
  })
  .merge("account-", accountRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

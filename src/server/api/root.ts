import { aiRouter } from "~/server/api/routers/ai";
import { brandKitRouter } from "~/server/api/routers/brand-kit";
import { deckRouter } from "~/server/api/routers/deck";
import { postRouter } from "~/server/api/routers/post";
import { slideRouter } from "~/server/api/routers/slide";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  deck: deckRouter,
  brandKit: brandKitRouter,
  slide: slideRouter,
  ai: aiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

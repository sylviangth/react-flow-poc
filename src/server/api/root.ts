import { usageControlRouter } from "./routers/usage-control";
import { workflowRouter } from "./routers/workflow";
import { workflowRunRouter } from "./routers/workflow-run";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workflow: workflowRouter,
  workflowRun: workflowRunRouter,
  usageControl: usageControlRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

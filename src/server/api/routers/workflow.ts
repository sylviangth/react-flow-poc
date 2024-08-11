import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ObjectId } from "mongodb";

export const workflowRouter = createTRPCRouter({

  getByIdOrSlug: publicProcedure
    .input(z.object({
      idOrSlug: z.string()
    }))
    .query(({ ctx, input }) => {
      const isValidObjectId = ObjectId.isValid(input.idOrSlug);
      return ctx.prisma.workflow.findFirst({
        where: isValidObjectId ? {
          id: input.idOrSlug
        } : {
          slug: input.idOrSlug,
        },
        select: {
          id: true,
          title: true,
          desc: true,
          isForSale: true,
          isMpBrandingOff: true,
          openAiApiKey: false,
          openRouterApiKey: false,
          serpApiKey: false,
          WorkflowTriggerInput: {
            orderBy: {
              index: "asc",
            }
          },
        },
      })
    }),

})
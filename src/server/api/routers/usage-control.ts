import { MessageRole } from "@prisma/client";
import { z } from "zod";
import { CHATBOT_MESSAGE_TOPUP, CHATBOT_PLAN_LIST, CorePlan, CORE_PLAN_LIST } from "lib/new-pricing-data";
import { validateLicenseKey } from "~/server/third-party/lemonsqueezy";
import { client } from "~/utils/lemon";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { MODEL_LIST } from "lib/model";
import { ObjectId } from "mongodb";

function hasDatePassed(dateString: Date): boolean {
  const givenDate: Date = new Date(dateString);
  const currentDate: Date = new Date();
  return givenDate.getTime() > currentDate.getTime();
}

export interface BaseDataProps {
  licenseKey: string | null;
  coreLicenseKey: string | null;
  coreSubscriptionId: string | null;
  chatbotSubscriptionId: string | null;
  chatbotMessageTopupSubscriptionId: string | null;
}

export const usageControlRouter = createTRPCRouter({

  getAiCreditCountByWorkflowIdOrSlug: publicProcedure
    .input(z.object({
      workflowIdOrSlug: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // GET WORKFLOW OWNER
      const isValidObjectId = ObjectId.isValid(input.workflowIdOrSlug);
      const workflowData = await ctx.prisma.workflow.findFirst({
        where: isValidObjectId ? {
          id: input.workflowIdOrSlug
        } : {
          slug: input.workflowIdOrSlug,
        },
      })
      if (!workflowData) {
        throw new Error("Couldn't find workflow.");
      }
      // HANDLE COUNT
      const currentDate = new Date();
      currentDate.setDate(1);
      currentDate.setHours(0, 0, 0, 0);
      currentDate.setMinutes(0);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
      // Chat queries from threads
      let countFromThread = 0;
      let threadList = [];
      if (workflowData.teamId) {
        threadList = await ctx.prisma.thread.findMany({
          where: {
            teamId: workflowData.teamId,
          },
          select: {
            Message: {
              where: {
                role: {
                  in: [MessageRole.ASSISTANT, MessageRole.FUNCTION]
                },
                createdAt: {
                  gt: currentDate
                }
              }
            }
          }
        })
      } else {
        const allByUser = await ctx.prisma.thread.findMany({
          where: {
            userId: workflowData.userId,
          },
          select: {
            teamId: true,
            Message: {
              where: {
                role: {
                  in: [MessageRole.ASSISTANT, MessageRole.FUNCTION]
                },
                createdAt: {
                  gt: currentDate
                }
              }
            }
          }
        });
        threadList = allByUser.filter(a => !a.teamId);
      }
      threadList.forEach((thread) => {
        thread.Message.forEach((message) => {
          countFromThread += (MODEL_LIST.find(m => m.enum === message.llmModel)?.weight || 1);
        });
        // Copilot mode attempts
        thread.Message.forEach((message) => {
          if (message.clarificationSet) {
            countFromThread += 1;
          }
        })
      })
      // AI messages from chatbot conversations
      let countFromChatbot = 0;
      let chatbotList = [];
      if (workflowData.teamId) {
        chatbotList = await ctx.prisma.chatbot.findMany({
          where: {
            teamId: workflowData.teamId,
          },
          select: {
            ChatbotConversation: {
              select: {
                createdAt: true,
                history: true,
                llmModel: true,
              }
            }
          }
        })
      } else {
        const allByUser = await ctx.prisma.chatbot.findMany({
          where: {
            authorId: workflowData.userId,
          },
          select: {
            teamId: true,
            ChatbotConversation: {
              select: {
                createdAt: true,
                history: true,
                llmModel: true,
              }
            }
          }
        });
        chatbotList = allByUser.filter(a => !a.teamId);
      }
      chatbotList.forEach((chatbot) => {
        const chatbotConvoHistoryList = chatbot.ChatbotConversation
          .filter((convo) => convo.createdAt >= currentDate)
        chatbotConvoHistoryList.forEach((cv) => {
          try {
            // eslint-disable-next-line
            const parsedHistory = JSON.parse(cv.history);
            if (!Array.isArray(parsedHistory)) {
              console.error('Parsed history is not an array:', parsedHistory);
              return;
            }
            const validMessages = parsedHistory.filter(msg => {
              // eslint-disable-next-line
              return msg && typeof msg === 'object' && 'role' in msg && 'content' in msg && typeof msg.role === 'string' && typeof msg.content === 'string';
            });
            // eslint-disable-next-line
            const userMessages = validMessages.filter(m => m.role === "user");
            countFromChatbot += (userMessages.length * (MODEL_LIST.find(m => m.enum === cv.llmModel)?.weight || 1));
          } catch (err) {
            console.error('Error processing chatbot conversation:', err);
          }
        });
      });
      // AI queries from smart notes
      let countFromNote = 0;
      let creationList = [];
      if (workflowData.teamId) {
        creationList = await ctx.prisma.creation.findMany({
          where: {
            teamId: workflowData.teamId,
            createdAt: {
              gte: currentDate
            }
          },
          select: {
            aiQueryCount: true,
          },
        })
      } else {
        const allByUser = await ctx.prisma.creation.findMany({
          where: {
            userId: workflowData.userId,
            createdAt: {
              gte: currentDate
            }
          },
          select: {
            teamId: true,
            aiQueryCount: true,
          },
        });
        creationList = allByUser.filter(a => !a.teamId);
      }
      creationList.forEach((creation) => {
        countFromNote += creation.aiQueryCount;
      })
      // AI queries from assembly runs
      let countFromAssembly = 0;
      let assemblyRunList = [];
      if (workflowData.teamId) {
        assemblyRunList = await ctx.prisma.workflowRun.findMany({
          where: {
            teamId: workflowData.teamId,
            createdAt: {
              gte: currentDate
            }
          },
          select: {
            WorkflowRunResultItem: true,
          },
        })
      } else {
        const allByUser = await ctx.prisma.workflowRun.findMany({
          where: {
            userId: workflowData.userId,
            createdAt: {
              gte: currentDate
            }
          },
          select: {
            teamId: true,
            WorkflowRunResultItem: true,
          },
        });
        assemblyRunList = allByUser.filter(a => !a.teamId);
      }
      assemblyRunList.forEach((run) => {
        run.WorkflowRunResultItem.filter(item => item.content && item.content !== '').forEach(item => {
          countFromAssembly += (MODEL_LIST.find(m => m.enum === item.llmModel)?.weight || 1);
        })
      })
      return countFromThread + countFromChatbot + countFromNote + countFromAssembly;
    }),

  getAiCreditLimitByWorkflowIdOrSlug: publicProcedure
    .input(z.object({
      workflowIdOrSlug: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // GET CHATBOT OWNER
      const isValidObjectId = ObjectId.isValid(input.workflowIdOrSlug);
      const workflowData = await ctx.prisma.workflow.findFirst({
        where: isValidObjectId ? {
          id: input.workflowIdOrSlug
        } : {
          slug: input.workflowIdOrSlug,
        },
        include: {
          Team: {
            select: {
              slug: true,
            }
          },
          WorkflowNode: {
            select: {
              Agent: {
                select: {
                  model: true,
                }
              }
            }
          }
        }
      })
      if (!workflowData) {
        throw new Error("Couldn't find chatbot.");
      }
      // IF THE OWNER/TEAM HAS ALL REQUIRED API KEYS => UNLIMITED AI CREDITS
      const requiredLlmApiKeys = MODEL_LIST.filter(m => workflowData.WorkflowNode.map(n => n.Agent.model).includes(m.enum)).map(item => item.requiredCredentialForLtdUsers);
      const availableLlmApiKeys = await ctx.prisma.credential.findMany({
        where: {
          teamId: workflowData.teamId,
          userId: workflowData.teamId ? undefined : workflowData.userId,
        },
        select: {
          type: true,
        }
      })
      if (requiredLlmApiKeys.every(item => availableLlmApiKeys.find(k => k.type === item))) {
        return null;
      }
      // HANDLE CALCULATE
      let is_active = false;
      let baseData: BaseDataProps = {
        licenseKey: null,
        coreLicenseKey: null,
        coreSubscriptionId: null,
        chatbotSubscriptionId: null,
        chatbotMessageTopupSubscriptionId: null,
      }
      let teamMemberCount = 0;
      if (workflowData.teamId) {
        const result = await ctx.prisma.team.findUnique({
          where: {
            id: workflowData.teamId,
          },
          include: {
            TeamMember: true,
            _count: {
              select: {
                TeamMember: true,
              }
            }
          }
        })
        if (result) {
          baseData = {
            ...baseData,
            coreSubscriptionId: result.coreSubscriptionId,
            chatbotSubscriptionId: result.chatbotSubscriptionId,
            chatbotMessageTopupSubscriptionId: result.chatbotMessageTopupSubscriptionId,
          }
          teamMemberCount = result._count.TeamMember;
        }
      } else {
        const result = await ctx.prisma.paidUser.findUnique({
          where: {
            userId: workflowData.userId,
          }
        })
        if (result) {
          baseData = {
            ...baseData,
            licenseKey: result.licenseKey,
            coreLicenseKey: result.coreLicenseKey,
            coreSubscriptionId: result.coreSubscriptionId,
            chatbotSubscriptionId: result.chatbotSubscriptionId,
            chatbotMessageTopupSubscriptionId: result.chatbotMessageTopupSubscriptionId,
          }
        }
      }

      // EXCEPTION CASE FOR fares@oleaster.co
      if (baseData.licenseKey === "B17D1CA4-891B-466A-8267-A2AC616A1E08") {
        return 1000;
      }
      // Special case for Tony Tin VinUni
      if (workflowData.userId === "user_2b8b061K0yVAyD4DxIc7XZ5uLM8") {
        return 1000;
      }
      // Exception for SUPREME GROUP
      if (workflowData.Team && ["sg-product", "sg-marketing", "sg-operations"].includes(workflowData.Team.slug)) {
        return 15000;
      }
      // CORE_PLAN
      let finalMaxAiCreditCount: number | null = 0;
      let finalCorePlan = CorePlan.FREE;
      let finalIsCoreSubscriptionYearly = false;
      let teamSeatCount = 0;
      let coreCustomerPortal: string | null = null;
      if (baseData.licenseKey) {
        if (baseData.licenseKey === "mindpal-brain") {
          finalCorePlan = CorePlan.LEGACY_LIFETIME_PRO;
          is_active = true;
        } else {
          const licenseData = await validateLicenseKey(baseData.licenseKey);
          if (licenseData && licenseData.license_key.status === "active") {
            const currentPlan = CORE_PLAN_LIST.find(p =>
              (p.checkout_data.billed_one_time?.variant_id === licenseData.meta.variant_id)
              || (p.checkout_data.billed_monthly?.variant_id === licenseData.meta.variant_id)
              || (p.checkout_data.billed_yearly?.variant_id === licenseData.meta.variant_id)
            );
            if (currentPlan) {
              finalCorePlan = currentPlan.enum;
              is_active = true;
            }
          }
        }
      } else if (baseData.coreLicenseKey) {
        const licenseData = await validateLicenseKey(baseData.coreLicenseKey);
        if (licenseData && licenseData.license_key.status === "active") {
          const currentPlan = CORE_PLAN_LIST.find(p =>
            (p.checkout_data.billed_one_time?.variant_id === licenseData.meta.variant_id)
            || (p.checkout_data.billed_monthly?.variant_id === licenseData.meta.variant_id)
            || (p.checkout_data.billed_yearly?.variant_id === licenseData.meta.variant_id)
          );
          if (currentPlan) {
            finalCorePlan = currentPlan.enum;
            is_active = true;
          }
        }
      } else if (baseData.coreSubscriptionId) {
        const core_subscription = await client.retrieveSubscription({ id: baseData.coreSubscriptionId });
        if (core_subscription && (core_subscription.data.attributes.status === "active" || (core_subscription.data.attributes.ends_at && hasDatePassed(core_subscription.data.attributes.ends_at)))) {
          const currentMonthlyPlan = CORE_PLAN_LIST.find(p => core_subscription.data.attributes.variant_id === p.checkout_data.billed_monthly?.variant_id);
          const currentYearlyPlan = CORE_PLAN_LIST.find(p => core_subscription.data.attributes.variant_id === p.checkout_data.billed_yearly?.variant_id);
          if (currentMonthlyPlan) {
            finalCorePlan = currentMonthlyPlan.enum;
            is_active = true;
          } else if (currentYearlyPlan) {
            finalCorePlan = currentYearlyPlan.enum;
            is_active = true;
            finalIsCoreSubscriptionYearly = true;
          }
          const seat_quantity = (core_subscription.data.attributes as unknown as { first_subscription_item: { quantity: number } }).first_subscription_item.quantity;
          if (seat_quantity) {
            teamSeatCount = seat_quantity;
          }
        }
        coreCustomerPortal = (core_subscription.data.attributes.urls as unknown as { customer_portal: string }).customer_portal;
      } else if (workflowData.teamId) {
        const currentTeamData = await ctx.prisma.team.findUnique({
          where: {
            id: workflowData.teamId,
          },
          select: {
            isLtd: true,
          }
        })
        if (currentTeamData && currentTeamData?.isLtd) {
          finalCorePlan = CorePlan.SPECIAL_TEAM_FREE_FOR_LTD_USER;
        } else {
          finalCorePlan = CorePlan.TEAM_FREE;
        }
        is_active = true;
        teamSeatCount = CORE_PLAN_LIST.find(p => p.enum === finalCorePlan)?.limits.no_seats_included || 0;
      } else {
        is_active = true;
      }

      finalMaxAiCreditCount = !is_active ? 0 : CORE_PLAN_LIST.find(p => p.enum === finalCorePlan)!.limits.max_ai_queries;

      // CHATBOT PLAN ---> COUNT TOWARDS AI CREDIT TOPUP
      if (baseData.chatbotSubscriptionId) {
        const chatbot_subscription = await client.retrieveSubscription({ id: baseData.chatbotSubscriptionId });
        if (chatbot_subscription && chatbot_subscription.data.attributes.status === "active") {
          const currentPlan = CHATBOT_PLAN_LIST.find(p => chatbot_subscription.data.attributes.variant_id === p.checkout_data.billed_monthly?.variant_id || chatbot_subscription.data.attributes.variant_id === p.checkout_data.billed_yearly?.variant_id);
          if (currentPlan && finalMaxAiCreditCount !== null) {
            finalMaxAiCreditCount += currentPlan.limits.max_chatbot_messages;
          }
        }
      }

      // CHATBOT MESSAGES TOPUP ---> COUNT TOWARDS AI CREDIT TOPUP
      if (baseData.chatbotMessageTopupSubscriptionId) {
        const chatbot_msg_subscription = await client.retrieveSubscription({ id: baseData.chatbotMessageTopupSubscriptionId });
        if (chatbot_msg_subscription && chatbot_msg_subscription.data.attributes.status === "active") {
          const topup_quantity = (chatbot_msg_subscription.data.attributes as unknown as { first_subscription_item: { quantity: number } }).first_subscription_item.quantity;
          if (topup_quantity && finalMaxAiCreditCount !== null) {
            finalMaxAiCreditCount += topup_quantity * CHATBOT_MESSAGE_TOPUP.billed_monthly.count_per_unit;
          }
        }
      }

      return finalMaxAiCreditCount;
    }),

});
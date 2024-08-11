import { CredentialType, WorkflowRunStatus, WorkflowRunWebhookStatus, WorkflowTriggerInputType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import { exportDOCX, exportPDF } from "~/server/main/export";
import { TriggerInputContextResponse } from "~/server/main/get-trigger-input-context";
import { sendPostRunEmailForAgentCrew } from "~/server/main/send-email";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ObjectId } from "mongodb";
import sendCustomApiRequest, { ApiActionKeyValueField, ApiActionMethod } from "~/server/main/custom-api";
import { getNewWorkflowRunNotifEmailConfig } from "lib/notif-email";
import { clerkClient } from '@clerk/clerk-sdk-node';
import { sendEmail } from "~/server/main/email";

export const workflowRunRouter = createTRPCRouter({

  getById: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.workflowRun.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Workflow: true,
          WorkflowRunTriggerInput: {
            include: {
              WorkflowTriggerInput: true,
            },
            orderBy: {
              WorkflowTriggerInput: {
                index: "asc",
              }
            },
          },
          WorkflowRunResultItem: {
            include: {
              WorkflowNode: {
                include: {
                  Agent: {
                    include: {
                      StyleOnAgent: {
                        select: {
                          Style: true,
                        }
                      }
                    }
                  },
                }
              },
            },
            orderBy: {
              WorkflowNode: {
                index: "asc",
              }
            }
          },
        }
      })
    }),

  create: publicProcedure
    .input(z.object({
      workflowIdOrSlug: z.string(),
      triggerInputList: z.object({
        workflowTriggerInputId: z.string(),
        value: z.string(),
      }).array(),
      credentialList: z.object({
        type: z.nativeEnum(CredentialType),
        value: z.string(),
      }).array(),
      isSuperviseModeEnabled: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const isValidObjectId = ObjectId.isValid(input.workflowIdOrSlug);
      const workflow = await ctx.prisma.workflow.findFirst({
        where: isValidObjectId ? {
          id: input.workflowIdOrSlug
        } : {
          slug: input.workflowIdOrSlug,
        },
        select: {
          id: true,
          teamId: true,
          userId: true,
          title: true,
          WorkflowTriggerInput: true,
          WorkflowNode: {
            include: {
              Agent: true,
            }
          },
          WorkflowPostRunWebhook: true,
          Team: {
            select: {
              slug: true,
            }
          }
        }
      })
      if (!workflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "Workflow does not exist",
        })
      }
      const newWorkflowRun = await ctx.prisma.workflowRun.create({
        data: {
          teamId: workflow.teamId,
          userId: workflow.userId,
          workflowId: workflow.id,
          title: `New run by ${workflow.title}`,
          isForSale: true,
          isSuperviseModeEnabled: input.isSuperviseModeEnabled,
        }
      })
      // SEND NOTIF EMAIL OF NEW WORKFLOW RUN TO AUTHOR
      try {
        const userData = await clerkClient.users.getUser(workflow.userId);
        const notifEmailConfig = getNewWorkflowRunNotifEmailConfig({
          userFullName: userData.fullName || '',
          workflowTitle: workflow.title,
          workspaceSlug: workflow.Team ? workflow.Team.slug : 'personal',
          workflowId: workflow.id,
          workflowRunId: newWorkflowRun.id,
        })
        userData.primaryEmailAddress && await sendEmail({
          recipientEmail: userData.primaryEmailAddress?.emailAddress || '',
          subject: notifEmailConfig.subject,
          htmlBody: notifEmailConfig.htmlBody,
        })
      } catch (e) {
        console.error(e);
      }
      // CREATE TRIGGER INPUTS
      await Promise.all(input.triggerInputList.map(async (item) => {
        await ctx.prisma.workflowRunTriggerInput.create({
          data: {
            workflowRunId: newWorkflowRun.id,
            workflowTriggerInputId: item.workflowTriggerInputId,
            value: item.value,
          }
        });
      }));
      // CREATE RESULT ITEMS
      await Promise.all(workflow.WorkflowNode.map(async (node) => {
        await ctx.prisma.workflowRunResultItem.create({
          data: {
            workflowRunId: newWorkflowRun.id,
            workflowNodeId: node.id,
            llmModel: node.Agent.model,
          }
        });
      }));
      // CREATE WEBHOOK ITEMS
      await Promise.all(workflow.WorkflowPostRunWebhook.map(async (webhook) => {
        await ctx.prisma.workflowRunWebhookResult.create({
          data: {
            workflowRunId: newWorkflowRun.id,
            workflowPostRunWebhookId: webhook.id,
          }
        });
      }));
      // CREATE CREDENTIALS
      await Promise.all(input.credentialList.map(async (item) => {
        await ctx.prisma.workflowRunCredential.create({
          data: {
            workflowRunId: newWorkflowRun.id,
            type: item.type,
            value: item.value,
          }
        });
      }))
      return newWorkflowRun;
    }),

  updateResultItemContent: publicProcedure
    .input(z.object({
      workflowRunResultItemId: z.string(),
      workflowId: z.string(),
      workflowRunId: z.string(),
      content: z.string(),
      referenceList: z.object({
        title: z.string(),
        href: z.string(),
      }).array(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updatedWorkflowRunResultItem = await ctx.prisma.workflowRunResultItem.update({
        where: {
          id: input.workflowRunResultItemId,
        },
        data: {
          content: input.content,
          referenceList: input.referenceList,
        },
      })
      // If there's an email field in input + all the items are completed + the workflow is from AgentCrew
      const workflowRunData = await ctx.prisma.workflowRun.findUnique({
        where: {
          id: input.workflowRunId,
        },
        include: {
          Workflow: {
            select: {
              teamId: true,
              title: true,
            }
          },
          WorkflowRunTriggerInput: {
            orderBy: {
              WorkflowTriggerInput: {
                index: "asc",
              }
            },
            select: {
              WorkflowTriggerInput: {
                select: {
                  name: true,
                  type: true,
                }
              },
              value: true,
            }
          },
          WorkflowRunResultItem: {
            orderBy: {
              WorkflowNode: {
                index: "asc",
              }
            },
            select: {
              WorkflowNode: {
                select: {
                  title: true,
                },
              },
              content: true,
            },
          }
        }
      })
      if (
        workflowRunData
        && workflowRunData.Workflow.teamId && workflowRunData.Workflow.teamId === "65f95ce4093e6cb11b584c65"
        && workflowRunData.WorkflowRunResultItem.every(item => !!item.content)
        && workflowRunData.WorkflowRunTriggerInput.find(item => item.WorkflowTriggerInput.name.toLowerCase().includes("email"))
      ) {
        await sendPostRunEmailForAgentCrew({
          recipientEmail: workflowRunData.WorkflowRunTriggerInput.find(item => item.WorkflowTriggerInput.name.toLowerCase().includes("email"))?.value || "",
          workflowTitle: workflowRunData.Workflow.title,
          workflowInput:
            `${workflowRunData.WorkflowRunTriggerInput
              .map(item => {
                switch (item.WorkflowTriggerInput.type) {
                  case WorkflowTriggerInputType.FILE: {
                    const fileName = (JSON.parse(item.value) as TriggerInputContextResponse).metadata[0]?.document_title || "N/A";
                    return `📌 ${item.WorkflowTriggerInput.name}\n\n${fileName}`
                  }
                  case WorkflowTriggerInputType.URL: {
                    const url = (JSON.parse(item.value) as TriggerInputContextResponse).metadata[0]?.url || "N/A";
                    return `📌 ${item.WorkflowTriggerInput.name}\n\n${url}`
                  }
                  default: {
                    return `📌 ${item.WorkflowTriggerInput.name}\n\n${item.value || ''}`
                  }
                }
              })
              .join("\n\n")}`,
          workflowResult: `${workflowRunData.WorkflowRunResultItem.map(item => `👉 ${item.WorkflowNode.title}\n\n${item.content || ''}`).join("\n\n")}`,
        })
      }
      // If all result items are finished => Mark run as SUCCESSFUL
      const allWorkflowRunResultItemList = await ctx.prisma.workflowRunResultItem.findMany({
        where: {
          workflowRunId: input.workflowRunId,
        },
        select: {
          content: true,
        }
      })
      if (allWorkflowRunResultItemList.every(item => !!item.content)) {
        await ctx.prisma.workflowRun.update({
          where: {
            id: input.workflowRunId,
          },
          data: {
            status: WorkflowRunStatus.SUCCESSFUL,
          }
        })
        // Check if there is workflow post-run webhook configured, if yes, send webhook
        const workflowRunPostRunWebhookResultList = await ctx.prisma.workflowRunWebhookResult.findMany({
          where: {
            workflowRunId: input.workflowRunId,
          },
          include: {
            WorkflowPostRunWebhook: true,
          }
        })
        if (workflowRunPostRunWebhookResultList.length > 0) {
          const workflowRunData = await ctx.prisma.workflowRun.findUnique({
            where: {
              id: input.workflowRunId,
            },
            include: {
              Workflow: {
                select: {
                  id: true,
                  title: true,
                }
              },
              WorkflowRunTriggerInput: {
                select: {
                  WorkflowTriggerInput: {
                    select: {
                      name: true,
                      type: true,
                    }
                  },
                  value: true,
                },
                orderBy: {
                  WorkflowTriggerInput: {
                    index: "asc",
                  }
                },
              },
              WorkflowRunResultItem: {
                select: {
                  WorkflowNode: {
                    select: {
                      title: true,
                    }
                  },
                  content: true,
                },
                orderBy: {
                  WorkflowNode: {
                    index: "asc",
                  }
                }
              },
            }
          })
          if (!workflowRunData) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Workflow run not found."
            })
          }
          await Promise.all(workflowRunPostRunWebhookResultList.map(async (webhookResult) => {
            const dataToSend: ApiActionKeyValueField[] = [
              {
                key: "workflow_run_id",
                value: input.workflowRunId,
              },
              {
                key: "workflow_id",
                value: workflowRunData.Workflow.id,
              },
              {
                key: "workflow_title",
                value: workflowRunData.Workflow.title,
              },
              {
                key: "workflow_run_input",
                value:
                  workflowRunData.WorkflowRunTriggerInput.map(input => ({
                    title: input.WorkflowTriggerInput.name,
                    content:
                      input.WorkflowTriggerInput.type === WorkflowTriggerInputType.FILE
                        ? (JSON.parse(input.value) as TriggerInputContextResponse).metadata[0]?.document_title || ""
                        : input.WorkflowTriggerInput.type === WorkflowTriggerInputType.URL
                          ? (JSON.parse(input.value) as TriggerInputContextResponse).metadata[0]?.url || ""
                          : input.value,
                  }))
              },
              {
                key: "workflow_run_output",
                value:
                  workflowRunData.WorkflowRunResultItem.map(item => ({
                    title: item.WorkflowNode.title,
                    content: item.content,
                  }))
              }
            ];
            try {
              await sendCustomApiRequest({
                url: webhookResult.WorkflowPostRunWebhook.url,
                method: ApiActionMethod.POST,
                parsedHeaders: [],
                parsedQueryParams: [],
                parsedBody: dataToSend,
                payload: {
                  workflowRunId: input.workflowRunId,
                },
              })
              await ctx.prisma.workflowRunWebhookResult.update({
                where: {
                  id: webhookResult.id,
                },
                data: {
                  status: WorkflowRunWebhookStatus.SUCCESSFUL,
                }
              })
            } catch (error) {
              console.error(error);
              await ctx.prisma.workflowRunWebhookResult.update({
                where: {
                  id: webhookResult.id,
                },
                data: {
                  status: WorkflowRunWebhookStatus.FAILED,
                }
              })
            }
          }))
        }
      }
      return updatedWorkflowRunResultItem;
    }),

  exportPdf: publicProcedure
    .input(z.object({
      workflowRunId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const pdfLink = await exportPDF({
        apiEndpoint: env.NEXT_PUBLIC_API_ENDPOINT,
        workflowRunId: input.workflowRunId,
      });
      return pdfLink;
    }),

  exportDocx: publicProcedure
    .input(z.object({
      workflowRunId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const docxLink = await exportDOCX({
        apiEndpoint: env.NEXT_PUBLIC_API_ENDPOINT,
        workflowRunId: input.workflowRunId,
      });
      return docxLink;
    }),

});
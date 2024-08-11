"use server";

import { ObjectId } from "mongodb";
import { prisma } from "~/server/db";

export const getWorkflowMetadataBySlug = (input: { workflowIdOrSlug: string }) => {
  const isValidObjectId = ObjectId.isValid(input.workflowIdOrSlug);
  return prisma.workflow.findFirst({
    where: isValidObjectId ? {
      id: input.workflowIdOrSlug
    } : {
      slug: input.workflowIdOrSlug,
    },
    select: {
      title: true,
    }
  })
}

export const getWorkflowMetadataByCustomDomain = (input: { workflowCustomDomain: string }) => {
  return prisma.workflow.findFirst({
    where: {
      customDomain: input.workflowCustomDomain,
    },
    select: {
      title: true,
    }
  })
}

export const getWorkflowBySlug = (input: { workflowIdOrSlug: string }) => {
  const isValidObjectId = ObjectId.isValid(input.workflowIdOrSlug);
  return prisma.workflow.findFirst({
    where: isValidObjectId ? {
      id: input.workflowIdOrSlug
    } : {
      slug: input.workflowIdOrSlug,
    },
    include: {
      WorkflowTriggerInput: true,
      WorkflowNode: {
        select: {
          Agent: {
            select: {
              model: true,
            }
          }
        }
      },
    }
  })
}

export const getWorkflowByCustomDomain = (input: { workflowCustomDomain: string }) => {
  return prisma.workflow.findFirst({
    where: {
      customDomain: input.workflowCustomDomain,
    },
    include: {
      WorkflowTriggerInput: true,
      WorkflowNode: {
        select: {
          Agent: {
            select: {
              model: true,
            }
          }
        }
      },
    }
  })
}

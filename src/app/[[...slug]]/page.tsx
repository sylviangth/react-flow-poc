/* eslint-disable */

import 'regenerator-runtime/runtime';
import { type Metadata } from 'next'
import { headers } from 'next/headers';
import ErrorScreen from '~/components/utility/ErrorScreen';
import { extractDomain, getDomainFromSubdomain } from '~/utils/helpers';
import { MINDPAL_LANDING_PAGE_URL, MINDPAL_VIEWER_DOMAIN_LIST } from 'lib/common-data';
import { getWorkflowByCustomDomain, getWorkflowBySlug, getWorkflowMetadataByCustomDomain, getWorkflowMetadataBySlug } from '../actions';
import { WorkflowContextProvider } from '../_providers/WorkflowContextProvider';
import WorkflowFormScreen from './WorkflowFormScreen';
import { getWorkflowRunData } from '../_ai/workflow/actions';
import { AI } from '../_ai/workflow/provider';
import { generateId } from 'ai';
import { updatePromptWithActualValuesOfVariables } from '~/utils/workflow-helpers';
import WorkflowRunScreen from './WorkflowRunScreen';
import ThemeWrapper from '~/components/utility/ThemeWrapper';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {

  const headersList = headers();
  const host = headersList.get('host') || window.location.host;
  const forwardedHost = headersList.get('x-forwarded-host') || "";
  const pathname = headersList.get('x-current-path')?.split('?')[0] || "";

  if (!host) {
    return {
      title: "A Smart Chatbot by MindPal"
    }
  }

  const isMatchingViewerUrl: boolean = MINDPAL_VIEWER_DOMAIN_LIST.some(
    (url: string) =>
      // @ts-ignore
      host.split(':')[0]?.includes(url.split('//')[1]?.split(':')[0]) ||
      // @ts-ignore
      (forwardedHost && forwardedHost?.split(':')[0]?.includes(url.split('//')[1]?.split(':')[0]))
  );
  const customDomain = `${forwardedHost ?? host}${pathname === '/' ? '' : pathname}`

  const workflowData = isMatchingViewerUrl && params.slug && params.slug[0]
    ? await getWorkflowMetadataBySlug({ workflowIdOrSlug: params.slug[0].toString() })
    : await getWorkflowMetadataByCustomDomain({ workflowCustomDomain: customDomain.replace(/(^\w+:|^)\/\//, '') })

  if (!workflowData) {
    return {
      title: "An AI workflow on MindPal",
    }
  }

  const ogImgUrl = `https://workflow.mindpal.space/api/og?workflowTitle=${encodeURIComponent(workflowData?.title || "An AI workflow")}`;

  return {
    title: (workflowData?.title || "Workflow") + " | MindPal",
    openGraph: {
      images: {
        url: ogImgUrl,
      }
    },
  }
}

export default async function WorkflowPage({ params, searchParams }: Props) {

  const headersList = headers();
  const host = headersList.get('host');
  const forwardedHost = headersList.get('x-forwarded-host') || "";
  const pathname = headersList.get('x-current-path')?.split('?')[0] || "";
  const referrer = headersList.get('referer');

  const isMatchingViewerUrl: boolean = MINDPAL_VIEWER_DOMAIN_LIST.some(
    (url: string) =>
      // @ts-ignore
      host.split(':')[0]?.includes(url.split('//')[1]?.split(':')[0]) ||
      // @ts-ignore
      (forwardedHost && forwardedHost?.split(':')[0]?.includes(url.split('//')[1]?.split(':')[0]))
  );
  const customDomain = `${forwardedHost ?? host}${pathname === '/' ? '' : pathname
    }`

  const workflowData = isMatchingViewerUrl && params.slug && params.slug[0]
    ? await getWorkflowBySlug({ workflowIdOrSlug: params.slug[0].toString() })
    : await getWorkflowByCustomDomain({ workflowCustomDomain: customDomain.replace(/(^\w+:|^)\/\//, '') })

  const workflowRunId = (searchParams as { wrid: string | undefined }).wrid;

  if (!!workflowRunId) {
    const workflowRunData = await getWorkflowRunData({ workflowRunId });
    if (!workflowRunData) {
      return (
        <ThemeWrapper>
          <main className="w-screen min-h-screen flex items-center justify-center bg-default-100">
            <ErrorScreen
              heading={"Not found"}
              desc={"This workflow run doesn't exist."}
              ctaText="Back to home"
              ctaOnClick={() => window.open(MINDPAL_LANDING_PAGE_URL)}
            />
          </main>
        </ThemeWrapper>
      )
    } else {
      return (
        <ThemeWrapper themeValue={workflowRunData.Workflow.theme.toLowerCase().replace("_", "-")}>
          <main className="w-screen min-h-screen bg-default-50">
            <AI
              initialAIState={{
                workflowRunId: workflowRunData.id,
                messages:
                  workflowRunData.WorkflowRunResultItem.filter(i => !!i.content)
                    .map(msg => ([
                      {
                        id: generateId(), workflowRunResultItemId: msg.id, role: "user",
                        content: updatePromptWithActualValuesOfVariables(
                          msg.WorkflowNode.prompt,
                          workflowRunData.WorkflowRunTriggerInput.map(item => ({ workflowTriggerInputId: item.workflowTriggerInputId, inputValue: item.value })),
                          workflowRunData.WorkflowRunResultItem.map(item => ({ inputNodeId: item.workflowNodeId, inputContent: item.content || '' })),
                        )
                      },
                      {
                        id: generateId(), workflowRunResultItemId: msg.id, role: msg.role.toLowerCase(), name: msg.name,
                        content: msg.content, referenceList: msg.referenceList
                      }
                    ])).flat(),
              }}
            >
              <WorkflowRunScreen workflowRunData={workflowRunData} />
            </AI>
          </main>
        </ThemeWrapper>
      )
    }
  }

  if (!workflowData) {
    return (
      <ThemeWrapper>
        <main className="w-screen min-h-screen flex items-center justify-center bg-default-100">
          <ErrorScreen heading={"404 Error"} desc={"This workflow doesn't exist."} />
        </main>
      </ThemeWrapper>
    )
  }
  if (
    workflowData.isEmbedRestricted === true
    && referrer
    // NOT AMONG MINDPAL VIEWER DOMAIN LIST
    && !MINDPAL_VIEWER_DOMAIN_LIST.map(item => extractDomain(item)).includes(extractDomain(referrer))
    // AND NOT BELONG TO EMBED RESTRICTED DOMAIN LIST
    && !workflowData.embedRestrictedDomainList.includes(extractDomain(referrer) || getDomainFromSubdomain(extractDomain(referrer)))
  ) {
    return (
      <ThemeWrapper>
        <main className="w-screen min-h-screen flex items-center justify-center bg-background">
          <ErrorScreen heading={"Access denied"} desc={"This workflow is restricted from appearing on this domain."} />
        </main>
      </ThemeWrapper>
    )
  }

  if (!workflowData.isForSale) {
    return (
      <ThemeWrapper>
        <main className="w-screen min-h-screen flex items-center justify-center bg-background">
          <ErrorScreen heading={"This workflow is not available."} desc={"This workflow is not published by its author."} />
        </main>
      </ThemeWrapper>
    )
  }

  return (
    <ThemeWrapper themeValue={workflowData.theme.toLowerCase().replace("_", "-")}>
      <main className="w-screen min-h-screen bg-background">
        <WorkflowContextProvider
          workflowData={workflowData}
          workflowId={workflowData.id}
        >
          <WorkflowFormScreen />
        </WorkflowContextProvider>
      </main>
    </ThemeWrapper>
  )
}
"use client";

import { Divider } from "@nextui-org/react";
import WorkflowRunHeader from "./WorkflowRunHeader";
import WorkflowRunInfo from "./WorkflowRunInfo";
import WorkflowRunResult from "./WorkflowRunResult";

export default function WorkflowRunStudio() {

  return (
    <main className="w-full h-[calc(100vh-4rem)] lg:h-screen flex flex-row overflow-hidden">
      <section className={`w-full h-full overflow-hidden overflow-y-auto flex flex-col`}>
        <div className="w-full flex-none">
          <WorkflowRunHeader />
        </div>
        <section className="w-full h-full overflow-visible overflow-y-auto pt-12 pb-6">
          <section className="w-full mx-auto flex items-start justify-center gap-16">
            <div className="max-w-screen-md w-full flex flex-col gap-6">
              <WorkflowRunInfo />
              <Divider />
              <WorkflowRunResult />
            </div>
          </section>
        </section>
      </section>
    </main>
  )
}
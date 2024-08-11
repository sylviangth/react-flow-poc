"use client";

import WorkflowForm from "~/components/workflow/WorkflowForm";

export default function WorkflowFormScreen() {

  return (
    <main className="w-full mx-auto px-4 pt-4 md:pt-6 pb-8 h-screen flex flex-col overflow-hidden overflow-y-auto items-start gap-16">
      <section className="w-full h-full flex flex-col items-center">
        <WorkflowForm />
      </section>
    </main>
  )
}
"use client";

import { EllipsisBlock } from "@/components/ui/ellipsis-block";
import { TabsContent } from "@/components/ui/tabs";

export function StepsTab({ steps }: { steps: any[] }) {
  if (!steps?.length) return null;

  return (
    <TabsContent value="steps">
      <EllipsisBlock
        title="Test Steps"
        key="steps"
        errors={[
          steps
            .map((s, index) =>
              s.snippet
                ? `${index + 1}. <span class="text-destructive font-medium">${
                    s.title
                  }</span>\n${s.snippet}`
                : `${index + 1}. ${s.title}`
            )
            .join("\n"),
        ]}
      />
    </TabsContent>
  );
}

"use client";

import { EllipsisBlock } from "@/components/ui/ellipsis-block";
import { TabsContent } from "@/components/ui/tabs";

export function ErrorsTab({ errors }: { errors: string[] }) {
  if (!errors?.length) return null;

  return (
    <TabsContent value="errors" className="pt-4">
      {errors.map((e, i) => (
        <div key={i} className="flex gap-2">
          <EllipsisBlock errors={[e]} title="Error" />
        </div>
      ))}
    </TabsContent>
  );
}

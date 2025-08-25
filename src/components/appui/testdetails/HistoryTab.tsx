"use client";

import { TabsContent } from "@/components/ui/tabs";
import type { TestHistoryItem } from "@/lib/types/OrtoniReportData";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EllipsisBlock } from "../../ui/ellipsis-block";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { StatusPill } from "../common/utils";
import { Button } from "@/components/ui/button";

export function HistoryTab({ history }: { history?: any }) {
  if (!history) return null;

  return (
    <TabsContent value="history">
      <ShowHistory history={history.history} />
    </TabsContent>
  );
}

export function ShowHistory({ history }: { history: TestHistoryItem[] }) {
  if (!history?.length) {
    return (
      <p className="text-sm text-muted-foreground">No history available</p>
    );
  }

  return (
    <Table className="p-6">
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Error Message</TableHead>
          <TableHead>Run Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.length > 0 ? (
          history.map((item, i) => (
            <TableRow key={i}>
              <TableCell>
                <StatusPill status={item.status} />
              </TableCell>
              <TableCell>{item.duration}</TableCell>
              <TableCell>
                {item.error_message.length > 0 ? (
                  <ShowHistoryError message={item.error_message.split("\n")} />
                ) : (
                  <span className="text-muted-foreground">No error</span>
                )}
              </TableCell>
              <TableCell>{new Date(item.run_date).toLocaleString()}</TableCell>
            </TableRow>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-6">
            No history available for this test.
          </div>
        )}
      </TableBody>
    </Table>
  );
}

export function ShowHistoryError({ message }: { message: string[] }) {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="default" size="sm" className="flex items-center gap-1">
          <span className="truncate max-w-[150px]">Show Error</span>{" "}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-full w-full border rounded-md p-2">
          <div className="p-4 max-h-[70vh] overflow-y-auto flex justify-center">
            <EllipsisBlock errors={message} title="Test history" />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

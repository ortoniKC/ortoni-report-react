import type {
  TestHistoryItem,
  TestResultItem,
} from "@/lib/types/OrtoniReportData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertCircle, Check, ChevronRight, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function ErrorBlock({ errors }: { errors: string[] }) {
  if (!errors?.length) return null;
  return (
    <Card className="border-destructive/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Errors</CardTitle>
        <CardDescription>Captured error messages from the run</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {errors.map((e, idx) => (
          <pre
            key={idx}
            className="overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: e }}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function ShowHistory({ history }: { history: TestHistoryItem[] }) {
  if (!history?.length) {
    return (
      <p className="text-sm text-muted-foreground">No history available</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Error Message</TableHead>
          <TableHead>Run Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((item, i) => (
          <TableRow key={i}>
            <TableCell>
              <Badge
                variant={
                  item.status === "passed"
                    ? "default"
                    : item.status === "failed"
                    ? "destructive"
                    : "secondary"
                }
              >
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>{item.duration}</TableCell>
            <TableCell>
              {item.error_message.length > 0 ? (
                <ErrorMessageViewer message={item.error_message.split("\n")} />
              ) : (
                <span className="text-muted-foreground">No error</span>
              )}
            </TableCell>
            <TableCell>{new Date(item.run_date).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ErrorMessageViewer({ message }: { message: string[] }) {
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
        <ScrollArea className="h-[80vh] w-full overflow-x-auto rounded-md border bg-muted p-4">
          <div className="min-w-max">
            {" "}
            {message.map((e, i) => (
              <pre
                key={i}
                className="text-xs whitespace-pre"
                dangerouslySetInnerHTML={{ __html: e }}
              />
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

export function StatusPill({ status }: { status: TestResultItem["status"] }) {
  const statusConfig = {
    passed: {
      class:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
      icon: <Check className="h-4 w-4" />,
    },
    failed: {
      class: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
      icon: <XCircle className="h-4 w-4" />,
    },
    interrupted: {
      class: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
      icon: <XCircle className="h-4 w-4" />,
    },
    timedOut: {
      class:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
      icon: <Clock className="h-4 w-4" />,
    },
    flaky: {
      class:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
      icon: <AlertCircle className="h-4 w-4" />,
    },
    skipped: {
      class:
        "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
      icon: <ChevronRight className="h-4 w-4" />,
    },
    expected: {
      class:
        "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
      icon: <ChevronRight className="h-4 w-4" />,
    },
    unexpected: {
      class:
        "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20",
      icon: <ChevronRight className="h-4 w-4" />,
    },
  };

  const config = statusConfig[status] || {
    class: "bg-muted text-foreground/80 border-muted-foreground/20",
    icon: <AlertCircle className="h-4 w-4" />,
  };

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${config.class}`}
    >
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  );
}

export function toFileUrl(p: string) {
  return p.startsWith("http") ? p : p;
}

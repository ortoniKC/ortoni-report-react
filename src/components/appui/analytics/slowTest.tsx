import { type SlowTest } from "@/lib/types/OrtoniReportData";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/card";
import { ScrollArea } from "../../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { formatDuration } from "@/lib/utils";

export const SlowTests = memo(
  (props: { slowTest: SlowTest[]; title: string }) => {
    const { slowTest, title } = props;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 * 0.1 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className="group relative"
      >
        <Card className="py-4 sm:py-0">
          <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
              <CardTitle className="pt-6">{title}</CardTitle>
              <CardDescription className="pb-6">
                {title.includes("Slow")
                  ? "Showing the slowest tests over the time"
                  : "Showing the flaky tests over the time"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-2 sm:p-6">
            {slowTest.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                Not enough data to display {title.toLowerCase()}
              </p>
            ) : (
              <ScrollArea className="w-full hide-scrollbar">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead className="text-left">S.no</TableHead>
                      <TableHead className="text-left">Test</TableHead>
                      <TableHead className="text-left">
                        Average Duration
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {slowTest.map((r, i) => (
                        <motion.tr
                          key={r.test_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="group cursor-pointer transition-colors"
                        >
                          <TableCell className="max-w-[240px] truncate group-hover:bg-muted/20 group-hover:shadow-inner transition-all duration-200">
                            {i + 1}
                          </TableCell>
                          <TableCell className="max-w-[240px] truncate group-hover:bg-muted/20 group-hover:shadow-inner transition-all duration-200">
                            {r.test_id}
                          </TableCell>
                          <TableCell className="max-w-[280px] truncate group-hover:bg-muted/20 group-hover:shadow-inner transition-all duration-200">
                            {formatDuration(r.avg_duration)}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

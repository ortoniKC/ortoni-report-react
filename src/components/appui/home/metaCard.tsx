import { motion, useInView } from "framer-motion";
import { Target, Gauge, CalendarClock, Timer } from "lucide-react";
import { memo, useRef } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { OverallExecutionResult } from "@/components/charts/overallExecutionChart";
import type {
  Summary,
  UserConfig,
  UserMeta,
} from "@/lib/types/OrtoniReportData";
import { formatDuration } from "@/lib/utils";

export const MetaCard = memo(
  (props: { UserMeta: UserMeta; summary: Summary; userConfig: UserConfig }) => {
    const missionRef = useRef(null);
    const missionInView = useInView(missionRef, { once: true, amount: 0.3 });

    const { UserMeta, summary } = props;
    return (
      <section className="relative w-full overflow-hidden">
        <div className="relative z-10 container mx-auto">
          <div ref={missionRef} className="relative mx-auto mb-1 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={
                missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative z-10"
            >
              <motion.div
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br p-6 md:p-8"
              >
                <BorderBeam
                  duration={8}
                  size={500}
                  className="via-purple-500/40 from-transparent to-transparent"
                />

                <div className="flex items-center justify-center pb-6 border-b border-border/40">
                  <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4.5 w-4.5 text-primary" />
                      <span className="text-sm text-muted-foreground">Success Rate:</span>
                      <span className="text-sm font-semibold">
                        {summary.successRate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4.5 w-4.5 text-primary" />
                      <span className="text-sm text-muted-foreground">Last Run:</span>
                      <span className="text-sm font-semibold">
                        {summary.lastRunDate || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4.5 w-4.5 text-primary" />
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="text-sm font-semibold">
                        {formatDuration(summary.totalDuration)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:divide-x divide-border/40 pt-6">
                  {/* Left Column: Overall Execution Chart */}
                  <div className="flex flex-col justify-center">
                    <OverallExecutionResult summary={summary} borderless />
                  </div>

                  {/* Right Column: Meta Information */}
                  <div className="flex flex-col justify-left pt-4">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm">
                        <Target className="h-5 w-5 text-blue-500" />
                      </div>
                      <h2 className="bg-gradient-to-r from-blue-500/90 to-blue-500/70 bg-clip-text text-xl font-semibold text-transparent mb-0">
                        Meta Information
                      </h2>
                    </div>

                    <div className="text-muted-foreground text-sm leading-relaxed pt-2">
                      <ul className="list-disc pl-5 space-y-1.5">
                        {Object.keys(UserMeta.meta ?? {}).length > 0 ? (
                          Object.entries(UserMeta.meta!).map(([key, value]) => (
                            <li key={key} className="text-sm">
                              <strong>
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                              </strong>{" "}
                              {String(value)}
                            </li>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            Add meta information in Ortoni Report Config
                          </p>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
);

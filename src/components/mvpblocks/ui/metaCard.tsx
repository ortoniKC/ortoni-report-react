import { motion, useInView } from "framer-motion";
import { Rocket, Target, Gauge, CalendarClock, Timer } from "lucide-react";
import { memo, useRef } from "react";
import { BorderBeam } from "@/components/ui/border-beam";

type UserResult = {
  successRate: string;
  lastRun: string;
  duration: string;
};

type UserMeta = {
  [key: string]: string;
};

export type UserData = {
  result: UserResult;
  meta: UserMeta;
};
export const MetaCard = memo((props: UserData) => {
  const missionRef = useRef(null);

  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative z-10 container mx-auto">
        <div ref={missionRef} className="relative mx-auto mb-24 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative z-10 grid gap-12 md:grid-cols-2"
          >
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="via-purple-500/40 from-transparent to-transparent"
              />

              <div className="flex items-center gap-4 mb-6">
                <div className="from-purple-500/20 to-purple-500/5 inline-flex aspect-square h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br backdrop-blur-sm">
                  <Rocket className="text-purple-500 h-6 w-6" />
                </div>
                <h2 className="from-purple-500/90 to-purple-500/70 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                  {props.meta.project}
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-primary" />
                    <span className="text-sm">Success Rate:</span>
                    <span className="font-semibold">
                      {props.result.successRate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    <span className="text-sm">Last Run:</span>
                    <span className="font-semibold">
                      {props.result.lastRun}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-primary" />
                    <span className="text-sm">Duration:</span>
                    <span className="semi-bold">{props.result.duration}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="group border-border/40 relative block overflow-hidden rounded-2xl border bg-gradient-to-br p-10 backdrop-blur-3xl"
            >
              <BorderBeam
                duration={8}
                size={300}
                className="from-transparent via-blue-500/40 to-transparent"
                reverse
              />
              <div className="flex items-center gap-4 mb-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="bg-gradient-to-r from-blue-500/90 to-blue-500/70 bg-clip-text text-xl font-semibold text-transparent mb-0">
                  Meta Information
                </h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <ul className="list-disc pl-5 space-y-1">
                  {Object.entries(props.meta).map(([key, value]) =>
                    value !== undefined && value !== "" ? (
                      <li key={key}>
                        <strong>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </strong>{" "}
                        {value}
                      </li>
                    ) : null
                  )}
                </ul>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

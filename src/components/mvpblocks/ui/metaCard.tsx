import { memo } from "react";

type Result = {
  successRate: string;
  lastRun: string;
  duration: string;
};

export const MetaCard = memo(({ result }: { result: Result }) => {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-lg border border-dashed border-zinc-300 px-4 sm:px-6 md:px-8 dark:border-zinc-800">
      <div className="absolute top-4 left-0 -z-0 h-px w-full bg-zinc-400 sm:top-6 md:top-8 dark:bg-zinc-700" />
      <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-zinc-400 sm:bottom-6 md:bottom-8 dark:bg-zinc-700" />
      <div className="relative w-full border-x border-zinc-400 dark:border-zinc-700">
        <div className="absolute z-0 grid h-full w-full items-center">
          <section className="absolute z-0 grid h-full w-full grid-cols-2 place-content-between">
            <div className="bg-primary my-4 size-1 -translate-x-[2.5px] rounded-full outline outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950" />
            <div className="bg-primary my-4 size-1 translate-x-[2.5px] place-self-end rounded-full outline outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950" />
            <div className="bg-primary my-4 size-1 -translate-x-[2.5px] rounded-full outline outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950" />
            <div className="bg-primary my-4 size-1 translate-x-[2.5px] place-self-end rounded-full outline outline-8 outline-gray-50 sm:my-6 md:my-8 dark:outline-gray-950" />
          </section>
        </div>
        <div className="relative z-20 mx-auto py-8">
          <div className="p-6">
            <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
              Result
            </h3>
            <div className="mb-2">
              <span className="font-semibold">Success Rate: </span>
              <span>{result.successRate}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Last Run: </span>
              <span>{result.lastRun}</span>
            </div>
            <div>
              <span className="font-semibold">Duration: </span>
              <span>{result.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

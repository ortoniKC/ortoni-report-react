import DOMPurify from "dompurify";
import { formatIfJson } from "@/lib/utils";

export function AnnotationItem({
  type,
  description,
}: {
  type: string;
  description?: string;
}) {
  const formattedDescription = description ? formatIfJson(description) : "";

  return (
    <div className="flex flex-col text-sm border-l-2 border-primary/20 pl-3 py-1 bg-muted/5 rounded-r">
      <span className="font-semibold text-xs uppercase tracking-tight text-primary/70 mb-1">
        Type: <span className="text-foreground">{type}</span>
      </span>

      {description && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Description:</span>
          <pre
            className="text-muted-foreground whitespace-pre-wrap font-mono text-xs bg-muted/40 p-2 rounded"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedDescription) }}
          />
        </div>
      )}
    </div>
  );
}

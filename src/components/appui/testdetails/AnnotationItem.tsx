"use client";

export function AnnotationItem({
  type,
  description,
}: {
  type: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col text-sm">
      <span>
        Type: <span className="text-muted-foreground">{type}</span>
      </span>

      {description && (
        <span>
          Description:{" "}
          <span className="text-muted-foreground">{description}</span>
        </span>
      )}
    </div>
  );
}

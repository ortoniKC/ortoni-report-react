import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";

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

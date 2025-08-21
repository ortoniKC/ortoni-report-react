import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex flex-col items-center justify-center rounded-full">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        className="rounded-full"
      >
        <Sun className="h-3 w-3" />
        <span className="sr-only">Toggle light theme</span>
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        className="rounded-full"
      >
        <Moon className="h-3 w-3" />
        <span className="sr-only">Toggle dark theme</span>
      </Button>
      {/* <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        className="rounded-full"
      >
        <Monitor className="h-3 w-3" />
        <span className="sr-only">Toggle system theme</span>
      </Button> */}
    </div>
  );
}

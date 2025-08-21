import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Monitor, Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center justify-center rounded-full p-1 text-gray-600">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
        className="rounded-full"
      >
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle light theme</span>
      </Button>
      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="rounded-full"
      >
        <Moon className="h-5 w-5" />
        <span className="sr-only">Toggle dark theme</span>
      </Button>
      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setTheme("system")}
        className="rounded-full"
      >
        <Monitor className="h-5 w-5" />
        <span className="sr-only">Toggle system theme</span>
      </Button>
    </div>
  );
}

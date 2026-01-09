/**
 * Theme Toggle component for TodoApp.
 *
 * Provides a button to switch between light, dark, and system themes.
 */

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    // Ensure theme is properly typed and not undefined
    const currentTheme = (theme || "system") as "light" | "dark" | "system";
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex] as "light" | "dark" | "system");
  };

  const getIcon = () => {
    const currentTheme = theme ?? "system";
    switch (currentTheme) {
      case "light":
        return <Sun className="h-5 w-5" />;
      case "dark":
        return <Moon className="h-5 w-5" />;
      case "system":
        return <Monitor className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    const currentTheme = theme ?? "system";
    switch (currentTheme) {
      case "light":
        return "Switch to dark mode";
      case "dark":
        return "Switch to system mode";
      case "system":
        return "Switch to light mode";
      default:
        return "Toggle theme";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={getLabel()}
        title={getLabel()}
      >
        {getIcon()}
      </Button>
    </motion.div>
  );
}
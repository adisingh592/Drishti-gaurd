import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      title={theme === "light" ? "Dark mode" : "Light mode"}
      className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl card-soft flex items-center justify-center text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring cursor-pointer overflow-hidden"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <motion.div
          initial={false}
          animate={theme === "light" ? { rotate: 0, scale: 1, opacity: 1 } : { rotate: 90, scale: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute"
        >
          <Sun className="w-5 h-5" strokeWidth={1.8} />
        </motion.div>
        <motion.div
          initial={false}
          animate={theme === "dark" ? { rotate: 0, scale: 1, opacity: 1 } : { rotate: -90, scale: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute"
        >
          <Moon className="w-5 h-5" strokeWidth={1.8} />
        </motion.div>
      </div>
    </motion.button>
  );
}

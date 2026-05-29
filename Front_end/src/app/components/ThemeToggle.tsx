import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl border border-slate-200 dark:border-blue-500/20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.1)] text-slate-700 dark:text-cyan-400 focus:outline-none overflow-hidden cursor-pointer"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <motion.div
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={
            theme === "light"
              ? { rotate: 0, scale: 1, opacity: 1 }
              : { rotate: 90, scale: 0, opacity: 0 }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute"
        >
          <Sun className="w-5 h-5 text-amber-500" />
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          initial={{ rotate: 90, scale: 0, opacity: 0 }}
          animate={
            theme === "dark"
              ? { rotate: 0, scale: 1, opacity: 1 }
              : { rotate: -90, scale: 0, opacity: 0 }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute"
        >
          <Moon className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </div>
    </motion.button>
  );
}

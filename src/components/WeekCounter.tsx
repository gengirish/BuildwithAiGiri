"use client";

import { motion } from "framer-motion";

export function WeekCounter() {
  const currentWeek: number = 0;
  const totalWeeks: number = 25;
  const progress = (currentWeek / totalWeeks) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mx-auto max-w-xl"
    >
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-cyan-400">
            Week {currentWeek} of {totalWeeks}
          </span>
          <span className="text-sm text-gray-400 font-medium">
            Now Accepting Ideas
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(progress, 2)}%` }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
          />
          {/* Pulse dot at the leading edge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ delay: 1.6, duration: 2, repeat: Infinity }}
            className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white"
            style={{ left: `${Math.max(progress, 2)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            {currentWeek} MVP{currentWeek !== 1 ? "s" : ""} shipped
          </span>
          <span className="text-xs text-gray-500">
            {totalWeeks - currentWeek} weeks remaining
          </span>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

function AnimatedNumber({ target }: { target: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) motionValue.set(target);
  }, [isInView, target, motionValue]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function WeekCounter() {
  const currentWeek = 1;
  const totalWeeks = 25;

  const stats = [
    { label: "Current Week", value: currentWeek, suffix: "" },
    { label: "Total Weeks", value: totalWeeks, suffix: "" },
    { label: "Ideas Received", value: 0, suffix: "+" },
    { label: "MVPs Built", value: 0, suffix: "" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card p-4 text-center"
        >
          <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-[var(--font-space)]">
            <AnimatedNumber target={stat.value} />
            {stat.suffix}
          </div>
          <div className="mt-1 text-xs sm:text-sm text-gray-500">
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

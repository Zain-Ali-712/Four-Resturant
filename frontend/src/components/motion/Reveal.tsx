"use client";

import { motion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "p" | "span";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

const line: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1, delay: i * 0.08, ease: EASE } }),
};

/** Big display heading where each line slides up from behind a mask. */
export function SplitHeading({ lines, className, lineClassName = "" }: { lines: React.ReactNode[]; className?: string; lineClassName?: string }) {
  return (
    <motion.h2 className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15% 0px" }}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span className={`block ${lineClassName}`} variants={line} custom={i}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}

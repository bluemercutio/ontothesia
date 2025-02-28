"use client";

import { motion } from "framer-motion";

export function IntroTitle() {
  const text = "ONTOTHESIA";

  return (
    <h1 className="text-4xl font-bold font-[family-name:var(--font-kanit)]">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.1,
            delay: index * 0.1,
            y: {
              type: "spring",
              damping: 10,
              stiffness: 100,
            },
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </h1>
  );
}

"use client";

import { motion } from "framer-motion";

export function IntroTitleAdvanced() {
  // mt-12 is 48px, so we move each word half that distance (24px)
  const moveDistance = 44;

  // Split words into letters for animation
  const ontoLetters = "ONTO".split("");
  const logicalLetters = "LOGICAL".split("");
  const synesLetters = "SYNES".split("");
  const thesiaLetters = "THESIA".split("");

  return (
    <div className="relative h-32 flex flex-col items-start">
      <div className="flex relative ml-1.5">
        {/* White ONTO */}
        <motion.div
          className="flex relative tracking-normal"
          animate={{ y: [0, 0, moveDistance] }}
          transition={{
            y: {
              duration: 1.2,
              delay: 1.1,
              times: [0, 0.7, 1],
              ease: "easeInOut",
            },
          }}
        >
          {ontoLetters.map((letter, index) => (
            <motion.span
              key={`onto-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                opacity: { duration: 0.3, delay: index * 0.1 },
                x: { duration: 0.3, delay: index * 0.1 },
              }}
              className="text-4xl font-bold font-[family-name:var(--font-kanit)] text-white"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Gray LOGICAL */}
        <div className="flex tracking-normal">
          {logicalLetters.map((letter, index) => (
            <motion.span
              key={`logical-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                opacity: {
                  duration: 2,
                  times: [0, 0.2, 0.7, 1],
                  delay: 0.4 + index * 0.1,
                },
              }}
              className="text-4xl font-bold font-[family-name:var(--font-kanit)] text-gray-400"
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="flex mt-12 relative -ml-1.5">
        {/* Gray SYNES */}
        <div className="flex tracking-normal">
          {synesLetters.map((letter, index) => (
            <motion.span
              key={`synes-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                opacity: {
                  duration: 2,
                  times: [0, 0.2, 0.7, 1],
                  delay: 0.4 + index * 0.1,
                },
              }}
              className="text-4xl font-bold font-[family-name:var(--font-kanit)] text-gray-400"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* White THESIA */}
        <motion.div
          className="flex relative tracking-normal"
          animate={{ y: [0, 0, -moveDistance] }}
          transition={{
            y: {
              duration: 1.2,
              delay: 1.1,
              times: [0, 0.7, 1],
              ease: "easeInOut",
            },
          }}
        >
          {thesiaLetters.map((letter, index) => (
            <motion.span
              key={`thesia-${index}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                opacity: { duration: 0.3, delay: index * 0.1 },
                x: { duration: 0.3, delay: index * 0.1 },
              }}
              className="text-4xl font-bold font-[family-name:var(--font-kanit)] text-white"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

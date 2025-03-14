import { motion } from "framer-motion";

export function WaveLoader() {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="h-8 w-2 rounded bg-emerald-400"
          animate={{
            scaleY: [1, 1.5, 1],
            translateY: ["0%", "-25%", "0%"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
}

export function RippleWaveLoader() {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(7)].map((_, index) => (
        <motion.div
          key={index}
          className="h-8 w-2 rounded-full bg-emerald-400"
          animate={{
            scaleY: [0.5, 1.5, 0.5],
            scaleX: [1, 0.8, 1],
            translateY: ["0%", "-15%", "0%"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
}

export function PulsatingDots() {
  const className: string = "size-1 rounded-full bg-primary";
  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-1">
        <motion.div
          className={className}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div
          className={className}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.3,
          }}
        />
        <motion.div
          className={className}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.6,
          }}
        />
      </div>
    </div>
  );
}

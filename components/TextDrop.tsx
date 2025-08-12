import { motion } from "framer-motion";
import DropCharacters from "./DropCharacters";
import { cn } from "@/lib/utils";

const TextDrop = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const container = {
    visible: {
      transition: {
        staggerChildren: 0.025,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={container}>
      <div>
        <DropCharacters text={text} className={cn(className)} />
      </div>
    </motion.div>
  );
};

export default TextDrop;

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
  animate?: boolean;
  delay?: number;
}

export function ChatMessage({ message, isUser, animate = false, delay = 0 }: ChatMessageProps) {
  const variants = {
    hidden: { 
      opacity: 0,
      x: isUser ? 20 : -20,
      y: 10
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
        delay,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  const Wrapper = animate ? motion.div : 'div';

  return (
    <Wrapper
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <motion.div
        layout
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2",
          isUser 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </motion.div>
    </Wrapper>
  );
}
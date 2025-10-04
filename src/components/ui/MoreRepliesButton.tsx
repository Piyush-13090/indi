import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

interface MoreRepliesButtonProps {
  hiddenCount: number;
  onToggle: () => void;
  isExpanded: boolean;
  depth: number;
}

const MoreRepliesButton: React.FC<MoreRepliesButtonProps> = ({
  hiddenCount,
  onToggle,
  isExpanded,
  depth
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${depth > 0 ? "ml-8" : ""}`}
    >
      {/* Thread connector for the button */}
      <div className="absolute -left-6 top-0 w-6 h-8 pointer-events-none">
        <svg
          width="24"
          height="32"
          className="absolute top-0 left-0"
          viewBox="0 0 24 32"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`moreRepliesGradient-${depth}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(156, 163, 175)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(107, 114, 128)" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id={`moreRepliesGradientDark-${depth}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(75, 85, 99)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(107, 114, 128)" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Curved connector line */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.1,
              ease: "easeInOut"
            }}
            d="M 0 0 Q 4 4 12 8 Q 20 12 24 16"
            fill="none"
            stroke={`url(#moreRepliesGradient-${depth})`}
            strokeWidth="2"
            strokeLinecap="round"
            className="dark:hidden"
          />
          
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.1,
              ease: "easeInOut"
            }}
            d="M 0 0 Q 4 4 12 8 Q 20 12 24 16"
            fill="none"
            stroke={`url(#moreRepliesGradientDark-${depth})`}
            strokeWidth="2"
            strokeLinecap="round"
            className="hidden dark:block"
          />

          {/* Connection dot */}
          <motion.circle
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.2, 
              delay: 0.3,
              ease: "easeOut"
            }}
            cx="24"
            cy="16"
            r="2.5"
            fill="rgb(107, 114, 128)"
            className="dark:fill-gray-400"
          />
        </svg>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onToggle}
        className={`
          relative backdrop-blur-xl bg-white/60 dark:bg-black/30
          rounded-xl border border-white/20 dark:border-white/10
          shadow-md hover:shadow-lg transition-all duration-300
          p-3 mb-4 ml-4 w-full max-w-xs
          ${isHovered ? "bg-white/80 dark:bg-black/50" : ""}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                rotate: isExpanded ? 180 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </motion.div>
            
            <MessageCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isExpanded ? "Hide" : "+"} {hiddenCount} more {hiddenCount === 1 ? "reply" : "replies"}
            </span>
          </div>
        </div>

        {/* Subtle animation indicator */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </motion.button>
    </motion.div>
  );
};

export default MoreRepliesButton;

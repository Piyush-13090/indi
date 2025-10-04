import React from "react";
import { motion } from "framer-motion";

interface ThreadConnectorProps {
  depth: number;
  isLast?: boolean;
}

const ThreadConnector: React.FC<ThreadConnectorProps> = ({ 
  depth, 
  isLast = false
}) => {
  if (depth === 0) return null;

  const connectorWidth = 24;
  const connectorHeight = 40;
  const curveRadius = 8;

  // Create curved path for the thread connection
  const createCurvedPath = () => {
    const startX = 0;
    const startY = 0;
    const endX = connectorWidth;
    const endY = connectorHeight;
    
    // Create a smooth curved path
    const path = `
      M ${startX} ${startY}
      Q ${startX + curveRadius} ${startY + curveRadius} ${startX + connectorWidth/2} ${startY + connectorHeight/3}
      Q ${endX - curveRadius} ${endY - curveRadius} ${endX} ${endY}
    `;
    
    return path;
  };

  // Create horizontal connector for the last child
  const createHorizontalPath = () => {
    const startX = 0;
    const startY = connectorHeight / 2;
    const endX = connectorWidth;
    const endY = connectorHeight / 2;
    
    return `
      M ${startX} ${startY}
      Q ${startX + connectorWidth/2} ${startY - curveRadius} ${endX} ${endY}
    `;
  };

  return (
    <div className="absolute -left-6 top-0 w-6 h-full pointer-events-none">
      <svg
        width={connectorWidth}
        height={connectorHeight}
        className="absolute top-0 left-0"
        viewBox={`0 0 ${connectorWidth} ${connectorHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`threadGradient-${depth}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(156, 163, 175)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="rgb(107, 114, 128)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(75, 85, 99)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id={`threadGradientDark-${depth}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(75, 85, 99)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="rgb(107, 114, 128)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(156, 163, 175)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Main curved connector */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            ease: "easeInOut"
          }}
          d={createCurvedPath()}
          fill="none"
          stroke={`url(#threadGradient-${depth})`}
          strokeWidth="2"
          strokeLinecap="round"
          className="dark:hidden"
        />
        
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            ease: "easeInOut"
          }}
          d={createCurvedPath()}
          fill="none"
          stroke={`url(#threadGradientDark-${depth})`}
          strokeWidth="2"
          strokeLinecap="round"
          className="hidden dark:block"
        />

        {/* Horizontal connector for last child */}
        {isLast && (
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.4,
              ease: "easeInOut"
            }}
            d={createHorizontalPath()}
            fill="none"
            stroke={`url(#threadGradient-${depth})`}
            strokeWidth="2"
            strokeLinecap="round"
            className="dark:hidden"
          />
        )}
        
        {isLast && (
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.4,
              ease: "easeInOut"
            }}
            d={createHorizontalPath()}
            fill="none"
            stroke={`url(#threadGradientDark-${depth})`}
            strokeWidth="2"
            strokeLinecap="round"
            className="hidden dark:block"
          />
        )}

        {/* Connection dot at the end */}
        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: 0.6,
            ease: "easeOut"
          }}
          cx={connectorWidth}
          cy={isLast ? connectorHeight / 2 : connectorHeight}
          r="3"
          fill="rgb(107, 114, 128)"
          className="dark:fill-gray-400"
        />
      </svg>

      {/* Vertical continuation line for non-last children */}
      {!isLast && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "100%", opacity: 1 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.8,
            ease: "easeInOut"
          }}
          className="absolute left-3 top-10 w-px bg-gradient-to-b from-gray-400 via-gray-500 to-transparent dark:from-gray-500 dark:via-gray-400"
        />
      )}
    </div>
  );
};

export default ThreadConnector;

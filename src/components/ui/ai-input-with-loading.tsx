"use client";

import { Send } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { postComment } from "@/lib/functions";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface AIInputWithLoadingProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  loadingDuration?: number;
  thinkingDuration?: number;
  className?: string;
  autoAnimate?: boolean;
  onCommentAdded?: () => void;
}

export function AIInputWithLoading({
  id = "ai-input-with-loading",
  placeholder = "Share your thoughts...",
  minHeight = 56,
  maxHeight = 200,
  loadingDuration = 3000,
  thinkingDuration = 1000,
  className,
  autoAnimate = false,
  onCommentAdded
}: AIInputWithLoadingProps) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(autoAnimate);
  const {isLoaded,isSignedIn, user} = useUser();
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runAnimation = () => {
      if (!autoAnimate) return;
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, thinkingDuration);
      }, loadingDuration);
    };

    if (autoAnimate) {
      runAnimation();
    }

    return () => clearTimeout(timeoutId);
  }, [autoAnimate, loadingDuration, thinkingDuration]);

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLTextAreaElement>
) => {
  e.preventDefault();

  if (!inputValue.trim() || submitted) return;

  if (!isLoaded || !isSignedIn) {
    return;
  }

  try {
    setSubmitted(true);
    const submission = await postComment({
      user: {
        id: user.id,
        fullName: user.fullName ?? "Anonymous",
      },
      content: inputValue,
    });

    if (submission?.success === true) {
      setInputValue("");
      onCommentAdded?.();
    }
  } catch (err) {
    console.error("Error posting comment:", err);
  } finally {
    setTimeout(() => setSubmitted(false), 1000);
  }
};




  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full py-6", className)}
    >
      <div className="relative max-w-2xl w-full mx-auto flex items-start flex-col gap-3">
        <div className="relative max-w-2xl w-full mx-auto">
          <motion.div
            className="relative"
          >
            <Textarea
              id={id}
              placeholder={placeholder}
              className={cn(
                "w-full rounded-2xl pl-6 pr-12 py-4",
                "backdrop-blur-xl bg-white/70 dark:bg-black/40",
                "border border-white/20 dark:border-white/10",
                "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                "text-gray-900 dark:text-gray-100 resize-none text-wrap leading-relaxed",
                "focus:ring-2 focus:ring-gray-400 focus:border-transparent",
                "shadow-lg hover:shadow-xl transition-all duration-300",
                `min-h-[${minHeight}px]`
              )}
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={submitted}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleSubmit(e)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2",
                "transition-all duration-200 backdrop-blur-sm",
                submitted 
                  ? "bg-gray-100/80 dark:bg-gray-800/50" 
                  : inputValue.trim()
                    ? "bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
                    : "bg-white/50 dark:bg-black/30 text-gray-400"
              )}
              type="button"
              disabled={submitted || !inputValue.trim()}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"
                  />
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
        <motion.p 
          animate={{ opacity: submitted ? 0.5 : 1 }}
          className="pl-4 h-4 text-xs mx-auto text-gray-500 dark:text-gray-400"
        >
          {submitted ? "Posting your comment..." : "Type something.."}
        </motion.p>
      </div>
    </motion.div>
  );
}
import React, { useState } from "react";
import { Heart, Reply, Trash2 } from "lucide-react";
import { Comment } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import ThreadConnector from "./ThreadConnector";
import MoreRepliesButton from "./MoreRepliesButton";
import { formatRelativeTime } from "@/lib/timeUtils";



interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, authorUsername: string) => void;
  onLike: (commentId: string) => Promise<{ success: boolean; data?: { likes: number } } | undefined>;
  onDelete?: (commentId: string) => Promise<void>;
  replyTo: string | null;
  onAddReply: (parentId: string, content: string) => void;
  onCancelReply: () => void;
  depth?: number;
  isLast?: boolean;
  user: { id: string; name?: string } | null;
}

const CommentItem = ({
  comment,
  onReply,
  onLike,
  onDelete,
  replyTo,
  onAddReply,
  onCancelReply,
  depth = 0,
  isLast = false,
  user
}: CommentItemProps) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes ?? 0);
  const [showAllReplies, setShowAllReplies] = useState(false);

  // Configuration for how many replies to show initially
  const INITIAL_REPLIES_LIMIT = 2;
  const totalReplies = comment.children?.length || 0;
  const hiddenRepliesCount = totalReplies - INITIAL_REPLIES_LIMIT;
  const shouldShowMoreButton = totalReplies > INITIAL_REPLIES_LIMIT;
  const visibleReplies = showAllReplies 
    ? comment.children 
    : comment.children?.slice(0, INITIAL_REPLIES_LIMIT);

  const handleLike = async () => {
    const result = await onLike(comment.id.toString());
    if (result?.success) {
      setIsLiked(!isLiked);
      if (result.data?.likes !== undefined) {
        setLikeCount(result.data.likes);
      }
    }
  };

  const handleReply = () => {
    setReplyOpen(true);
  };

  const handlePostReply = () => {
    onAddReply(comment.id.toString(), replyContent);
    setReplyContent("");
    setReplyOpen(false);
  };

  const handleCancelReply = () => {
    setReplyContent("");
    setReplyOpen(false);
    onCancelReply();
  };

  const handleDelete = async () => {
    if (onDelete && window.confirm("Are you sure you want to delete this comment?")) {
      await onDelete(comment.id.toString());
    }
  };

  const handleToggleReplies = () => {
    setShowAllReplies(!showAllReplies);
  };

  const isAuthor = user && comment.authorId === user.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative ${depth > 0 ? "ml-8" : ""}`}
    >
      <ThreadConnector 
        depth={depth} 
        isLast={isLast}
      />
      
      <motion.div
        className={`
          relative backdrop-blur-xl bg-white/70 dark:bg-black/40
          rounded-2xl border border-white/20 dark:border-white/10
          shadow-lg hover:shadow-xl transition-all duration-300
          p-6 mb-4
          ${depth > 0 ? "ml-4 border-l-2 border-l-gray-300/50 dark:border-l-gray-600/50" : ""}
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 flex items-center justify-center text-white dark:text-black text-sm font-semibold shadow-lg">
              {(comment.author || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {comment.author || "Anonymous"}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(comment.timestamp || new Date().toISOString())}
              </div>
            </div>
          </div>
          
          {isAuthor && onDelete && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-2 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
        >
          {comment.text}
        </motion.p>

        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              backdrop-blur-sm transition-all duration-200
              ${isLiked 
                ? "bg-red-50/80 text-red-600 dark:bg-red-900/20 dark:text-red-400" 
                : "bg-white/50 text-gray-700 hover:bg-white/70 dark:bg-black/30 dark:text-gray-300 dark:hover:bg-black/50"
              }
            `}
          >
            <motion.div
              animate={{ scale: isLiked ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-red-600 text-red-600" : ""}`} />
            </motion.div>
            <motion.span
              key={likeCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {likeCount}
            </motion.span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReply}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/50 text-gray-700 hover:bg-white/70 dark:bg-black/30 dark:text-gray-300 dark:hover:bg-black/50 backdrop-blur-sm transition-all duration-200"
          >
            <Reply className="w-4 h-4" />
            Reply
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {replyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="backdrop-blur-xl bg-white/90 dark:bg-black/60 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20 dark:border-white/10"
            >
              <h3 className="font-semibold mb-4 text-lg text-gray-900 dark:text-gray-100">
                Replying to {comment.author || "Anonymous"}
              </h3>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full border border-white/20 dark:border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white/50 dark:bg-black/30 dark:text-gray-100 resize-none backdrop-blur-sm"
                rows={4}
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelReply}
                  className="px-4 py-2 rounded-lg bg-white/50 dark:bg-black/30 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-black/50 transition-colors backdrop-blur-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePostReply}
                  disabled={!replyContent.trim()}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                >
                  Post Reply
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visibleReplies?.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {visibleReplies.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CommentItem
                  comment={child}
                  onReply={onReply}
                  onLike={onLike}
                  onDelete={onDelete}
                  replyTo={replyTo}
                  onAddReply={onAddReply}
                  onCancelReply={onCancelReply}
                  depth={depth + 1}
                  isLast={index === visibleReplies.length - 1 && !shouldShowMoreButton}
                  user={user}
                />
              </motion.div>
            ))}

            {/* More replies button */}
            {shouldShowMoreButton && (
              <MoreRepliesButton
                hiddenCount={hiddenRepliesCount}
                onToggle={handleToggleReplies}
                isExpanded={showAllReplies}
                depth={depth + 1}
              />
            )}

            {/* Additional replies when expanded */}
            <AnimatePresence>
              {showAllReplies && comment.children && comment.children.length > INITIAL_REPLIES_LIMIT && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-2 overflow-hidden"
                >
                  {comment.children.slice(INITIAL_REPLIES_LIMIT).map((child, index) => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CommentItem
                        comment={child}
                        onReply={onReply}
                        onLike={onLike}
                        onDelete={onDelete}
                        replyTo={replyTo}
                        onAddReply={onAddReply}
                        onCancelReply={onCancelReply}
                        depth={depth + 1}
                        isLast={index === (comment.children?.slice(INITIAL_REPLIES_LIMIT).length || 0) - 1}
                        user={user}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommentItem;

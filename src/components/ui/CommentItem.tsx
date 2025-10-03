import React, { useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author?: { name: string };
  likes?: number;
  children?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, authorUsername: string) => void;
  onLike: (commentId: string) => void;
  replyTo: string | null;
  onAddReply: (parentId: string, content: string) => void;
  onCancelReply: () => void;
  depth?: number;
}

const CommentItem = ({
  comment,
  onReply,
  onLike,
  replyTo,
  onAddReply,
  onCancelReply,
  depth = 0,
}: CommentItemProps) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  return (
    <div
      className={`w-full flex flex-col gap-2 p-4 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm ${
        depth > 0 ? "ml-6 mt-3" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">
          {comment.author?.name || "Anonymous"}
        </span>
        <span className="text-xs text-gray-500">just now</span>
      </div>

      {/* Comment Content */}
      <p className="text-sm">{comment.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => onLike(comment.id)}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition text-sm"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{comment.likes ?? 0}</span>
        </button>

        <button
          onClick={() => setReplyOpen(true)}
          className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Reply
        </button>
      </div>

      {/* Reply Modal */}
      {replyOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="font-semibold mb-3 text-lg">
              Replying to {comment.author?.name || "Anonymous"}
            </h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 dark:bg-gray-800"
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setReplyContent("");
                  setReplyOpen(false);
                  onCancelReply();
                }}
                className="px-4 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onAddReply(comment.id, replyContent);
                  setReplyContent("");
                  setReplyOpen(false);
                }}
                disabled={!replyContent.trim()}
                className="px-4 py-1 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition disabled:opacity-50"
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {comment.children?.length ? (
        <div className="mt-3 space-y-3">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              onReply={onReply}
              onLike={onLike}
              replyTo={replyTo}
              onAddReply={onAddReply}
              onCancelReply={onCancelReply}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CommentItem;

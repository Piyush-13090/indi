"use client";

import Header from "@/components/layout/header";
import { getComments, postComment, likeComment, deleteComment } from "@/lib/functions";
import CommentItem from "@/components/ui/CommentItem";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";
import { Comment } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, GitBranch, Sparkles } from "lucide-react";
import { SignInButton } from '@clerk/nextjs';
// import { motion } from 'framer-motion';

export default function Home() {
  const [comments, setComments] = useState<Comment[]>([]);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const fetchComments = async () => {
      const data = await getComments();
      if (data) setComments(data);
    };
    fetchComments();
  }, []);
  const handleLike = async (commentId: string) => {
    if (!isLoaded || !isSignedIn || !user) return;
    
    const result = await likeComment(commentId, user.id);
    if (result.success) {
      setComments((prev) =>
        prev.map((comment) => {
          const updateComment = (c: Comment): Comment => {
            if (c.id.toString() === commentId) {
              return { ...c, likes: result.data.likes };
            }
            if (c.children) {
              return { ...c, children: c.children.map(updateComment) };
            }
            return c;
          };
          return updateComment(comment);
        })
      );
    }
    return result;
  };

  const handleAddReply = async (parentId: string, content: string) => {
    if (!isLoaded || !isSignedIn || !user) return;

    const submission = await postComment({
      user: { id: user.id, fullName: user.fullName ?? "Anonymous" },
      content,
      parentId: parseInt(parentId),
    });

    if (submission.success) {
      setComments((prev) =>
        prev.map((comment) => {
          const addReplyToComment = (c: Comment): Comment => {
            if (c.id.toString() === parentId) {
              return { 
                ...c, 
                children: [...(c.children || []), submission.comment] 
              };
            }
            if (c.children) {
              return { 
                ...c, 
                children: c.children.map(addReplyToComment) 
              };
            }
            return c;
          };
          return addReplyToComment(comment);
        })
      );
    }
  };

  const handleCancelReply = () => {
    console.log("Reply canceled");
  };

  const handleCommentAdded = async () => {
    const data = await getComments();
    if (data) setComments(data);
  };

  const handleDelete = async (commentId: string) => {
    if (!isLoaded || !isSignedIn || !user) return;
    
    const result = await deleteComment(commentId, user.id);
    if (result.success) {
      setComments((prev) => {
        const removeComment = (comments: Comment[]): Comment[] => {
          return comments.filter(comment => {
            if (comment.id.toString() === commentId) {
              return false;
            }
            if (comment.children) {
              comment.children = removeComment(comment.children);
            }
            return true;
          });
        };
        return removeComment(prev);
      });
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <Header />
        
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50" />
          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Join the
                <span className="block bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                  Conversation
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Share your thoughts, engage with the community, and be part of meaningful discussions.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >

                <SignInButton mode="redirect">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gray-800 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                  >
                    Get Started
                  </motion.button>
                </SignInButton>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/70 dark:bg-black/40 text-gray-800 dark:text-gray-200 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 dark:border-white/10"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Experience the future of community engagement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Discussions",
                description: "Engage in live conversations with instant updates and smooth animations.",
                icon: MessageCircle
              },
              {
                title: "Nested Conversations",
                description: "Follow thread-like discussions with beautiful visual connections.",
                icon: GitBranch
              },
              {
                title: "Modern Design",
                description: "Enjoy a premium glassmorphism UI with smooth interactions.",
                icon: Sparkles
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="backdrop-blur-xl bg-white/70 dark:bg-black/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-white/10"
              >
                <div className="mb-4">
                  <feature.icon className="w-12 h-12 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <Header />
      <AIInputWithLoading onCommentAdded={handleCommentAdded} />
      
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Community Discussion
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join the conversation and share your thoughts
          </p>
        </motion.div>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="space-y-6"
          >
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <CommentItem
                  comment={comment}
                  onReply={() => {}}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  replyTo={null}
                  onAddReply={handleAddReply}
                  onCancelReply={handleCancelReply}
                  depth={0}
                  isLast={index === comments.length - 1}
                  user={user ? { id: user.id, name: user.fullName ?? "Anonymous" } : null}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {comments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-500 text-lg">
              No comments yet. Be the first to start the conversation!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

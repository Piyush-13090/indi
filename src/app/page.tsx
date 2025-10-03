"use client"
import Header from "@/components/layout/header";
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";
import CommentItem from "@/components/ui/CommentItem";


const dummyComments = [
  {
    id: "1",
    content: "This is a great post!",
  },
  {
    id: "2",
    content: "I totally agree with you.",
  },
]
export default function Home() {
  return (
   <div>
    <Header />
    <AIInputWithLoading />
    <div className="space-y-4 w-full min-h-[70vh] px-20 py-10 flex items-center justify-start flex-col">
        {
          dummyComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={()=>{}} onLike={()=>{}} replyTo={null} onAddReply={()=>{}} onCancelReply={()=>{}} />
          ))
        }
      </div>
   </div>
  );
}

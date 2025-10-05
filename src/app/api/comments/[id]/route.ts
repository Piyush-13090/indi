import { NextRequest } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await req.json();
    const { id } = await params;
    const commentId = parseInt(id);

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    if (isNaN(commentId)) {
      return new Response("Invalid comment ID", { status: 400 });
    }

    // Check if the comment exists and if the user is the author
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, children: { select: { id: true } } }
    });

    if (!comment) {
      return new Response("Comment not found", { status: 404 });
    }

    if (comment.authorId !== userId) {
      return new Response("Unauthorized: You can only delete your own comments", { status: 403 });
    }

    // Delete the comment and all its children (cascade delete)
    await prisma.comment.delete({
      where: { id: commentId }
    });

    return new Response(
      JSON.stringify({ success: true, message: "Comment deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting comment:", err);
    return new Response("Failed to delete comment", { status: 500 });
  }
}

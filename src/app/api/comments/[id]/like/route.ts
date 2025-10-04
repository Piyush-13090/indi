import { NextRequest } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await req.json();
    const commentId = parseInt(params.id);

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    if (isNaN(commentId)) {
      return new Response("Invalid comment ID", { status: 400 });
    }

    // Check if user has already liked this comment
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingLike) {
      // Unlike: remove the like and decrement count
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      await prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          action: "unliked", 
          likes: await getUpdatedLikesCount(commentId) 
        }),
        { status: 200 }
      );
    } else {
      // Like: add the like and increment count
      await prisma.like.create({
        data: {
          userId,
          commentId,
        },
      });

      await prisma.comment.update({
        where: { id: commentId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          action: "liked", 
          likes: await getUpdatedLikesCount(commentId) 
        }),
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("Error liking/unliking comment:", err);
    return new Response("Failed to like/unlike comment", { status: 500 });
  }
}

async function getUpdatedLikesCount(commentId: number): Promise<number> {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { likes: true },
  });
  return comment?.likes || 0;
}

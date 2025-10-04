import { NextRequest } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        parentId: null, // Only top-level comments
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true, // Support up to 3 levels of nesting
              },
            },
          },
        },
      },
      orderBy: { timestamp: "desc" },
    });
    console.log("Fetched comments:", comments);
    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (err) {
    console.error("Error fetching comments:", err);
    return new Response("Failed to fetch comments", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, authorId, parentId,author } = await req.json();

    if (!text || !authorId) {
      return new Response("Text and authorId are required", { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        authorId,
        parentId,
        author
      },
    });

    console.log("✅ New comment created:", newComment);
    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (err) {
    console.error("Error posting comment:", err);
    return new Response("Failed to post comment", { status: 500 });
  }
}

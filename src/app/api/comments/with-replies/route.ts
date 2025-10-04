import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all top-level comments (parentId is null) with their nested replies
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

    console.log("Fetched comments with replies:", comments);
    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (err) {
    console.error("Error fetching comments with replies:", err);
    return new Response("Failed to fetch comments with replies", { status: 500 });
  }
}

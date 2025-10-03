import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req:NextRequest){
    try{
        const comment = await prisma.comment.findMany({})
        return new Response(JSON.stringify(comment), {status: 200});
    }catch(err){
        return new Response("Failed to fetch comments", {status: 500});
    }
}

export async funtion Post(req:NextRequest){
    try{
        const {content, authorId, parentId} = await req.json();
        if(!content || !authorId){
            return new Response("Content and AuthorId are required", {status: 400});
        }
        const newComment = await prisma.comment.create({
            data: {
                content,
                authorId,
                parentId
            }
        });
        return new Response(JSON.stringify(newComment), {status: 201});
    }catch(err){
        return new Response("Failed to post comment", {status: 500});
    }
}
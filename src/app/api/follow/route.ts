import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dislikePost, likePost } from "@/service/posts";
import { follow, unfollow } from "@/service/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
        return new Response("Authentication is required", { status: 401 });
    }

    const { id: targetId, follow: isFollow } = await req.json();

    if (!targetId || follow === undefined) {
        return new Response("Bad request", { status: 400 });
    }

    const request = isFollow ? follow : unfollow;

    return request(user.id, targetId)
        .then(res => NextResponse.json(res))
        .catch(error => new Response(JSON.stringify(error), { status: 500 }))
}
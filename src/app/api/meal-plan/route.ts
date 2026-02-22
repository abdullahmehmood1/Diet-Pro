import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { content } = await req.json();

        if (!content) {
            return new NextResponse("Missing content", { status: 400 });
        }

        const mealPlan = await prisma.mealPlan.create({
            data: {
                content,
                userId: session.user.id,
            },
        });

        return NextResponse.json(mealPlan);
    } catch (error) {
        console.error("MEAL_PLAN_POST", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

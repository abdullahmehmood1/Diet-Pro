import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const foodLogSchema = z.object({
    name: z.string().min(1),
    calories: z.number().int().positive(),
    protein: z.number().int().nonnegative().optional(),
    carbs: z.number().int().nonnegative().optional(),
    fats: z.number().int().nonnegative().optional(),
});

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const logs = await prisma.foodLog.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                loggedAt: 'desc',
            },
        });
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching logs" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const data = foodLogSchema.parse(body);

        const log = await prisma.foodLog.create({
            data: {
                ...data,
                userId: session.user.id,
            },
        });

        return NextResponse.json(log, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating log", error }, { status: 500 });
    }
}

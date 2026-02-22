import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysLogs = await prisma.foodLog.findMany({
            where: {
                userId: session.user.id,
                loggedAt: {
                    gte: today
                }
            },
        });

        const totalCalories = todaysLogs.reduce((acc: number, log) => acc + log.calories, 0);
        const totalProtein = todaysLogs.reduce((acc: number, log) => acc + (log.protein || 0), 0);

        // Get recent 5 logs
        const recentLogs = await prisma.foodLog.findMany({
            where: { userId: session.user.id },
            take: 5,
            orderBy: { loggedAt: 'desc' }
        });

        return NextResponse.json({
            calories: totalCalories,
            protein: totalProtein,
            recentLogs: recentLogs
        });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching stats", error }, { status: 500 });
    }
}

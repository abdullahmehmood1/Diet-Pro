import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verify ownership
        const log = await prisma.foodLog.findUnique({
            where: { id: params.id },
        });

        if (!log) {
            return NextResponse.json({ message: "Log not found" }, { status: 404 });
        }

        if (log.userId !== session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        await prisma.foodLog.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting log" }, { status: 500 });
    }
}

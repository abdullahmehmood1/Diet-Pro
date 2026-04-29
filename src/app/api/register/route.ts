import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, password } = userSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 409 })
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("REGISTER ERROR: ", error);
        if (error instanceof z.ZodError) {
            const err = error as any;
            return NextResponse.json({ user: null, message: err.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ 
            user: null, 
            message: error instanceof Error ? error.message : "Something went wrong",
            details: error
        }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, password } = body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash: hashedPassword,
                role: "student",
            },
        });

        const { passwordHash, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: userWithoutPassword
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Error creating user" },
            { status: 500 }
        );
    }
}
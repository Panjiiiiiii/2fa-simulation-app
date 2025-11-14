"use server";

import prisma from "@/lib/prisma";
import { Resend } from "resend";
import bcrypt from "bcrypt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerUser(formData: FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if(!username || !email || !password) {
        return {error: "All fields are required."};
    }

    const existingUser = await prisma.
}
"use server";

import prisma from "@/lib/prisma";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import { render } from "@react-email/render";
import OtpEmail from "@/emails/OtpEmail";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  if (!email || !password || !username) {
    return { error: "All fields are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: "User registered successfully!",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration" };
  }
}

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  if (!username || !password) {
    return { error: "All fields are required" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid password" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpires,
      },
    });

    const emailHtml = await render(React.createElement(OtpEmail, { otp }));

    await resend.emails.send({
      from: "Auth System <noreply@yourdomain.com>",
      to: user.email,
      subject: "Your OTP Code",
      html: emailHtml,
    });

    return { success: "OTP sent to your email", userId: user.id };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong during login" };
  }
}

export async function verifyOtp(formData: FormData) {
  const userId = formData.get("userId") as string;
  const otp = formData.get("otp") as string;
  if (!userId || !otp) {
    return { error: "All fields are required" };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || user.otp !== otp) {
      return { error: "Invalid OTP" };
    }
    if (user.otpExpires < new Date()) {
      return { error: "OTP has expired" };
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpires: null,
      },
    });
    return { success: "OTP verified successfully" };
  } catch (error) {
    console.error("OTP verification error:", error);
    return { error: "Something went wrong during OTP verification" };
  }
}

export async function changePassword(formData: FormData) {
  const userId = formData.get("userId") as string;
  const newPassword = formData.get("newPassword") as string;
  if (!userId || !newPassword) {
    return { error: "All fields are required" };
  }
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
    return { success: "Password changed successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Fail to change password" };
  }
}

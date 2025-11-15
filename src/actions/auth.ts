"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail, createOtpEmailTemplate } from "@/lib/azureEmail";

export async function registerUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!email || !username || !password) {
      return { error: "All fields are required" };
    }

    const exists = await prisma.user.findFirst({ where: { email } });
    if (exists) {
      return { error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        otp,
        otpExpires,
      },
    });

    const htmlTemplate = createOtpEmailTemplate(otp);

    const emailResult = await sendEmail({
      to: email,
      subject: "Your Registration OTP Code",
      htmlContent: htmlTemplate,
    });
    console.log('Email sent:', emailResult);
    return { userId: user.id, email: user.email };
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

    const htmlTemplate = createOtpEmailTemplate(otp);

    await sendEmail({
      to: user.email,
      subject: "Your Login OTP Code",
      htmlContent: htmlTemplate,
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
    console.log('Verifying OTP for userId:', userId);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return { error: "User not found" };
    }

    console.log('User OTP:', user.otp);
    console.log('Input OTP:', otp);

    if (!user.otp || !user.otpExpires) {
      return { error: "No OTP found for this user" };
    }

    if (user.otp !== otp) {
      return { error: "Incorrect OTP" };
    }

    if (user.otpExpires < new Date()) {
      return { error: "OTP expired" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { otp: null, otpExpires: null, verified: true },
    });

    return { success: "OTP verified!" };
  } catch (error) {
    console.error("OTP verification error:", error);
    return { error: "Something went wrong during OTP verification" };
  }
}

export async function sendPasswordResetOtp(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return { error: "No account found with this email address" };
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

    const htmlTemplate = createOtpEmailTemplate(otp);

    await sendEmail({
      to: email,
      subject: "Password Reset OTP Code",
      htmlContent: htmlTemplate,
    });

    return { success: "Reset code sent to your email", userId: user.id };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "Something went wrong. Please try again." };
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

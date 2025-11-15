"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "@/actions/auth";
import Link from "next/link";
import { log } from "console";

function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState("");
  const otpType = searchParams.get("type"); // 'register' or 'login'

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState("user@example.com");

  // Get user data from localStorage based on flow type
  useEffect(() => {
    if (otpType === "register") {
      const pendingData = localStorage.getItem("pendingRegistration");
      if (pendingData) {
        const userData = JSON.parse(pendingData);
        setUserEmail(userData.email);
        setUserId(userData.userId); // Fix: use userId instead of id
        console.log('Register flow - userId:', userData.userId, 'email:', userData.email);
      }
    } else if (otpType === "login") {
      const pendingData = localStorage.getItem("pendingLogin");
      if (pendingData) {
        const userData = JSON.parse(pendingData);
        setUserEmail(userData.email);
        setUserId(userData.userId); // Fix: add userId for login flow too
        console.log('Login flow - userId:', userData.userId, 'email:', userData.email);
      }
    }
  }, [otpType]);

  // Refs for OTP inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(""); // Clear error when user types

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      setError("");
      inputRefs.current[5]?.focus();
    }
  };

  // Submit OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("otp", otpString);

    const result = await verifyOtp(formData);

    console.log(result);
    

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    // ---- REGISTER FLOW ----
    if (otpType === "register") {
      localStorage.removeItem("pendingRegistration");
      // Store user info untuk dashboard
      localStorage.setItem('userSession', JSON.stringify({
        userId: userId,
        email: userEmail,
        isNewUser: true
      }));
      setSuccess("Registration successful! Account created. Redirecting...");
      setTimeout(() => router.push("/dashboard?welcome=true"), 1500);
    }

    // ---- LOGIN FLOW ----
    if (otpType === "login") {
      localStorage.removeItem("pendingLogin");
      // Store user session untuk dashboard
      localStorage.setItem('userSession', JSON.stringify({
        userId: userId,
        email: userEmail,
        isNewUser: false
      }));
      setSuccess("Verification successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    }

    setIsLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setSuccess("");

    // TODO: Integrate with resend OTP action later
    console.log(`Resending OTP for ${otpType} flow to:`, userEmail);

    // Simulate API call
    setTimeout(() => {
      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setIsResending(false);
      setSuccess(`New OTP sent to ${userEmail}!`);

      // Clear the success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  // Clear OTP
  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess("");
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {otpType === "register"
                ? "Complete Registration"
                : "Verify Your Email"}
            </h1>
            <p className="text-gray-600 mb-2">We've sent a 6-digit code to</p>
            <p className="text-blue-600 font-medium">{userEmail}</p>
            <p className="text-sm text-gray-500 mt-2">
              {otpType === "register"
                ? "Enter the code to complete your registration"
                : "Enter the code below to continue"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-digit code
              </label>
              <div
                className="flex justify-center space-x-3"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 text-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 outline-none"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Timer and Resend */}
            <div className="text-center">
              {!canResend ? (
                <p className="text-sm text-gray-600">
                  Code expires in{" "}
                  <span className="font-bold text-blue-600">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Code expired?</p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    {isResending ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Sending...
                      </span>
                    ) : (
                      "Resend Code"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </button>

              {/* Clear Button */}
              <button
                type="button"
                onClick={clearOtp}
                disabled={isLoading}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Security tip:</strong> Never share this code with
                  anyone. We will never ask for your code over the phone or
                  email.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={() => console.log("Check spam folder")}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Check your spam folder
              </button>
            </p>
            <Link
              href="/login"
              className="block text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    }>
      <OTPForm />
    </Suspense>
  );
}

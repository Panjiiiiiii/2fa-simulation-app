"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  bgColor: string;
  criteria: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    symbol: boolean;
  };
}

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Sangat Lemah",
    color: "text-red-600",
    bgColor: "bg-red-200",
    criteria: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false,
    },
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const metCriteria = Object.values(criteria).filter(Boolean).length;
    
    let score = 0;
    let label = "Sangat Lemah";
    let color = "text-red-600";
    let bgColor = "bg-red-200";

    if (metCriteria === 0) {
      score = 0;
      label = "Sangat Lemah";
      color = "text-red-600";
      bgColor = "bg-red-200";
    } else if (metCriteria <= 2) {
      score = 25;
      label = "Lemah";
      color = "text-red-500";
      bgColor = "bg-red-300";
    } else if (metCriteria === 3) {
      score = 50;
      label = "Sedang";
      color = "text-yellow-600";
      bgColor = "bg-yellow-300";
    } else if (metCriteria === 4) {
      score = 75;
      label = "Kuat";
      color = "text-blue-600";
      bgColor = "bg-blue-300";
    } else {
      score = 100;
      label = "Sangat Kuat";
      color = "text-green-600";
      bgColor = "bg-green-300";
    }

    return { score, label, color, bgColor, criteria };
  };

  useEffect(() => {
    if (formData.newPassword) {
      setPasswordStrength(calculatePasswordStrength(formData.newPassword));
    } else {
      setPasswordStrength({
        score: 0,
        label: "Sangat Lemah",
        color: "text-red-600",
        bgColor: "bg-red-200",
        criteria: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          symbol: false,
        },
      });
    }
  }, [formData.newPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi password confirmation
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    // Validasi kekuatan password minimal sedang
    if (passwordStrength.score < 50) {
      alert("Password terlalu lemah! Minimal harus memiliki kekuatan 'Sedang'.");
      return;
    }

    setIsLoading(true);
    
    // TODO: Integrate with auth action later
    console.log("Change password data:", {
      newPassword: formData.newPassword,
    });
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      alert("Password berhasil diubah!");
      // Reset form
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
    }, 1500);
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const EyeIcon = ({ show }: { show: boolean }) => (
    show ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.758 7.758M12 12l2.122-2.122m0 0L16.242 16.242M12 12l4.243-4.243m0 0L19.5 4.5M4.5 19.5l15-15" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Change Password
            </h1>
            <p className="text-gray-600">
              Create a new secure password for your account
            </p>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label 
                htmlFor="newPassword" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon show={showNewPassword} />
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Password Strength:
                    </span>
                    <span className={`text-sm font-medium ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    ></div>
                  </div>

                  {/* Criteria List */}
                  <div className="space-y-1">
                    <div className={`flex items-center text-xs ${passwordStrength.criteria.length ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Minimal 8 karakter
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.criteria.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Huruf besar (A-Z)
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.criteria.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Huruf kecil (a-z)
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.criteria.number ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Angka (0-9)
                    </div>
                    <div className={`flex items-center text-xs ${passwordStrength.criteria.symbol ? 'text-green-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Simbol khusus (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 text-gray-700 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 outline-none ${
                    formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon show={showConfirmPassword} />
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Password tidak cocok</p>
              )}
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && formData.newPassword && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Password cocok
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || passwordStrength.score < 50 || formData.newPassword !== formData.confirmPassword}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Changing password...
                </div>
              ) : (
                "Change Password"
              )}
            </button>

            {/* Security Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Security Tips:</strong> Use a strong password with a mix of letters, numbers, and symbols. 
                    Avoid using personal information or common words.
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Back to Dashboard Link */}
          <div className="mt-8 text-center">
            <Link 
              href="/login" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function DashboardMain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [user, setUser] = useState({
    username: "User",
    email: "user@example.com",
    joinDate: ""
  });
  const [isClient, setIsClient] = useState(false);

  // Load user data from session
  useEffect(() => {
    setIsClient(true);
    const sessionData = localStorage.getItem('userSession');
    const welcome = searchParams.get('welcome');
    const currentDate = new Date().toLocaleDateString();
    
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      setUser({
        username: userData.email.split('@')[0],
        email: userData.email,
        joinDate: currentDate
      });
      setIsNewUser(userData.isNewUser);
    } else {
      setUser(prev => ({
        ...prev,
        joinDate: currentDate
      }));
    }
    
    if (welcome === 'true') {
      setShowWelcome(true);
      // Clear welcome message after 10 seconds
      setTimeout(() => setShowWelcome(false), 10000);
    }
  }, [searchParams]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Clear user session
    localStorage.removeItem('userSession');
    localStorage.removeItem('pendingRegistration');
    localStorage.removeItem('pendingLogin');
    
    setTimeout(() => {
      setIsLoggingOut(false);
      router.push('/login?logout=true');
    }, 1000);
  };

  const quickActions = [
    {
      title: "Change Password",
      description: "Update your account password",
      icon: "🔐",
      href: "/change-password",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      title: "Account Settings",
      description: "Manage your account preferences",
      icon: "⚙️",
      href: "/settings",
      color: "bg-gray-50 border-gray-200 text-gray-800"
    },
    {
      title: "Security Log",
      description: "View recent security activities",
      icon: "📊",
      href: "/security-log",
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      title: "Two-Factor Auth",
      description: "Manage 2FA settings",
      icon: "🛡️",
      href: "/2fa-settings",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  🔐 2FA Simulation
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging out...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isNewUser ? '🎉 Account Created Successfully!' : 'Welcome Back!'} 🎉
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {isNewUser 
                ? 'Your account has been created and verified with 2-factor authentication.' 
                : 'You have successfully logged in with 2-factor authentication.'}
            </p>
            
            {showWelcome && isNewUser && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg p-6 mb-6 animate-pulse">
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-bold">🎊 Welcome to the community! 🎊</h3>
                </div>
                <p className="text-center mt-2 font-medium">
                  Your journey with secure 2FA authentication starts now!
                </p>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800 font-medium">
                  Your account is secure with 2FA protection
                </p>
              </div>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">👤</div>
                  <h3 className="font-semibold text-blue-800">Username</h3>
                  <p className="text-blue-600">{user.username}</p>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">📧</div>
                  <h3 className="font-semibold text-purple-800">Email</h3>
                  <p className="text-purple-600">{user.email}</p>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <h3 className="font-semibold text-green-800">Member Since</h3>
                  <p className="text-green-600">{isClient ? user.joinDate : "Loading..."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.color} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 block`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{action.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                  <p className="text-sm opacity-80">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Security Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-green-800">2FA Enabled</h3>
                <p className="text-green-600 text-sm">Your account is protected with two-factor authentication</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-blue-800">Secure Session</h3>
                <p className="text-blue-600 text-sm">Your login session is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-white rounded-xl shadow-lg">
          <p className="text-gray-600">
            Thank you for using our secure 2FA simulation system! 🔒
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This demo showcases modern authentication flows and security practices.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <DashboardMain />
    </Suspense>
  );
}
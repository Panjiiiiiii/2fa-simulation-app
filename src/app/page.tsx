import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <div className="text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔐 2FA Simulation
            </h1>
            <p className="text-gray-600 text-lg">
              Secure authentication with two-factor verification
            </p>
          </div>

          <div className="space-y-4">
            <Link 
              href="/login"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Sign In
            </Link>
            
            <Link 
              href="/register"
              className="block w-full bg-white text-blue-600 py-3 px-6 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Experience secure login with OTP verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

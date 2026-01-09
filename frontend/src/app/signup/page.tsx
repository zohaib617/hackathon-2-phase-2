"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthProvider";
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, name);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#09090b] p-6">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-[460px]"
      >
        <div className="mb-8 text-center">
          <motion.div 
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <UserPlus className="h-7 w-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create your account
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Start managing your tasks like a pro
          </p>
        </div>

        <Card className="border-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-800">
          <CardHeader className="pt-8 pb-4">
            <CardTitle className="text-center text-lg font-medium text-gray-700 dark:text-gray-300">
              Account Details
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="px-8 space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  {error}
                </motion.div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <div className="relative group">
                  <User className="absolute left-3 top-[38px] h-4.5 w-4.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                  <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    className="pl-10 h-12 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <div className="relative group">
                  <Mail className="absolute left-3 top-[38px] h-4.5 w-4.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-12 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Passwords Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <Lock className="absolute left-3 top-[38px] h-4.5 w-4.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3 top-[38px] h-4.5 w-4.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                  <Input
                    label="Confirm"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-5 px-8 pt-6 pb-10">
              <Button
                type="submit"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create Account <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600 tracking-wide uppercase">
          Secure Cloud Encryption Active
        </p>
      </motion.div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthProvider";
import { Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#09090b] p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-[420px]"
      >
        <div className="mb-8 text-center">
          <motion.div 
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-4"
            whileHover={{ rotate: 5, scale: 1.05 }}
          >
            <CheckCircle2 className="h-7 w-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your credentials to access your tasks
          </p>
        </div>

        <Card className="border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl shadow-gray-200/50 dark:shadow-none ring-1 ring-gray-200 dark:ring-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Account Login
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <Input
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 h-11 bg-white/50 dark:bg-gray-950/50 border-gray-200 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-11 bg-white/50 dark:bg-gray-950/50 border-gray-200 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-indigo-500 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                </div>
                <div className="flex justify-end">
                  <Link href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pb-8">
              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                New here?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-gray-900 dark:text-white hover:underline underline-offset-4"
                >
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <footer className="mt-8 text-center text-xs text-gray-400">
          © 2026 TodoApp Pro. Secure & Encrypted.
        </footer>
      </motion.div>
    </div>
  );
}
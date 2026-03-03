"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { authApi } from "@/lib/api";
import { Scale, Mail, Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { language, setAuth } = useAppStore();
  const isHi = language === "hi";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = mode === "login"
        ? await authApi.login({ email, password })
        : await authApi.register({ name, email, password });
      setAuth(res.data.token, res.data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Scale className="w-12 h-12 text-navy-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "login"
              ? (isHi ? "लॉगिन करें" : "Welcome Back")
              : (isHi ? "खाता बनाएं" : "Create Account")}
          </h1>
          <p className="text-gray-500 mt-1">
            {isHi ? "न्यायसेतु में आपका स्वागत है" : "Sign in to NyayaSetu"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isHi ? "नाम" : "Name"}</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10" placeholder={isHi ? "आपका नाम" : "Your name"} required />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isHi ? "ईमेल" : "Email"}</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10" placeholder="you@example.com" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isHi ? "पासवर्ड" : "Password"}</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10" placeholder="••••••••" required minLength={6} />
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === "login" ? (isHi ? "लॉगिन" : "Login") : (isHi ? "रजिस्टर" : "Register")}
          </button>

          <p className="text-center text-sm text-gray-500">
            {mode === "login" ? (isHi ? "खाता नहीं है?" : "Don't have an account?") : (isHi ? "पहले से खाता है?" : "Already have an account?")}
            {" "}
            <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-navy-500 font-medium hover:underline">
              {mode === "login" ? (isHi ? "रजिस्टर करें" : "Register") : (isHi ? "लॉगिन करें" : "Login")}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

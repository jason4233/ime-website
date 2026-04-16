"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("帳號或密碼錯誤");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-night flex items-center justify-center px-4 noise-overlay">
      {/* 裝飾 */}
      <div className="absolute top-0 left-[30%] w-px h-[35vh] bg-gradient-to-b from-gold/15 to-transparent" />
      <div className="absolute bottom-0 right-[25%] w-px h-[20vh] bg-gradient-to-t from-gold/10 to-transparent" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-elegant text-4xl font-semibold text-ivory tracking-[0.06em]">
            I <span className="text-gold">ME</span>
          </h1>
          <p className="font-elegant italic text-sm text-ivory/30 mt-2 tracking-[0.1em]">
            Administration
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-overline text-ivory/40 uppercase mb-2 font-body">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-ivory/5 border border-ivory/10 rounded-brand
                         text-ivory font-body text-sm placeholder:text-ivory/20
                         focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30
                         transition-all duration-300"
              placeholder="admin@ime-beauty.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-overline text-ivory/40 uppercase mb-2 font-body">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-ivory/5 border border-ivory/10 rounded-brand
                         text-ivory font-body text-sm placeholder:text-ivory/20
                         focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30
                         transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-rose-nude text-caption text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "登入中..." : "登入後台"}
          </button>
        </form>

        <p className="text-center text-ivory/15 text-caption mt-8 font-body">
          &copy; {new Date().getFullYear()} I ME. All rights reserved.
        </p>
      </div>
    </div>
  );
}

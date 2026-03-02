"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Email ou senha incorretos 💔");
      } else {
        router.push("/");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["💕", "🌷", "💗", "✨", "🌸", "💝", "🌹", "💖"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl select-none"
            style={{
              left: `${10 + (i * 12) % 90}%`,
              top: `${5 + (i * 15) % 85}%`,
            }}
            animate={{
              y: [-10, 10],
              rotate: [-5, 5],
              opacity: [0.2, 0.4],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3 + i * 0.5,
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="glass-card rounded-3xl p-8 shadow-xl soft-shadow text-center">
          {/* Header */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-6xl mb-4"
          >
            🌷
          </motion.div>
          <h1 className="font-playfair text-3xl font-bold gradient-text mb-1">
            Isabella & Mateus
          </h1>
          <p className="text-pink-400 text-sm font-nunito mb-8">
            Nosso cantinho especial 💕
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-pink-500 mb-1 font-nunito">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-200 bg-white/80 px-4 py-3 text-pink-800 placeholder-pink-300 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-nunito"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-500 mb-1 font-nunito">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-pink-200 bg-white/80 px-4 py-3 text-pink-800 placeholder-pink-300 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-nunito"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center font-nunito"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 py-3 text-white font-semibold font-nunito hover:from-pink-500 hover:to-rose-500 transition-all disabled:opacity-60 shadow-md hover:shadow-lg active:scale-95"
            >
              {loading ? "Entrando..." : "Entrar com amor 💗"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

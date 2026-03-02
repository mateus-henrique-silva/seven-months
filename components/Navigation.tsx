"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Nossa História", emoji: "💕" },
  { href: "/galeria", label: "Galeria", emoji: "📸" },
  { href: "/mensagens", label: "Mensagens", emoji: "💌" },
  { href: "/disney", label: "Disney", emoji: "✨" },
];

export default function Navigation({
  userName,
}: {
  userName: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌷</span>
            <span className="font-playfair text-xl font-bold text-pink-600 hidden sm:block">
              Isabella & Mateus
            </span>
            <span className="font-playfair text-xl font-bold text-pink-600 sm:hidden">
              I & M
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-sm font-nunito font-medium transition-colors ${
                  pathname === link.href
                    ? "text-pink-600 bg-pink-50"
                    : "text-pink-400 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                <span className="mr-1">{link.emoji}</span>
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-full bg-pink-50 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-pink-400 font-nunito hidden sm:block">
              Olá, <span className="font-semibold text-pink-600">{userName}</span> 💗
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs text-pink-300 hover:text-pink-500 transition-colors font-nunito border border-pink-200 rounded-full px-3 py-1 hover:border-pink-400"
            >
              Sair
            </button>
            {/* Mobile menu button */}
            <button
              className="md:hidden text-pink-400 hover:text-pink-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-pink-100 py-3"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-nunito transition-colors ${
                      pathname === link.href
                        ? "text-pink-600 bg-pink-50 font-semibold"
                        : "text-pink-400 hover:text-pink-600 hover:bg-pink-50"
                    }`}
                  >
                    <span>{link.emoji}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

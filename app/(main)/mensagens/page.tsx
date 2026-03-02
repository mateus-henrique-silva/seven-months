"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Send, Heart, Mail, MailOpen } from "lucide-react";
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  content: string;
  isRead: boolean | null;
  scheduledDate: string | null;
  createdAt: string | null;
}

function formatDateTime(str: string | null): string {
  if (!str) return "";
  const date = new Date(str);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MensagensPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const myEmail = session?.user?.email ?? "";
  const myName = session?.user?.name ?? "";

  const partnerEmail =
    myEmail === "magtash68@gmail.com"
      ? "bellachamon@gmail.com"
      : "magtash68@gmail.com";

  const partnerName =
    myEmail === "magtash68@gmail.com" ? "Isabella" : "Mateus";

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: number) {
    await fetch(`/api/messages/${id}`, { method: "PATCH" });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [newMsg, ...prev]);
        setContent("");
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      }
    } finally {
      setSending(false);
    }
  }

  const receivedMessages = messages.filter((m) => m.toEmail === myEmail);
  const sentMessages = messages.filter((m) => m.fromEmail === myEmail);
  const unreadCount = receivedMessages.filter((m) => !m.isRead).length;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="pt-16 pb-8 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-3">💌</div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold gradient-text mb-2">
            Mensagens
          </h1>
          <p className="text-pink-400 font-nunito">
            Palavras com amor de {myName} para {partnerName} 💕
          </p>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-3 inline-flex items-center gap-2 bg-pink-500 text-white rounded-full px-4 py-1.5 text-sm font-nunito"
            >
              <Heart size={14} fill="white" />
              {unreadCount} {unreadCount === 1 ? "mensagem nova" : "mensagens novas"}
            </motion.div>
          )}
        </motion.div>
      </section>

      <div className="max-w-2xl mx-auto px-4 space-y-8">
        {/* Send form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 soft-shadow"
        >
          <h2 className="font-playfair text-xl text-pink-600 mb-4 flex items-center gap-2">
            <Send size={18} />
            Escrever para {partnerName}
          </h2>
          <form onSubmit={sendMessage}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Escreva algo especial para ${partnerName}...`}
              rows={4}
              className="w-full rounded-xl border border-pink-200 px-4 py-3 text-pink-700 placeholder-pink-300 focus:border-pink-400 focus:outline-none font-nunito resize-none bg-white/80 transition-all"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-pink-400 font-nunito">
                {partnerName} receberá uma notificação por email 📬
              </p>
              <button
                type="submit"
                disabled={sending || !content.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl px-5 py-2.5 text-sm font-nunito font-semibold hover:from-pink-500 hover:to-rose-500 transition-all disabled:opacity-50 shadow-md"
              >
                <Send size={14} />
                {sending ? "Enviando..." : "Enviar com amor"}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center text-pink-500 font-nunito text-sm"
              >
                💌 Mensagem enviada com amor!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Received messages */}
        {receivedMessages.length > 0 && (
          <div>
            <h2 className="font-playfair text-xl text-pink-600 mb-4 flex items-center gap-2">
              <Mail size={18} />
              Mensagens recebidas de {partnerName}
            </h2>
            <div className="space-y-3">
              {receivedMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card rounded-2xl p-5 soft-shadow cursor-pointer transition-all ${
                    !msg.isRead ? "border-l-4 border-pink-400" : ""
                  }`}
                  onClick={() => !msg.isRead && markRead(msg.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{msg.isRead ? "💌" : "💝"}</span>
                      <span className="font-nunito font-semibold text-pink-600 text-sm">
                        {msg.fromName}
                      </span>
                      {!msg.isRead && (
                        <span className="bg-pink-100 text-pink-500 text-xs font-nunito rounded-full px-2 py-0.5">
                          Nova ✨
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-pink-300 font-nunito">
                      {formatDateTime(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-pink-700 font-nunito leading-relaxed">{msg.content}</p>
                  {!msg.isRead && (
                    <p className="text-xs text-pink-400 mt-2 font-nunito">
                      Clique para marcar como lida
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Sent messages */}
        {sentMessages.length > 0 && (
          <div>
            <h2 className="font-playfair text-xl text-pink-600 mb-4 flex items-center gap-2">
              <MailOpen size={18} />
              Minhas mensagens enviadas
            </h2>
            <div className="space-y-3">
              {sentMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl p-5 soft-shadow opacity-80"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💗</span>
                      <span className="font-nunito text-sm text-pink-500">
                        Para {partnerName}
                      </span>
                      {msg.isRead && (
                        <span className="text-xs text-pink-300 font-nunito">✓ lida</span>
                      )}
                    </div>
                    <span className="text-xs text-pink-300 font-nunito">
                      {formatDateTime(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-pink-600 font-nunito text-sm leading-relaxed">{msg.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-4xl inline-block"
            >
              🌷
            </motion.div>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-10 text-pink-400 font-nunito">
            <div className="text-5xl mb-3">💌</div>
            <p>Ainda sem mensagens. Seja o primeiro a escrever! 💕</p>
          </div>
        )}
      </div>
    </div>
  );
}

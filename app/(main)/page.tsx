"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plus, Trash2, Heart } from "lucide-react";
import { useSession } from "next-auth/react";

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string | null;
  emoji: string | null;
  imageUrl: string | null;
  isMonthly: boolean | null;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return `${day} de ${months[parseInt(month) - 1]} de ${year}`;
}

function countDaysTogether(): { months: number; days: number } {
  const start = new Date("2025-08-05");
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30.44);
  const days = totalDays;
  return { months, days };
}

function HeartCounter() {
  const { months, days } = countDaysTogether();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCount(days), 100);
    return () => clearTimeout(timer);
  }, [days]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-8 soft-shadow text-center max-w-md mx-auto"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-6xl mb-3"
      >
        ❤️
      </motion.div>
      <p className="font-playfair text-5xl font-bold gradient-text">
        {months} meses
      </p>
      <p className="text-pink-400 font-nunito mt-2 text-lg">
        {count} dias juntos
      </p>
      <p className="text-pink-300 font-nunito text-sm mt-1">
        desde 05 de agosto de 2025
      </p>
    </motion.div>
  );
}

function DeclarationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-3xl p-8 soft-shadow max-w-2xl mx-auto text-center relative overflow-hidden"
    >
      {/* Decorative hearts */}
      <div className="absolute top-3 left-4 text-3xl opacity-30">💕</div>
      <div className="absolute top-3 right-4 text-3xl opacity-30">💕</div>
      <div className="absolute bottom-3 left-4 text-2xl opacity-20">🌷</div>
      <div className="absolute bottom-3 right-4 text-2xl opacity-20">🌷</div>

      <p className="font-playfair text-xl text-pink-400 italic mb-4">
        — Uma declaração —
      </p>
      <blockquote className="font-playfair text-lg text-pink-800 leading-relaxed italic">
        "Sou o homem mais sortudo do mundo. Sortudo por conhecer essa mulher
        que me faz sorrir todos os dias e que é minha parceira em tudo.
        Essa mulher cristã, família, dona de um sorriso lindo, os cachos
        mais perfeitos que já vi e uma barriga chapada{" "}
        <span className="not-italic text-sm">(ela é bem magra mesmo achando que é um ponei gordo kkk)</span>.
        Nunca deixei de sentir ou nutrir sentimento por ela — a sua pureza,
        bondade e amor me fizeram me apaixonar."
      </blockquote>
      <p className="font-playfair text-2xl font-bold gradient-text mt-6">
        Eu te amo, Isabella Chamon. 💕
      </p>
      <p className="text-pink-400 font-nunito text-sm mt-2">— Mateus Henrique</p>
    </motion.div>
  );
}

function TimelineItem({
  event,
  index,
  onDelete,
  canDelete,
}: {
  event: TimelineEvent;
  index: number;
  onDelete: (id: number) => void;
  canDelete: boolean;
}) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative flex items-start gap-4 mb-12 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-row`}
    >
      {/* Desktop: spacer */}
      <div className="hidden md:block flex-1" />

      {/* Center dot */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-4 border-pink-300 flex items-center justify-center text-xl shadow-md z-10 mt-1">
        {event.emoji || "💕"}
      </div>

      {/* Card */}
      <div className={`flex-1 ${isLeft ? "md:text-left" : "md:text-right"}`}>
        <div className="glass-card rounded-2xl p-5 soft-shadow soft-shadow-hover transition-all group">
          <p className="text-xs text-pink-400 font-nunito font-medium mb-1">
            {formatDate(event.date)}
          </p>
          <h3 className="font-playfair text-xl font-semibold text-pink-700 mb-2">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-pink-600 font-nunito text-sm leading-relaxed">
              {event.description}
            </p>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity text-pink-300 hover:text-red-400 text-xs flex items-center gap-1"
            >
              <Trash2 size={12} /> remover
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: "",
    title: "",
    description: "",
    emoji: "💕",
    isMonthly: false,
  });

  const isMate = session?.user?.email === "magtash68@gmail.com";

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/timeline");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
    if (res.ok) {
      const created = await res.json();
      setEvents((prev) => [...prev, created].sort((a, b) => a.date.localeCompare(b.date)));
      setShowAddForm(false);
      setNewEvent({ date: "", title: "", description: "", emoji: "💕", isMonthly: false });
    }
  }

  async function deleteEvent(id: number) {
    if (!confirm("Remover esse momento da timeline?")) return;
    await fetch(`/api/timeline?id=${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="pt-16 pb-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-playfair text-5xl md:text-7xl font-bold gradient-text mb-3">
            Isabella & Mateus
          </h1>
          <p className="text-pink-400 font-nunito text-lg mb-10">
            Nossa linda história de amor 🌷
          </p>
        </motion.div>

        <HeartCounter />
      </section>

      {/* Declaration */}
      <section className="px-4 mb-16">
        <DeclarationCard />
      </section>

      {/* Timeline */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-playfair text-3xl font-bold text-pink-600"
          >
            Nossa Timeline 💕
          </motion.h2>
          {isMate && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-pink-500 text-white rounded-full px-4 py-2 text-sm font-nunito hover:bg-pink-600 transition-colors shadow-md"
            >
              <Plus size={16} />
              Adicionar momento
            </button>
          )}
        </div>

        {/* Add form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass-card rounded-2xl p-6 mb-10 soft-shadow"
          >
            <h3 className="font-playfair text-xl text-pink-600 mb-4">
              Novo momento na nossa história
            </h3>
            <form onSubmit={addEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-pink-500 font-nunito mb-1">Data</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                    className="w-full rounded-xl border border-pink-200 px-4 py-2 text-pink-700 focus:border-pink-400 focus:outline-none font-nunito"
                  />
                </div>
                <div>
                  <label className="block text-sm text-pink-500 font-nunito mb-1">Emoji</label>
                  <input
                    type="text"
                    value={newEvent.emoji}
                    onChange={(e) => setNewEvent({ ...newEvent, emoji: e.target.value })}
                    className="w-full rounded-xl border border-pink-200 px-4 py-2 text-pink-700 focus:border-pink-400 focus:outline-none font-nunito"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-pink-500 font-nunito mb-1">Título</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                  placeholder="Nome do momento..."
                  className="w-full rounded-xl border border-pink-200 px-4 py-2 text-pink-700 focus:border-pink-400 focus:outline-none font-nunito"
                />
              </div>
              <div>
                <label className="block text-sm text-pink-500 font-nunito mb-1">Descrição</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Conte sobre esse momento especial..."
                  rows={3}
                  className="w-full rounded-xl border border-pink-200 px-4 py-2 text-pink-700 focus:border-pink-400 focus:outline-none font-nunito resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isMonthly"
                  checked={newEvent.isMonthly}
                  onChange={(e) => setNewEvent({ ...newEvent, isMonthly: e.target.checked })}
                  className="accent-pink-500"
                />
                <label htmlFor="isMonthly" className="text-sm text-pink-500 font-nunito">
                  É um mês de aniversário
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-pink-500 text-white rounded-xl px-6 py-2 font-nunito hover:bg-pink-600 transition-colors"
                >
                  Salvar momento 💕
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="border border-pink-200 text-pink-400 rounded-xl px-6 py-2 font-nunito hover:border-pink-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-4xl inline-block"
            >
              🌷
            </motion.div>
          </div>
        ) : (
          <div className="timeline-container">
            {events.map((event, index) => (
              <TimelineItem
                key={event.id}
                event={event}
                index={index}
                onDelete={deleteEvent}
                canDelete={isMate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

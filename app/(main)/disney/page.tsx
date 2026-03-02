"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Plus, Trash2, Check, Star, MapPin, Utensils, Theater, StickyNote } from "lucide-react";
import { useSession } from "next-auth/react";

interface DisneyPlan {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  isCompleted: boolean | null;
  createdAt: string | null;
}

const CATEGORIES = [
  { value: "atracao", label: "Atração", icon: <Star size={14} />, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "restaurante", label: "Restaurante", icon: <Utensils size={14} />, color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "show", label: "Show/Espetáculo", icon: <Theater size={14} />, color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "local", label: "Local para visitar", icon: <MapPin size={14} />, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "nota", label: "Nota/Ideia", icon: <StickyNote size={14} />, color: "bg-pink-100 text-pink-700 border-pink-200" },
];

function getCategoryInfo(cat: string | null) {
  return CATEGORIES.find((c) => c.value === cat) ?? CATEGORIES[4];
}

function DisneyCard({
  plan,
  onToggle,
  onDelete,
}: {
  plan: DisneyPlan;
  onToggle: (id: number, current: boolean) => void;
  onDelete: (id: number) => void;
}) {
  const catInfo = getCategoryInfo(plan.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`glass-card rounded-2xl p-5 soft-shadow soft-shadow-hover transition-all group ${
        plan.isCompleted ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(plan.id, !!plan.isCompleted)}
            className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
              plan.isCompleted
                ? "bg-pink-400 border-pink-400 text-white"
                : "border-pink-300 hover:border-pink-400"
            }`}
          >
            {plan.isCompleted && <Check size={12} />}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`font-playfair text-lg font-semibold text-pink-700 mb-1 ${plan.isCompleted ? "line-through opacity-70" : ""}`}>
              {plan.title}
            </h3>
            {plan.description && (
              <p className="text-pink-500 font-nunito text-sm leading-relaxed mb-2">
                {plan.description}
              </p>
            )}
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-nunito ${catInfo.color}`}>
              {catInfo.icon}
              {catInfo.label}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(plan.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-pink-200 hover:text-red-400 flex-shrink-0"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function DisneyPage() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<DisneyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    category: "nota",
  });

  const completedCount = plans.filter((p) => p.isCompleted).length;
  const totalCount = plans.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  useEffect(() => {
    fetch("/api/disney")
      .then((r) => r.json())
      .then((data) => setPlans(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  async function addPlan(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/disney", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlan),
    });
    if (res.ok) {
      const created = await res.json();
      setPlans((prev) => [...prev, created]);
      setNewPlan({ title: "", description: "", category: "nota" });
      setShowForm(false);
    }
  }

  async function togglePlan(id: number, current: boolean) {
    await fetch(`/api/disney?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !current }),
    });
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isCompleted: !current } : p))
    );
  }

  async function deletePlan(id: number) {
    if (!confirm("Remover esse plano Disney?")) return;
    await fetch(`/api/disney?id=${id}`, { method: "DELETE" });
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }

  const pending = plans.filter((p) => !p.isCompleted);
  const completed = plans.filter((p) => p.isCompleted);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="pt-16 pb-8 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-6xl mb-3">✨</div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold gradient-text mb-2">
            Planos para a Disney
          </h1>
          <p className="text-pink-400 font-nunito">
            Nosso roteiro mágico juntos 🏰💕
          </p>
        </motion.div>
      </section>

      <div className="max-w-3xl mx-auto px-4">
        {/* Progress */}
        {totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-5 soft-shadow mb-6 text-center"
          >
            <p className="font-nunito text-pink-500 text-sm mb-2">
              {completedCount} de {totalCount} planos conquistados ✨
            </p>
            <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            {progress === 100 && (
              <p className="mt-2 text-pink-600 font-playfair italic">
                ✨ Sonho realizado! ✨
              </p>
            )}
          </motion.div>
        )}

        {/* Add button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-pink-500 text-white rounded-full px-5 py-2.5 text-sm font-nunito hover:bg-pink-600 transition-colors shadow-md"
          >
            <Plus size={16} />
            Adicionar plano
          </button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-2xl p-6 mb-6 soft-shadow overflow-hidden"
            >
              <h3 className="font-playfair text-xl text-pink-600 mb-4">
                Novo plano Disney ✨
              </h3>
              <form onSubmit={addPlan} className="space-y-4">
                <div>
                  <label className="block text-sm text-pink-500 font-nunito mb-1">Título</label>
                  <input
                    type="text"
                    value={newPlan.title}
                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                    required
                    placeholder="Ex: Ir na Splash Mountain..."
                    className="w-full rounded-xl border border-pink-200 px-4 py-2.5 text-pink-700 focus:border-pink-400 focus:outline-none font-nunito bg-white/80"
                  />
                </div>
                <div>
                  <label className="block text-sm text-pink-500 font-nunito mb-1">Descrição (opcional)</label>
                  <textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    placeholder="Detalhes, horários, observações..."
                    rows={2}
                    className="w-full rounded-xl border border-pink-200 px-4 py-2.5 text-pink-700 focus:border-pink-400 focus:outline-none font-nunito resize-none bg-white/80"
                  />
                </div>
                <div>
                  <label className="block text-sm text-pink-500 font-nunito mb-1">Categoria</label>
                  <select
                    value={newPlan.category}
                    onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value })}
                    className="w-full rounded-xl border border-pink-200 px-4 py-2.5 text-pink-700 focus:border-pink-400 focus:outline-none font-nunito bg-white/80"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-pink-500 text-white rounded-xl px-6 py-2.5 font-nunito hover:bg-pink-600 transition-colors shadow-md"
                  >
                    Salvar ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-pink-200 text-pink-400 rounded-xl px-6 py-2.5 font-nunito hover:border-pink-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-4xl inline-block"
            >
              ✨
            </motion.div>
          </div>
        ) : (
          <>
            {/* Pending plans */}
            {pending.length > 0 && (
              <div className="mb-8">
                <h2 className="font-playfair text-xl text-pink-600 mb-4">
                  🏰 Para fazer na Disney
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {pending.map((plan) => (
                      <DisneyCard
                        key={plan.id}
                        plan={plan}
                        onToggle={togglePlan}
                        onDelete={deletePlan}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <div>
                <h2 className="font-playfair text-xl text-pink-400 mb-4">
                  ✅ Já fizemos juntos
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {completed.map((plan) => (
                      <DisneyCard
                        key={plan.id}
                        plan={plan}
                        onToggle={togglePlan}
                        onDelete={deletePlan}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {plans.length === 0 && (
              <div className="text-center py-16 text-pink-400 font-nunito">
                <div className="text-5xl mb-4">🏰</div>
                <p>Que tal começar a planejar a aventura? ✨</p>
                <p className="text-sm mt-2">Adicione o primeiro plano!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

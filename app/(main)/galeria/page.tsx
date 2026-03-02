"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Heart } from "lucide-react";

interface GalleryPhoto {
  id: number;
  imageUrl: string;
  caption: string | null;
  date: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  return `${day} ${months[parseInt(month) - 1]} ${year}`;
}

export default function GaleriaPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setPhotos(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="pt-16 pb-8 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-3">📸</div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold gradient-text mb-2">
            Galeria do Casal
          </h1>
          <p className="text-pink-400 font-nunito">
            Cada foto, um momento especial guardado com amor 💕
          </p>
        </motion.div>
      </section>

      {/* Gallery grid */}
      <div className="max-w-6xl mx-auto px-4">
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
        ) : photos.length === 0 ? (
          <div className="text-center py-20 text-pink-400 font-nunito">
            <div className="text-5xl mb-4">🌸</div>
            <p>As fotos do casal ainda estão chegando...</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.03 }}
                className="cursor-pointer group relative overflow-hidden rounded-2xl shadow-md soft-shadow-hover transition-all aspect-square"
                onClick={() => setSelected(photo)}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption || "Foto do casal"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3">
                    {photo.caption && (
                      <p className="text-white text-sm font-nunito font-medium truncate">
                        {photo.caption}
                      </p>
                    )}
                    {photo.date && (
                      <p className="text-pink-200 text-xs font-nunito">{formatDate(photo.date)}</p>
                    )}
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-lg">💕</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={selected.imageUrl}
                  alt={selected.caption || "Foto do casal"}
                  fill
                  className="object-cover"
                  sizes="800px"
                />
              </div>
              {(selected.caption || selected.date) && (
                <div className="p-5 text-center bg-white">
                  {selected.caption && (
                    <p className="font-playfair text-xl text-pink-700 mb-1">{selected.caption}</p>
                  )}
                  {selected.date && (
                    <p className="text-pink-400 text-sm font-nunito">{formatDate(selected.date)}</p>
                  )}
                </div>
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 bg-white/90 rounded-full p-2 text-pink-500 hover:bg-white transition-colors shadow-md"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

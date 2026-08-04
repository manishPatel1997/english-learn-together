"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, MessageSquare, Trash2, RotateCw, Sparkles } from "lucide-react";
import { storage, type FavoriteItem } from "@/lib/storage";
import { useToast } from "@/components/beui/animated-toast-stack";

export function FavoritesView() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<Record<string | number, boolean>>({});

  const { toast } = useToast();

  useEffect(() => {
    setFavorites(storage.getFavorites());
  }, []);

  const toggleFlip = (id: string | number) => {
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRemove = (item: FavoriteItem) => {
    storage.toggleFavorite(item);
    setFavorites((prev) => prev.filter((f) => f.id !== item.id));
    toast({
      title: "Removed from Favorites",
      description: `"${item.gujarati}" was removed.`,
      type: "info",
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4 select-none pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> Bookmarked Collection
          </span>
          <h2 className="text-3xl font-black text-foreground tracking-tight mt-1">
            Saved Favorites & Flashcards
          </h2>
          <p className="text-xs text-muted-foreground">
            Click on any card to flip it and reveal the English translation and example context.
          </p>
        </div>

        <span className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-extrabold text-amber-600 dark:text-amber-400 self-start sm:self-auto">
          {favorites.length} Saved Items
        </span>
      </div>

      {/* Favorites Flashcards Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((item, idx) => {
            const isFlipped = !!flippedIds[item.id];

            return (
              <motion.div
                key={`fav-${item.id}-${idx}`}
                onClick={() => toggleFlip(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative min-h-[220px] rounded-[26px] border border-border bg-card p-6 shadow-md cursor-pointer flex flex-col justify-between overflow-hidden select-none hover:border-amber-500/50 transition-colors"
              >
                {!isFlipped ? (
                  /* Front Side (Gujarati) */
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-indigo-500/10 px-3 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                        {item.categoryOrTopic}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item);
                        }}
                        className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-center py-4">
                      <h3 className="text-3xl font-black text-foreground">{item.gujarati}</h3>
                      {item.phonetic && (
                        <p className="text-xs italic text-muted-foreground mt-1">"{item.phonetic}"</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground pt-2 border-t border-border/60">
                      <span className="flex items-center gap-1">
                        <RotateCw className="h-3 w-3 text-amber-500" /> Click card to flip
                      </span>
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>
                ) : (
                  /* Back Side (English Translation) */
                  <div className="flex flex-col justify-between h-full space-y-4 bg-amber-500/5 -m-6 p-6 rounded-[26px]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Revealed Translation
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item);
                        }}
                        className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-center py-2">
                      <h3 className="text-2xl font-black text-foreground">{item.english}</h3>
                      {item.example && (
                        <p className="text-xs italic text-muted-foreground mt-2 max-w-xs mx-auto">
                          "{item.example}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400 pt-2 border-t border-amber-500/20">
                      <span>Click to flip back</span>
                      <span>✓ Saved</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-amber-500/30 bg-amber-500/5 p-12 text-center space-y-3">
          <Star className="h-12 w-12 text-amber-500 mx-auto fill-amber-500" />
          <h3 className="text-2xl font-black text-foreground">No Saved Favorites</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click the star icon during vocabulary or sentence practice to bookmark words for quick flashcard review!
          </p>
        </div>
      )}
    </div>
  );
}

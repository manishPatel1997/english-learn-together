"use client";

import React, { useState, useEffect } from "react";
import { Star, Trash2, RotateCw, Sparkles } from "lucide-react";
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
    <div className="space-y-7 w-full max-w-6xl mx-auto select-none pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-white pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-[2px] border-2 border-black bg-[#FFE600] px-2.5 py-0.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#121212]">
            <Star className="h-3.5 w-3.5 fill-black stroke-[2.5]" /> Bookmarked Collection
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight mt-2">
            Saved Favorites & Flashcards
          </h2>
          <p className="text-xs font-bold text-muted-foreground">
            Click on any card to flip it and reveal the English translation and example context.
          </p>
        </div>

        <span className="rounded-[3px] border-2 border-black bg-[#FFE600] px-4 py-2 text-xs font-black uppercase text-black shadow-[3px_3px_0px_#121212] self-start sm:self-auto">
          {favorites.length} Saved Items
        </span>
      </div>

      {/* Favorites Flashcards Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {favorites.map((item, idx) => {
            const isFlipped = !!flippedIds[item.id];

            return (
              <div
                key={`fav-${item.id}-${idx}`}
                onClick={() => toggleFlip(item.id)}
                className="relative min-h-[220px] rounded-[4px] border-[2.5px] border-black dark:border-white bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-[3px_3px_0px_#121212] sm:shadow-[5px_5px_0px_#121212] dark:shadow-[3px_3px_0px_#ffffff] sm:dark:shadow-[5px_5px_0px_#ffffff] cursor-pointer flex flex-col justify-between overflow-hidden select-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#121212] dark:hover:shadow-[6px_6px_0px_#ffffff] transition-all"
              >
                {!isFlipped ? (
                  /* Front Side (Gujarati) */
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-[2px] border border-black bg-[#FFE600] px-2 py-0.2 text-[9px] font-black uppercase text-black shadow-[1px_1px_0px_#121212]">
                        {item.categoryOrTopic}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item);
                        }}
                        className="flex h-9 w-9 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-[3px] border-2 border-black bg-white text-black hover:bg-[#FF4D4D] hover:text-white transition-colors shadow-[1.5px_1.5px_0px_#121212] cursor-pointer"
                        aria-label="Remove from favorites"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>

                    <div className="text-center py-4">
                      <h3 className="text-3xl font-black text-foreground">{item.gujarati}</h3>
                      {item.phonetic && (
                        <p className="text-xs italic font-bold text-muted-foreground mt-1">"{item.phonetic}"</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-black uppercase text-muted-foreground pt-2 border-t-2 border-black/10 dark:border-white/10">
                      <span className="flex items-center gap-1 text-black dark:text-white">
                        <RotateCw className="h-3 w-3 stroke-[3]" /> Click to flip
                      </span>
                      <span>{item.type}</span>
                    </div>
                  </div>
                ) : (
                  /* Back Side (English Translation) */
                  <div className="flex flex-col justify-between h-full space-y-4 bg-[#FFE600] text-black -m-6 p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 stroke-[3]" /> Revealed English
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item);
                        }}
                        className="rounded-[2px] border border-black bg-white text-black hover:bg-[#FF4D4D] hover:text-white p-1 transition-colors shadow-[1px_1px_0px_#000] cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    <div className="text-center py-2">
                      <h3 className="text-2xl font-black text-black">{item.english}</h3>
                      {item.example && (
                        <p className="text-xs italic font-bold text-neutral-800 mt-2 max-w-xs mx-auto">
                          "{item.example}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-black uppercase text-black pt-2 border-t-2 border-black">
                      <span>Click to flip back</span>
                      <span>✓ Saved</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[4px] border-[2.5px] border-black bg-[#FFFDE6] dark:bg-zinc-900 p-12 text-center space-y-3 shadow-[5px_5px_0px_#121212]">
          <Star className="h-12 w-12 text-[#FF6B00] mx-auto fill-[#FFE600] stroke-[2.5]" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">No Saved Favorites</h3>
          <p className="text-xs font-bold text-muted-foreground max-w-sm mx-auto">
            Click the star icon during vocabulary or sentence practice to bookmark words for quick flashcard review!
          </p>
        </div>
      )}
    </div>
  );
}

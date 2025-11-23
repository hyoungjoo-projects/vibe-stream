import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'vibe-stream-favorites';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavoriteIds(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
      }
    }
  }, []);

  const addToFavorite = (songId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(songId)) return prev;
      const updated = [...prev, songId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromFavorite = (songId: string) => {
    setFavoriteIds((prev) => {
      const updated = prev.filter((id) => id !== songId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (songId: string) => {
    return favoriteIds.includes(songId);
  };

  return { favoriteIds, addToFavorite, removeFromFavorite, isFavorite };
};

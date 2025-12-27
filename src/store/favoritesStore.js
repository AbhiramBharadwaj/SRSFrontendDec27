import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (eventId) => {
        const favorites = get().favorites;
        if (!favorites.includes(eventId)) {
          set({ favorites: [...favorites, eventId] });
        }
      },
      
      removeFavorite: (eventId) => {
        set({
          favorites: get().favorites.filter(id => id !== eventId)
        });
      },
      
      toggleFavorite: (eventId) => {
        const favorites = get().favorites;
        if (favorites.includes(eventId)) {
          get().removeFavorite(eventId);
        } else {
          get().addFavorite(eventId);
        }
      },
      
      isFavorite: (eventId) => {
        return get().favorites.includes(eventId);
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'srs-favorites-storage',
    }
  )
);

export default useFavoritesStore;
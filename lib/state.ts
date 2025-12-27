import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * User Authentication State
 * Speichert Access Token und Refresh Token für Directus Authentifizierung
 * Wird automatisch in localStorage persistiert
 */
interface UserState {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string) => void;
  setTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      setToken: (token) => set({ token }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      logout: () => set({ token: null, refreshToken: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
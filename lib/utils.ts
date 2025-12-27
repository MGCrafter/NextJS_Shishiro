import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DIRECTUS_URL, MODELS, refreshAccessToken } from "../lib/config.js";
import { LinkData, WelcomeMessageData, HeaderMessageData } from "../types/directus";
import useUserStore from './state';

/**
 * Utility für Tailwind CSS Klassen
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Erstellt Authorization Headers mit aktuellem Access Token
 */
const getAuthHeaders = () => {
  const token = useUserStore.getState().token;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

/**
 * Token Refresh State Management
 * Verhindert parallele Refresh-Requests
 */
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * Fetch Wrapper mit automatischem Token Refresh
 *
 * Funktionsweise:
 * 1. Sendet Request mit aktuellem Access Token
 * 2. Bei 401-Fehler: Refresh Token wird verwendet um neuen Access Token zu holen
 * 3. Request wird mit neuem Token wiederholt
 * 4. Bei Fehler beim Refresh: User wird ausgeloggt
 *
 * Parallele Requests während Refresh werden in Queue gestellt
 * und mit dem neuen Token ausgeführt
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const { refreshToken } = useUserStore.getState();

    if (!refreshToken) {
      useUserStore.getState().logout();
      window.location.href = '/login';
      throw new Error('No refresh token available');
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const tokens = await refreshAccessToken(refreshToken);
        useUserStore.getState().setTokens(tokens.access_token, tokens.refresh_token);
        isRefreshing = false;
        onRefreshed(tokens.access_token);

        const newHeaders = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokens.access_token}`
        };

        return await fetch(url, {
          ...options,
          headers: {
            ...newHeaders,
            ...options.headers,
          },
        });
      } catch (error) {
        isRefreshing = false;
        // Reject all waiting subscribers
        refreshSubscribers.forEach((callback) => {
          // Since callbacks expect a token, we can't call them
          // Just clear the array to prevent memory leaks
        });
        refreshSubscribers = [];
        useUserStore.getState().logout();
        window.location.href = '/login';
        throw error;
      }
    } else {
      return new Promise<Response>((resolve) => {
        addRefreshSubscriber((token: string) => {
          const newHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          };

          resolve(
            fetch(url, {
              ...options,
              headers: {
                ...newHeaders,
                ...options.headers,
              },
            })
          );
        });
      });
    }
  }

  return response;
};

/**
 * ===================
 * LINKS API
 * ===================
 */

export const fetchLinks = async (): Promise<LinkData[]> => {
  try {
    const response = await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.LINKS}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching links:', error);
    throw error;
  }
};

export const addLink = async (link: Partial<LinkData>): Promise<LinkData> => {
  try {
    const response = await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.LINKS}`, {
      method: "POST",
      body: JSON.stringify(link),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error adding link:', error);
    throw error;
  }
};

export const updateLink = async (
  id: number,
  link: Partial<LinkData>
): Promise<LinkData> => {
  try {
    const response = await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.LINKS}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(link),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating link:', error);
    throw error;
  }
};

export const deleteLink = async (id: number): Promise<void> => {
  try {
    await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.LINKS}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    throw error;
  }
};

/**
 * ===================
 * WELCOME MESSAGE API
 * ===================
 */

export const fetchWelcomeMessages = async (): Promise<WelcomeMessageData[]> => {
  try {
    const response = await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching welcome messages:', error);
    throw error;
  }
};

export const addWelcomeMessage = async (message: WelcomeMessageData): Promise<WelcomeMessageData> => {
  try {
    const response = await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`, {
      method: "POST",
      body: JSON.stringify(message),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error adding welcome message:', error);
    throw error;
  }
};

export const updateWelcomeMessage = async (id: number, message: WelcomeMessageData): Promise<WelcomeMessageData> => {
  try {
    const response = await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.WELCOME}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(message),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating welcome message:', error);
    throw error;
  }
};

export const deleteWelcomeMessage = async (id: number): Promise<void> => {
  try {
    await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.WELCOME}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error('Error deleting welcome message:', error);
    throw error;
  }
};

/**
 * ===================
 * HEADER MESSAGE API
 * ===================
 */

export const fetchHeaderMessages = async (): Promise<HeaderMessageData[]> => {
  try {
    const response = await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.HEADER}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching header messages:', error);
    throw error;
  }
};

export const addHeaderMessage = async (text: HeaderMessageData): Promise<HeaderMessageData> => {
  try {
    const response = await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.HEADER}`, {
      method: "POST",
      body: JSON.stringify(text),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error adding header message:', error);
    throw error;
  }
};

export const updateHeaderMessage = async (id: number, text: HeaderMessageData): Promise<HeaderMessageData> => {
  try {
    const response = await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.HEADER}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(text),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating header message:', error);
    throw error;
  }
};

export const deleteHeaderMessage = async (id: number): Promise<void> => {
  try {
    await fetchWithAuth(`${DIRECTUS_URL}/items/${MODELS.HEADER}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error('Error deleting header message:', error);
    throw error;
  }
};
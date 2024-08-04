import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DIRECTUS_URL, MODELS } from "../lib/config.js";
import { LinkData, WelcomeMessageData, HeaderMessageData } from "../types/directus";
import useUserStore from './state'; 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getAuthHeaders = () => {
  const token = useUserStore.getState().token;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

//LINKS_MESSAGE
export const fetchLinks = async (): Promise<LinkData[]> => {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching links:', error);
    throw error;
  }
};

export const addLink = async (link: Partial<LinkData>): Promise<LinkData> => {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}`, {
      method: "POST",
      headers: getAuthHeaders(),
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
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
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
    await fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    throw error;
  }
};

// WELCOME_MESSAGE
export const fetchWelcomeMessages = async (): Promise<WelcomeMessageData[]> => {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching welcome messages:', error);
    throw error;
  }
};

export const addWelcomeMessage = async (message: WelcomeMessageData): Promise<WelcomeMessageData> => {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`, {
      method: "POST",
      headers: getAuthHeaders(),
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
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
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
    await fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Error deleting welcome message:', error);
    throw error;
  }
};

// HEADER_MESSAGE
export const fetchHeaderMessages = async (): Promise<HeaderMessageData[]> => {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching header messages:', error);
    throw error;
  }
};

export const addHeaderMessage = async (text: HeaderMessageData): Promise<HeaderMessageData> => {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`, {
      method: "POST",
      headers: getAuthHeaders(),
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
    const response = await fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
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
    await fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Error deleting header message:', error);
    throw error;
  }
};
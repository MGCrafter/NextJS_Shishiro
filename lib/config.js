/**
 * Directus CMS Konfiguration
 */

export const DIRECTUS_URL = "https://directus-1.nekozdevteam.eu";

/**
 * Directus Collection Namen
 */
export const MODELS = {
  HEADER: "header_shishiro",
  LINKS: "links",
  WELCOME: "Welcome",
  BACKGROUND_VIDEO: "background_video",
};

/**
 * Legacy Login Funktion - wird nicht mehr verwendet
 * Die neue Login-Implementierung ist in app/login/page.tsx
 * @deprecated
 */
export async function directusLogin(email, password) {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem('directus_token', data.data.access_token);
  return data;
}

/**
 * Erneuert den Access Token mit dem Refresh Token
 * Wird automatisch aufgerufen wenn ein API Call 401 zurückgibt
 * @param {string} refreshToken - Der Refresh Token
 * @returns {Promise<{access_token: string, refresh_token: string}>}
 */
export async function refreshAccessToken(refreshToken) {
  const response = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  return {
    access_token: data.data.access_token,
    refresh_token: data.data.refresh_token,
  };
}
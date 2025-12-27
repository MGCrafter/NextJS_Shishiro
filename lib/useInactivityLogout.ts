import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useUserStore from './state';

/**
 * Inaktivitäts-Einstellungen
 */
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 Minuten bis Logout
const WARNING_BEFORE_LOGOUT = 60 * 1000; // 1 Minute Warnung vor Logout

/**
 * React Hook für automatischen Logout bei Inaktivität
 *
 * Funktionsweise:
 * - Trackt User-Aktivität (Maus, Tastatur, Touch, Scroll)
 * - Nach 9 Minuten Inaktivität: Warnung wird angezeigt
 * - Nach 10 Minuten Inaktivität: Automatischer Logout
 * - Jede Aktivität setzt den Timer zurück
 *
 * Verwendung: Einfach in der Admin-Komponente aufrufen
 */
export const useInactivityLogout = () => {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningToastIdRef = useRef<string | number | null>(null);

  /**
   * Setzt alle Timer zurück
   * Wird bei jeder User-Aktivität aufgerufen
   */
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    if (warningToastIdRef.current) {
      toast.dismiss(warningToastIdRef.current);
      warningToastIdRef.current = null;
    }

    const warningTime = INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT;
    if (warningTime > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        const remainingMinutes = Math.floor(WARNING_BEFORE_LOGOUT / 60000);
        warningToastIdRef.current = toast.warning(
          `Du wirst in ${remainingMinutes} Minute${remainingMinutes !== 1 ? 'n' : ''} wegen Inaktivität ausgeloggt. Bewege die Maus um eingeloggt zu bleiben.`,
          {
            autoClose: WARNING_BEFORE_LOGOUT,
            closeOnClick: false,
            draggable: false,
          }
        );
      }, warningTime);
    }

    timeoutRef.current = setTimeout(() => {
      logout();
      toast.info('Du wurdest wegen Inaktivität ausgeloggt.', { autoClose: 3000 });
      router.push('/login');
    }, INACTIVITY_TIMEOUT);
  }, [router, logout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      resetTimer();
    };

    // Event Listener registrieren
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Timer initial starten
    resetTimer();

    // Cleanup: Event Listener und Timer entfernen
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }

      if (warningToastIdRef.current) {
        toast.dismiss(warningToastIdRef.current);
      }
    };
  }, [resetTimer]);

  return null;
};

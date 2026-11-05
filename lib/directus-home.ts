type CollectionOptions = {
  requireItems?: boolean;
  attempts?: number;
  retryDelayMs?: number;
};

/** Load a Directus collection, retrying short-lived network and server errors. */
export async function fetchCollection<T>(
  url: string,
  { requireItems = false, attempts = 3, retryDelayMs = 500 }: CollectionOptions = {},
): Promise<T[]> {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        // Permission and configuration errors won't be resolved by an immediate retry.
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new PermanentDirectusError(`Directus returned HTTP ${response.status}`);
        }
        throw new Error(`Directus returned HTTP ${response.status}`);
      }

      const result = await response.json();
      if (!Array.isArray(result.data) || (requireItems && result.data.length === 0)) {
        throw new Error('Directus returned no usable content');
      }

      return result.data as T[];
    } catch (error) {
      if (error instanceof PermanentDirectusError) throw error;
      lastError = error;
      if (attempt + 1 < attempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error('Could not load Directus content');
}

class PermanentDirectusError extends Error {}

// src/lib/fetchPairStats.ts

import dotenv from 'dotenv';

dotenv.config();

// Base URL of your indexer API (Express, etc.)
const INDEXER_BASE = 'https://api.suirewards.me';

/**
 * Fetch pair statistics for a given pool and range from the indexer API.
 *
 * @param poolId - The ID of the pool to query.
 * @param range - The time range (e.g., '1h', '24h', '7d').
 * @returns Promise resolving to the parsed JSON response.
 * @throws Error if parameters are missing or the fetch fails.
 */
export async function fetchPairStats(
  poolId: string,
  range: string
): Promise<any> {
  if (!poolId || !range) {
    throw new Error('Missing poolId or range');
  }

  const endpoint = `${INDEXER_BASE}/stats/pair?poolId=${encodeURIComponent(
    poolId
  )}&range=${encodeURIComponent(range)}`;

  let response;
  try {
    response = await fetch(endpoint);
  } catch (err) {
    throw new Error(
      `Failed to fetch pair stats from indexer: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Indexer returned error ${response.status}: ${text}`
    );
  }

  // Parse and return JSON data
  return response.json();
}

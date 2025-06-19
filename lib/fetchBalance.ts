// src/lib/fetchPoolStats.ts

import { CoinBalance, SuiClient, } from '@mysten/sui/client';

export const GETTER_RPC = "https://sui-mainnet.blastapi.io/9869b313-c92e-4bed-9bd6-4cfa31ce05fb";

// Initialize Sui RPC provider
const provider = new SuiClient({network: 'mainnet', url: GETTER_RPC});

/**
 * Fetch raw object data for a given object ID from Sui.
 */
async function getBalance(owner: string, coinType?: string): Promise<CoinBalance> {
  return provider.getBalance({
    owner,
    coinType
  });
}

/**
 * Fetch pool statistics by pool ID.
 * @param poolId - The object ID of the pool.
 * @returns A Promise resolving to PoolStats or null if not found.
 * @throws Error if poolId is missing or RPC fails.
 */
export async function fetchBalance(
  owner: string,
  coinType?: string
): Promise<CoinBalance | null> {
  if (!owner) {
    throw new Error("Missing poolId");
  }

  let balance: CoinBalance | undefined;
  try {
    balance = await getBalance(owner, coinType);
  } catch (err) {
    throw new Error(
      `Sui RPC getBalance failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  return {
    ...balance
  };
}

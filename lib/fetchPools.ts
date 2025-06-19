// src/lib/fetchPoolStats.ts

import { SuiClient, SuiObjectResponse, } from '@mysten/sui/client';

export const GETTER_RPC = "https://sui-mainnet.blastapi.io/9869b313-c92e-4bed-9bd6-4cfa31ce05fb";

export interface PoolStats {
    balance_a: number;
    balance_b: number;
    burn_fee: number;
    creator_royalty_fee: number;
    creator_royalty_wallet: string;
    locked_lp_balance: number;
    lp_builder_fee: number;
    reward_balance_a: number;
    rewards_fee: number;
}

// Initialize Sui RPC provider
const provider = new SuiClient({network: 'mainnet', url: GETTER_RPC});

/**
 * Fetch raw object data for a given object ID from Sui.
 */
async function getObject(id: string): Promise<SuiObjectResponse> {
  return provider.getObject({
    id,
    options: { showContent: true, showType: true },
  });
}

/**
 * Fetch pool statistics by pool ID.
 * @param poolId - The object ID of the pool.
 * @returns A Promise resolving to PoolStats or null if not found.
 * @throws Error if poolId is missing or RPC fails.
 */
export async function fetchPoolStats(
  poolId: string
): Promise<PoolStats | null> {
  if (!poolId) {
    throw new Error("Missing poolId");
  }

  let obj;
  try {
    obj = await getObject(poolId);
  } catch (err) {
    throw new Error(
      `Sui RPC getObject failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const raw = (obj.data?.content as any)?.fields as any;
  if (!raw) {
    return null;
  }

  return {
    balance_a:           raw.balance_a ?? 0,
    balance_b:           raw.balance_b ?? 0,
    burn_fee:            raw.burn_fee ?? 0,
    creator_royalty_fee: raw.creator_royalty_fee ?? 0,
    creator_royalty_wallet: raw.creator_royalty_wallet ?? "",
    locked_lp_balance:   raw.locked_lp_balance ?? 0,
    lp_builder_fee:      raw.lp_builder_fee ?? 0,
    reward_balance_a:    raw.reward_balance_a ?? 0,
    rewards_fee:         raw.rewards_fee ?? 0,
  };
}

import {
  EventId,
  getFullnodeUrl,
  SuiClient,
  SuiEvent,
  SuiEventFilter,
} from "@mysten/sui/client";
import {
  CONFIG,
  Network
} from "./constants";
import { sentBuyPresaleWebDapp } from "./main";
import { botTransactionsStore, indexerLatestCursorStore } from "./store/store";

export const getClient = (network: Network) => {
  return new SuiClient({ url: getFullnodeUrl(network) });
};

type SuiEventsCursor = EventId | null | undefined;

type EventExecutionResult = {
  cursor: SuiEventsCursor;
  hasNextPage: boolean;
};

type EventTracker = {
  type: string;
  filter: SuiEventFilter;
  callback: (events: SuiEvent[], type: string) => any;
};

export interface SwapParsedJSON {
  amountin: string;
  amountout: string;
  burn_fee: string;
  is_buy: boolean;
  lp_in_fee: string;
  lp_out_fee: string;
  pool_id: string;
  reserve_a: string;
  reserve_b: string;
  rewards_fee: string;
  royalty_fee: string;
  swap_fee: string;
  timestamp: string;
  tokenin: Token;
  tokenout: Token;
  wallet: string;
}

export interface Token {
  name: string;
}

const handleEvents = (events: SuiEvent[], type: string) => {
  const botEvents = botTransactionsStore.getState();

  events
    .filter(
      (e) =>
        e.type === type &&
        (e.parsedJson as SwapParsedJSON).is_buy &&
        (e.parsedJson as SwapParsedJSON).pool_id
    )
    .forEach(async (event) => {
      if (!botEvents.includes(event.id.txDigest)) {
        const buyer = event.sender;

        const randomValue1 = Math.floor(Math.random() * (1500 - 300 + 1)) + 300;
        await new Promise((resolve) =>
          setTimeout(() => resolve(true), randomValue1)
        );
        const randomValue2 = Math.floor(Math.random() * (1500 - 300 + 1)) + 300;
        await new Promise((resolve) =>
          setTimeout(() => resolve(true), randomValue2)
        );
        const coin = CONFIG.coins.find(
          (c) => c.poolId === (event.parsedJson as SwapParsedJSON).pool_id
        );
        if (!coin) {
          return;
        }
        await sentBuyPresaleWebDapp(
          event.parsedJson as SwapParsedJSON,
          buyer,
          event.id.txDigest,
          coin
        );
      }
    });
};

const EVENTS_TO_TRACK: EventTracker[] = [
  {
    type: `${CONFIG.PACKAGE_ID}::${CONFIG.MODULE_NAME}::Swapped`,
    filter: {
      MoveEventModule: {
        module: CONFIG.MODULE_NAME,
        package: CONFIG.PACKAGE_ID,
      },
    },
    callback: handleEvents,
  },
];

const executeEventJob = async (
  client: SuiClient,
  tracker: EventTracker,
  cursor: SuiEventsCursor
): Promise<EventExecutionResult> => {
  try {
    const { data, hasNextPage, nextCursor } = await client.queryEvents({
      query: tracker.filter,
      cursor,
      order: "ascending",
    });

    console.log("queryEvents", { data });

    await tracker.callback(data, tracker.type);

    if (nextCursor && data.length > 0) {
      await saveLatestCursor(tracker, nextCursor);

      return {
        cursor: nextCursor,
        hasNextPage,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    cursor,
    hasNextPage: false,
  };
};

const runEventJob = async (
  client: SuiClient,
  tracker: EventTracker,
  cursor: SuiEventsCursor
) => {
  const result = await executeEventJob(client, tracker, cursor);

  setTimeout(
    () => {
      runEventJob(client, tracker, result.cursor);
    },
    result.hasNextPage ? 0 : CONFIG.POLLING_INTERVAL_MS
  );
};

/**
 * Gets the latest cursor for an event tracker, either from the DB (if it's undefined)
 *	or from the running cursors.
 */
const getLatestCursor = async (
  tracker: EventTracker
): Promise<SuiEventsCursor> => {
  return indexerLatestCursorStore.getState();
};

/**
 * Saves the latest cursor for an event tracker to the db, so we can resume
 * from there.
 * */
const saveLatestCursor = async (tracker: EventTracker, cursor: EventId) => {
  const data = {
    eventSeq: cursor.eventSeq,
    txDigest: cursor.txDigest,
  };
  indexerLatestCursorStore.setState(() => data);
};

export const setupListeners = async () => {
  for (const event of EVENTS_TO_TRACK) {
    runEventJob(getClient(CONFIG.NETWORK), event, await getLatestCursor(event));
  }
};

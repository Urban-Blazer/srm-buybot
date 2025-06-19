import { CommandGroup } from "@grammyjs/commands";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Bot } from "grammy";
import { SUI_NETWORK, TEST_GROUP_CHAT_ID, TEST_VIDEO_ID } from "./constants";
import { setupListeners, SwapParsedJSON } from "./event-indexer";
import { middleware } from "./middleware";
import { MyContext } from "./store/store";
import { fetchPoolStats } from "./lib/fetchPools";
import { fetchPairStats } from "./lib/fetchStats";
import { fetchBalance } from "./lib/fetchBalance";
import { MIST_PER_SUI } from "@mysten/sui/utils";

require("dotenv").config();

// --- Configuración del Bot ---
if (!process.env.BOT_TOKEN) {
  console.error("FATAL: BOT_TOKEN environment variable is not set.");
  process.exit(1); // Salir si el token no está configurado
}

if (!process.env.NINJA_API_KEY) {
  console.error("FATAL: NINJA_API_KEY environment variable is not set.");
  process.exit(1); // Salir si el token no está configurado
}

if (!process.env.NINJA_API_URL) {
  console.error("FATAL: NINJA_API_URL environment variable is not set.");
  process.exit(1); // Salir si el token no está configurado
}

if (!process.env.ENVIRONMENT) {
  console.error("FATAL: ENVIRONMENT environment variable is not set.");
  process.exit(1); // Salir si el token no está configurado
}

const token = process.env.BOT_TOKEN as string;

const bot = new Bot<MyContext>((process.env.BOT_TOKEN as string) || token);
const myCommands = new CommandGroup<MyContext>();

setupListeners();

export const suiClient = new SuiClient({ url: getFullnodeUrl(SUI_NETWORK) });
export const suiClientTestnet = new SuiClient({
  url: getFullnodeUrl("testnet"),
});
bot.use(middleware);

const userPhotos = new Map<string, any>();
let userPhotosFromId: number | undefined = undefined;
// Ejemplo puntual: escuchar la siguiente imagen enviada después del comando /uploadimage
myCommands.command("uploadimage", "Upload Image", async (ctx) => {
  await ctx.reply("Please send the image now.");
  userPhotosFromId = ctx.from?.id;
});

bot.on("message:photo", async (newCtx: MyContext) => {
  if (!userPhotosFromId) return;
  // Asegurarse de que la foto provenga del mismo usuario y que efectivamente se haya enviado una foto
  if (newCtx.from?.id !== userPhotosFromId || !newCtx.message?.photo) return;

  const photo = newCtx.message.photo[newCtx.message.photo.length - 1];
  // Aquí puedes almacenar la foto; por ejemplo, en un Map llamado userPhotos:
  userPhotos.set(photo.file_id, photo);
  await newCtx.reply(
    `Imagen recibida y almacenada. ${JSON.stringify(photo, null, 2)}`
  );
  userPhotosFromId = undefined;
  await newCtx.replyWithPhoto(photo.file_id, {
    caption: `${JSON.stringify(photo, null, 2)}`,
  });
});

bot.on("message:video", async (newCtx: MyContext) => {
  if (!userPhotosFromId) return;
  // Asegurarse de que la foto provenga del mismo usuario y que efectivamente se haya enviado una foto
  if (newCtx.from?.id !== userPhotosFromId || !newCtx.message?.video) return;

  const photo = newCtx.message.video;
  // Aquí puedes almacenar la foto; por ejemplo, en un Map llamado userPhotos:
  userPhotos.set(photo.file_id, photo);
  await newCtx.reply(
    `Imagen recibida y almacenada. ${JSON.stringify(photo, null, 2)}`
  );
  userPhotosFromId = undefined;
  await newCtx.replyWithPhoto(photo.file_id, {
    caption: `${JSON.stringify(photo, null, 2)}`,
  });
});

const getCoinAPrice = async (symbol: string) => {
  const NINJA_API_KEY = process.env.NINJA_API_KEY as string;
  const NINJA_API_URL = process.env.NINJA_API_URL as string;

  try {
    const response = await fetch(`${NINJA_API_URL}?symbol=${symbol}`, {
      method: "GET",
      headers: {
        "X-Api-Key": NINJA_API_KEY!,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: errorText };
    }

    const data = await response.json();

    return { price: parseFloat(data.price) };
  } catch (error: any) {
    console.error("Error fetching Coin A price:", error);
    return {
      error: "Internal server error",
      details: error.message,
      status: 500,
    };
  }
};

export const sentBuyPresaleWebDapp = async (
  data: SwapParsedJSON,
  sender: string,
  digest: string,
  coin: any
) => {
  try {
    console.log("sentBuyPresaleWebDapp", { data });
    const suiPrice = await getCoinAPrice("SUIUSD");
    const poolInfo = await fetchPoolStats(data.pool_id);
    const buyerBalance = await fetchBalance(sender, coin.coinType);
    const pairStats = await fetchPairStats(data.pool_id, "lifetime");
    const sui_spent = Number(data.amountin) / Number(MIST_PER_SUI);
    const coin_getted = Number(data.amountout) / Number(MIST_PER_SUI);
    const COIN_SUPPLY = coin.supply; // 1B
    const message = `
<b>NEW $${
      coin.symbol
    } BUY on</b> <a href="https://app.suirewards.me/swap/pro">SuiRewards.me</a><b>!</b>

${coin.emoji}

💰  <b>${Number(coin_getted.toFixed(2)).toLocaleString()} ${coin.symbol}</b> 
📥  <b>${Number(sui_spent.toFixed(2)).toLocaleString()} SUI ($${(
      Number(sui_spent) * (suiPrice?.price ?? 0)
    ).toLocaleString()})</b>
👽  <b>Buyer: <a href="https://suiscan.xyz/mainnet/account/${sender}">${sender.slice(
      0,
      3
    )}...${sender.slice(
      sender.length - 4
    )}</a></b> <b><a href="https://suiscan.xyz/mainnet/tx/${digest}">TXN</a></b>
💧  <b>Price SUI: $${(sui_spent / coin_getted).toFixed(7)}</b>
💵  <b>Price USD: $${(
      (sui_spent / coin_getted) *
      (suiPrice?.price ?? 0)
    ).toFixed(8)} </b>
🏦  <b>Market Cap: $${(
      ((sui_spent / coin_getted) *
        (suiPrice?.price ?? 0) *
        (COIN_SUPPLY - (pairStats?.burnedCoins ?? 0))) /
      Math.pow(10, 9)
    ).toLocaleString()} USD </b>

🎁  <b>Reward Balance: ${(
      (poolInfo?.reward_balance_a ?? 0) / Math.pow(10, 9)
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} SUI ($${(
      ((poolInfo?.reward_balance_a ?? 0) / Math.pow(10, 9)) *
      (suiPrice?.price ?? 0)
    ).toLocaleString()})</b>
🤑  <b>Lifetime Reward Distributed: ${(
      (pairStats?.rewardsDistributed ?? 0) / Math.pow(10, 9)
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} SUI ($${(
      ((pairStats?.rewardsDistributed ?? 0) / Math.pow(10, 9)) *
      (suiPrice?.price ?? 0)
    ).toLocaleString()})</b>
${
  Number(buyerBalance?.totalBalance) > 0
    ? ""
    : "\n<b>A NEW HODLER ENTERS THE REWARDVERSE!  🍾🥂</b>"
}

📲 ${Object.entries(coin.socials)
      .map(([key, value]) => `<a href="${value}">${key.toUpperCase()}</a>`)
      .join(" | ")}

<b>It's time you got a piece!</b>`;

    const randomValue1 = Math.floor(Math.random() * (1500 - 300 + 1)) + 300;
    await new Promise((resolve) =>
      setTimeout(() => resolve(true), randomValue1)
    );
    const randomValue2 = Math.floor(Math.random() * (1500 - 300 + 1)) + 300;
    await new Promise((resolve) =>
      setTimeout(() => resolve(true), randomValue2)
    );
    const CHAT_ID =
      process.env.ENVIRONMENT === "dev" ? TEST_GROUP_CHAT_ID : coin.chat;
    const videoId = 
    process.env.ENVIRONMENT === "dev" ? TEST_VIDEO_ID : coin.video;
    await bot.api.sendVideo(CHAT_ID, videoId, {
      parse_mode: "HTML",
      caption: message,
    });
  } catch (error) {
    console.error("CATCH --->", error);
  }

  return;
};

const botLog = async (ctx: any, message?: any, error?: any) => {
  try {
    console.log("botlog:", message);
    error && console.error("botlog error:", error);
    // if (message) await ctx.api.sendMessage(LOG_SUPERGROUP, message);
    // if (error) await ctx.api.sendMessage(LOG_SUPERGROUP, error);
  } catch (error) {
    console.error("Message too long...");
  }
};
bot.use(myCommands);
// bot.use(kpiCommands);

bot.api.setMyCommands([{ command: "start", description: "Start the bot" }]);

// 3. Start the bot
bot
  .start()
  .then(() => {
    botLog(bot, "Bot shutting down");
    console.log("Bot shutting down");
  })
  .catch((error) => {
    botLog(
      bot,
      "Bot Global Catch",
      JSON.stringify({ error: error.message }, null, 2)
    );
    console.log("Bot Global Catch");
    console.error(error);
    bot.start();
    console.log("Bot Restart");
    botLog(bot, "Bot Restart");
  });

setTimeout(() => {
  botLog(bot, "Starting...");
}, 500);

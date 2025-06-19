import { NextFunction } from "grammy";
import { BOT_DEVELOPER, SUI_NETWORK } from "./constants";
import { eventStore, MyContext } from "./store/store";



// --- Función para registrar eventos ---
function recordEvent(ctx: MyContext) {
    const from = ctx.from;
    const chat = ctx.chat;
    const isPrivate = chat?.type === 'private';
    const shortChat = isPrivate ? { id: chat?.id, type: chat?.type } : chat;

    const event = {
        id: from?.id,
        username: from?.username,
        message: ctx.update.message?.text,
        callbackQueryData: ctx.callbackQuery?.data,
        message_id: ctx.update.message?.message_id,
        message_date: ctx.update.message?.date,
        isPrivate,
        chat: shortChat,
    };

    eventStore.setState((state) => [...state, event]);
    console.log("Event:", event); // Log local
}

// --- Middleware Principal Refactorizado ---
export const middleware = async (ctx: MyContext, next: NextFunction) => {
    console.log(JSON.stringify(ctx.message, null, 2));
    const startTime = Date.now(); // Para medir duración si se desea
    console.log(`Update ${ctx.update.update_id} start: ${startTime}ms`);

    // 1. Enriquecer Contexto Básico
    ctx.config = {
        suiNetwork: SUI_NETWORK,
        botDeveloper: BOT_DEVELOPER,
        isDeveloper: ctx.from?.id === BOT_DEVELOPER,
        isPrivate: ctx.chat?.type === 'private',
    };

    // 2. Registrar Evento
    recordEvent(ctx);

    // 3. Loggear información básica (opcional)
    const logMessage = `[${ctx.update.update_id}] ${ctx.from?.id} (${ctx.from?.username}) ${ctx.config.isPrivate ? 'Private' : 'Group:' + ctx.chat?.id} - ${ctx.message?.text || ctx.callbackQuery?.data || 'Update'}`;
    console.log(logMessage);

    // 4. Continuar con los siguientes middlewares/handlers
    await next();

    // 5. Loggear duración (opcional)
    console.log(`Update ${ctx.update.update_id} processed in ${Date.now() - startTime}ms`);
}
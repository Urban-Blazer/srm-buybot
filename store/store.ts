// import { Ed25519Keypair } from '@mysten/sui/dist/cjs/keypairs/ed25519';
import fs from 'fs';
import { Context } from 'grammy';
import path from 'path';

export interface BotConfig {
    suiNetwork: "testnet" | "devnet" | "mainnet";
    botDeveloper: number;
    isDeveloper: boolean;
    isPrivate: boolean;
}

export type MyContext = Context & {
    config: BotConfig;
};

interface StoreOptions<T> {
    /** Estado inicial del store */
    initialState: T;
    /** Ruta del archivo donde se persistirá el estado */
    filePath: string;
    /** Directorio donde se almacenarán los backups (opcional) */
    backupDir?: string;
}

export class Store<T> {
    private state: T;
    private filePath: string;
    private subscribers: Array<(state: T) => void> = [];
    private backupDir?: string;

    constructor(options: StoreOptions<T>) {
        this.filePath = path.resolve(options.filePath);
        if (options.backupDir) {
            this.backupDir = path.resolve(options.backupDir);
        }
        // Intenta cargar el estado desde el archivo; si falla, utiliza el estado inicial.
        if (fs.existsSync(this.filePath)) {
            try {
                const data = fs.readFileSync(this.filePath, 'utf-8');
                this.state = JSON.parse(data) as T;
            } catch (error) {
                console.error(`Error al parsear el archivo "${this.filePath}". Se usará el estado inicial.`, error);
                this.state = options.initialState;
                this.persist();
            }
        } else {
            this.state = options.initialState;
            this.persist();
        }
    }

    /** Devuelve el estado actual */
    getState(): T {
        return this.state;
    }

    /**
     * Actualiza el estado. Acepta un objeto parcial o una función que recibe el estado anterior y retorna el nuevo.
     */
    setState(update: Partial<T> | ((prevState: T) => T)): void {
        const newState =
            typeof update === 'function'
                ? update(this.state)
                : { ...this.state, ...update };
        this.state = newState;
        this.persist();
        this.notify();
    }

    /**
     * Permite suscribirse a los cambios del estado.
     * Retorna una función para cancelar la suscripción.
     */
    subscribe(callback: (state: T) => void): () => void {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter((cb) => cb !== callback);
        };
    }

    /**
     * Guarda el estado actual en el archivo JSON y, si está configurado,
     * genera un backup en un archivo separado.
     */
    private persist(): void {
        try {
            // Aseguramos que la carpeta del archivo principal exista
            const dir = path.dirname(this.filePath);
            fs.mkdirSync(dir, { recursive: true });

            // Escribimos el estado actual en el archivo principal
            fs.writeFileSync(this.filePath, JSON.stringify(this.state, null, 2));
            // Generamos el backup si se configuró un directorio para ello
            this.createBackup();
        } catch (error) {
            console.error(`Error al guardar el estado en el archivo "${this.filePath}":`, error);
        }
    }

    /**
     * Crea un backup del estado actual en el directorio configurado,
     * utilizando un timestamp en el nombre del archivo para distinguirlos.
     */
    private createBackup(): void {
        if (this.backupDir) {
            try {
                // Aseguramos que el directorio de backups exista
                fs.mkdirSync(this.backupDir, { recursive: true });
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupFileName = path.join(this.backupDir, `backup-${timestamp}.json`);
                fs.writeFileSync(backupFileName, JSON.stringify(this.state, null, 2));
            } catch (error) {
                console.error(`Error al crear el backup en "${this.backupDir}":`, error);
            }
        }
    }

    /** Notifica a todos los suscriptores sobre el cambio de estado */
    private notify(): void {
        this.subscribers.forEach((callback) => callback(this.state));
    }
}

/**
 * Función auxiliar para crear el store de forma sencilla.
 * @param options Opciones del store
 * @returns Instancia del store
 */
export function createStore<T>(options: StoreOptions<T>): Store<T> {
    return new Store<T>(options);
}
export const eventStore = createStore<any[]>({
    initialState: [],
    filePath: './store/data/events/events.json',
});

export const indexerLatestCursorStore = createStore<{
    eventSeq: string;
    txDigest: string;
}>({
    initialState: {
        eventSeq: '0',
        txDigest: 'F2LhdLkG8zpXUjReGmATdUNtEazcChMbux3nYXkkFeXn'
      },
    filePath: './store/data/bot-indexer-cursor/bot-indexer-cursor.json',
});

export const botTransactionsStore = createStore<string[]>({
    initialState: [],
    filePath: './store/data/bot-txn/bot-txn.json',
});
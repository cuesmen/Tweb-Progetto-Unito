import { MongoClient, ServerApiVersion, Int32 } from 'mongodb';
import { ENV } from '../config/env.js';

let client;
let db;
let connectingPromise;

/**
 * Connette a Mongo con retry e prepara collezioni/indici.
 */
async function connectMongo() {
  if (db) return db;
  if (connectingPromise) return connectingPromise;

  const uri = ENV.MONGO_URI || 'mongodb://127.0.0.1:27017';
  const dbName = ENV.MONGO_DB || 'moviepoint'; 

  const clientOptions = {
    maxPoolSize: ENV.MONGO_MAX_POOL_SIZE ?? 20,
    minPoolSize: ENV.MONGO_MIN_POOL_SIZE ?? 0,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 12_000,
    socketTimeoutMS: 45_000,
  };

  client = new MongoClient(uri, clientOptions);

  connectingPromise = (async () => {
    let attempt = 0;
    const maxRetries = Number(ENV.MONGO_MAX_RETRIES ?? 5);

    while (true) {
      try {
        await client.connect();
        db = client.db(dbName);
        await db.command({ ping: 1 });

        await ensureBaseCollections(db);
        await ensureGlobalChat(db);

        return db;
      } catch (err) {
        attempt += 1;
        if (attempt > maxRetries) {
          throw new Error(`Mongo connection failed after ${maxRetries} retries: ${err.message}`);
        }
        const backoff = Math.min(1000 * 2 ** (attempt - 1), 10_000);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
  })();

  return connectingPromise;
}

/**
 * Crea collezioni `chats` e `messages` e gli indici necessari.
 */
async function ensureBaseCollections(db) {
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  const names = new Set(collections.map(c => c.name));

  if (!names.has('chats')) {
    await db.createCollection('chats', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['chatId', 'type', 'createdAt', 'messagesCount'],
          properties: {
            _id: { bsonType: 'objectId' },
            chatId: { bsonType: 'string' },       // "global" o "movie:<id>"
            type: { enum: ['global', 'movie'] },
            movieId: { bsonType: ['string', 'null'] },
            createdAt: { bsonType: 'date' },
            lastMessageAt: { bsonType: ['date', 'null'] },
            messagesCount: { bsonType: ['int','long','double'] }
          },
          additionalProperties: true
        }
      }
    });
  }
  if (!names.has('messages')) {
    await db.createCollection('messages', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['chatId', 'author', 'text', 'createdAt'],
          properties: {
            _id: { bsonType: 'objectId' },
            chatId: { bsonType: 'string' },
            author: {
              bsonType: 'object',
              required: ['username'],
              properties: { username: { bsonType: 'string' } },
              additionalProperties: false
            },
            text: { bsonType: 'string' },
            createdAt: { bsonType: 'date' }
          },
          additionalProperties: true
        }
      }
    });
  }

  const chats = db.collection('chats');
  const messages = db.collection('messages');

  // indici
  await chats.createIndex({ chatId: 1 }, { unique: true });
  await chats.createIndex({ lastMessageAt: -1 });

  await messages.createIndex({ chatId: 1, _id: -1 });
  await messages.createIndex({ chatId: 1, createdAt: -1 });
}

/**
 * Garantisce l'esistenza della chat globale.
 */
async function ensureGlobalChat(db) {
  const now = new Date();
  await db.collection('chats').updateOne(
    { chatId: 'global' },
    {
      $setOnInsert: {
        chatId: 'global',
        type: 'global',
        movieId: null,
        createdAt: now,
        lastMessageAt: null,
        messagesCount: new Int32(0)
      }
    },
    { upsert: true }
  );
}

/** Restituisce l'istanza DB */
export async function getDb() {
  if (db) return db;
  return connectMongo();
}

/** Helper per ottenere una collezione */
export async function getCollection(name) {
  const database = await getDb();
  return database.collection(name);
}

/** Health-check */
export async function mongoHealth() {
  const database = await getDb();
  const res = await database.command({ ping: 1 });
  return { ok: res.ok === 1, db: database.databaseName, pool: client?.options?.maxPoolSize };
}

/** Chiusura elegante */
export async function closeMongo() {
  try {
    if (client) await client.close(true);
  } finally {
    client = undefined;
    db = undefined;
    connectingPromise = undefined;
  }
}

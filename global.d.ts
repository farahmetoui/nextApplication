// global.d.ts
declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

// Cette ligne est nécessaire pour que le fichier soit traité comme un module.
export {};

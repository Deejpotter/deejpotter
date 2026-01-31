// Temporary ambient module declaration for mongodb-memory-server used in tests.
// Install proper types or dev dependency later (dev only).
declare module 'mongodb-memory-server' {
  export class MongoMemoryServer {
    static create(): Promise<MongoMemoryServer>;
    stop(): Promise<void>;
    getUri(): string;
  }
  export default MongoMemoryServer;
}

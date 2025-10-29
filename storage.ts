// Storage interface for Red Proxy
// Currently not in use as proxy uses localStorage on client
// This file is kept for potential future server-side data persistence

export interface IStorage {
  // Add storage methods here if needed for server-side data
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();

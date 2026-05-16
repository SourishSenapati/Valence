import { describe, it, expect } from 'vitest';
import { db } from './db';

describe('Prisma Database Singleton', () => {
  it('should export a defined Prisma client instance', () => {
    expect(db).toBeDefined();
    // Verify it looks like a Prisma client instance
    expect(typeof db.$connect).toBe('function');
    expect(typeof db.$disconnect).toBe('function');
  });

  it('should assign instance to globalThis in non-production environments', () => {
    const globalForPrisma = globalThis as unknown as {
      prisma: typeof db;
    };
    
    if (process.env.NODE_ENV !== 'production') {
      expect(globalForPrisma.prisma).toBe(db);
    }
  });
});

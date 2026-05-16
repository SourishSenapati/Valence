import { describe, it, expect } from 'vitest';
import { authOptions } from './auth';

describe('authOptions Configuration', () => {
  it('should configure session strategy to use JWT', () => {
    expect(authOptions.session?.strategy).toBe('jwt');
  });

  it('should have the Prisma adapter configured', () => {
    expect(authOptions.adapter).toBeDefined();
  });

  it('should implement the required NextAuth callbacks', () => {
    expect(authOptions.callbacks?.jwt).toBeDefined();
    expect(authOptions.callbacks?.session).toBeDefined();
  });
});

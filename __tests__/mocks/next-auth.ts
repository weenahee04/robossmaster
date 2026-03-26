import { vi } from "vitest";

// Mock getToken from next-auth/jwt
export const mockGetToken = vi.fn();

vi.mock("next-auth/jwt", () => ({
  getToken: (...args: any[]) => mockGetToken(...args),
}));

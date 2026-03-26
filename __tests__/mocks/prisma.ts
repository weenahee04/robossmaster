import { vi } from "vitest";

const prisma = {
  branch: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  bankAccount: {
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  customer: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  customerLineAccount: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  customerPoint: {
    upsert: vi.fn(),
  },
  $transaction: vi.fn(),
};

export default prisma;

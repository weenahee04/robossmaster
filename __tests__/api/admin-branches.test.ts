import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

// Mock prisma before importing route
vi.mock("@/lib/prisma", () => ({
  default: {
    branch: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: { create: vi.fn(), deleteMany: vi.fn() },
    bankAccount: { create: vi.fn(), deleteMany: vi.fn() },
    customerLineAccount: { deleteMany: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/api-auth", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/encryption", () => ({
  encrypt: vi.fn((text: string) => `encrypted:${text}`),
}));

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed-password") },
}));

import { GET, POST, PATCH, DELETE } from "@/app/api/admin/branches/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { encrypt } from "@/lib/encryption";

describe("Admin Branches API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null); // authorized by default
  });

  describe("GET /api/admin/branches", () => {
    it("returns branches when authorized", async () => {
      const mockBranches = [
        { id: "1", name: "Branch 1", slug: "branch-1" },
        { id: "2", name: "Branch 2", slug: "branch-2" },
      ];
      vi.mocked(prisma.branch.findMany).mockResolvedValue(mockBranches as any);

      const req = makeRequest("http://localhost:3000/api/admin/branches");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockBranches);
      expect(prisma.branch.findMany).toHaveBeenCalled();
    });

    it("returns 401 when unauthorized", async () => {
      const { NextResponse } = await import("next/server");
      vi.mocked(requireAdmin).mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const req = makeRequest("http://localhost:3000/api/admin/branches");
      const res = await GET(req);

      expect(res.status).toBe(401);
    });

    it("returns 500 on database error", async () => {
      vi.mocked(prisma.branch.findMany).mockRejectedValue(new Error("DB error"));

      const req = makeRequest("http://localhost:3000/api/admin/branches");
      const res = await GET(req);

      expect(res.status).toBe(500);
    });
  });

  describe("PATCH /api/admin/branches", () => {
    it("updates LINE credentials with encryption", async () => {
      const mockBranch = { id: "1", name: "Test", lineChannelId: "123", lineChannelSecret: "encrypted:secret" };
      vi.mocked(prisma.branch.update).mockResolvedValue(mockBranch as any);

      const req = makeRequest("http://localhost:3000/api/admin/branches", {
        method: "PATCH",
        body: JSON.stringify({
          id: "1",
          lineChannelId: "123",
          lineChannelSecret: "secret",
          lineOaId: "@oa123",
        }),
      });
      const res = await PATCH(req);

      expect(res.status).toBe(200);
      expect(encrypt).toHaveBeenCalledWith("secret");
      expect(prisma.branch.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: expect.objectContaining({
          lineChannelId: "123",
          lineChannelSecret: "encrypted:secret",
          lineOaId: "@oa123",
        }),
      });
    });

    it("sets lineChannelSecret to null when empty string", async () => {
      vi.mocked(prisma.branch.update).mockResolvedValue({} as any);

      const req = makeRequest("http://localhost:3000/api/admin/branches", {
        method: "PATCH",
        body: JSON.stringify({ id: "1", lineChannelSecret: "" }),
      });
      await PATCH(req);

      expect(prisma.branch.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: expect.objectContaining({ lineChannelSecret: null }),
      });
    });

    it("updates isActive flag", async () => {
      vi.mocked(prisma.branch.update).mockResolvedValue({} as any);

      const req = makeRequest("http://localhost:3000/api/admin/branches", {
        method: "PATCH",
        body: JSON.stringify({ id: "1", isActive: false }),
      });
      await PATCH(req);

      expect(prisma.branch.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: expect.objectContaining({ isActive: false }),
      });
    });
  });

  describe("DELETE /api/admin/branches", () => {
    it("deletes branch and cascades cleanup", async () => {
      vi.mocked(prisma.customerLineAccount.deleteMany).mockResolvedValue({ count: 0 } as any);
      vi.mocked(prisma.bankAccount.deleteMany).mockResolvedValue({ count: 0 } as any);
      vi.mocked(prisma.user.deleteMany).mockResolvedValue({ count: 0 } as any);
      vi.mocked(prisma.branch.delete).mockResolvedValue({} as any);

      const req = makeRequest("http://localhost:3000/api/admin/branches?id=branch-1", {
        method: "DELETE",
      });
      const res = await DELETE(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      // Verify cascade order
      expect(prisma.customerLineAccount.deleteMany).toHaveBeenCalledWith({ where: { branchId: "branch-1" } });
      expect(prisma.bankAccount.deleteMany).toHaveBeenCalledWith({ where: { branchId: "branch-1" } });
      expect(prisma.user.deleteMany).toHaveBeenCalledWith({ where: { branchId: "branch-1" } });
      expect(prisma.branch.delete).toHaveBeenCalledWith({ where: { id: "branch-1" } });
    });

    it("returns 400 when id is missing", async () => {
      const req = makeRequest("http://localhost:3000/api/admin/branches", {
        method: "DELETE",
      });
      const res = await DELETE(req);

      expect(res.status).toBe(400);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    branch: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed-pw-123") },
}));

import { GET, POST, PATCH, DELETE } from "@/app/api/admin/users/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import bcrypt from "bcryptjs";

describe("Admin Users API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null);
  });

  describe("GET /api/admin/users", () => {
    it("returns users and branches list", async () => {
      const mockUsers = [{ id: "u1", email: "admin@test.com", name: "Admin", role: "SUPER_ADMIN" }];
      const mockBranches = [{ id: "b1", name: "Branch 1" }];
      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any);
      vi.mocked(prisma.branch.findMany).mockResolvedValue(mockBranches as any);

      const req = makeRequest("http://localhost:3000/api/admin/users");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.users).toEqual(mockUsers);
      expect(data.branches).toEqual(mockBranches);
    });

    it("returns 401 when unauthorized", async () => {
      const { NextResponse } = await import("next/server");
      vi.mocked(requireAdmin).mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );

      const req = makeRequest("http://localhost:3000/api/admin/users");
      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    it("returns 500 on database error", async () => {
      vi.mocked(prisma.user.findMany).mockRejectedValue(new Error("DB fail"));

      const req = makeRequest("http://localhost:3000/api/admin/users");
      const res = await GET(req);
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/admin/users", () => {
    it("creates a user with hashed password", async () => {
      const mockUser = { id: "u2", email: "new@test.com", name: "New", role: "BRANCH_ADMIN" };
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser as any);

      const req = makeRequest("http://localhost:3000/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          name: "New",
          email: "new@test.com",
          phone: "0812345678",
          password: "secret123",
          role: "BRANCH_ADMIN",
          branchId: "b1",
        }),
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.email).toBe("new@test.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("secret123", 12);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "new@test.com",
          passwordHash: "hashed-pw-123",
          role: "BRANCH_ADMIN",
        }),
      });
    });

    it("returns 400 on duplicate email (P2002)", async () => {
      const err: any = new Error("Unique constraint");
      err.code = "P2002";
      vi.mocked(prisma.user.create).mockRejectedValue(err);

      const req = makeRequest("http://localhost:3000/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ name: "Dup", email: "dup@test.com", password: "pw" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/admin/users", () => {
    it("updates user without changing password", async () => {
      vi.mocked(prisma.user.update).mockResolvedValue({ id: "u1" } as any);

      const req = makeRequest("http://localhost:3000/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ id: "u1", name: "Updated", email: "up@test.com", role: "SUPER_ADMIN" }),
      });
      const res = await PATCH(req);

      expect(res.status).toBe(200);
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it("updates user with new password", async () => {
      vi.mocked(prisma.user.update).mockResolvedValue({ id: "u1" } as any);

      const req = makeRequest("http://localhost:3000/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ id: "u1", name: "Updated", email: "up@test.com", role: "SUPER_ADMIN", password: "newpassword123" }),
      });
      await PATCH(req);

      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword123", 12);
    });

    it("returns 400 on duplicate email", async () => {
      const err: any = new Error("Unique constraint");
      err.code = "P2002";
      vi.mocked(prisma.user.update).mockRejectedValue(err);

      const req = makeRequest("http://localhost:3000/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ id: "u1", email: "dup@test.com" }),
      });
      const res = await PATCH(req);
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/admin/users", () => {
    it("deletes user by id", async () => {
      vi.mocked(prisma.user.delete).mockResolvedValue({} as any);

      const req = makeRequest("http://localhost:3000/api/admin/users?id=u1", { method: "DELETE" });
      const res = await DELETE(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: "u1" } });
    });

    it("returns 400 when id is missing", async () => {
      const req = makeRequest("http://localhost:3000/api/admin/users", { method: "DELETE" });
      const res = await DELETE(req);
      expect(res.status).toBe(400);
    });
  });
});

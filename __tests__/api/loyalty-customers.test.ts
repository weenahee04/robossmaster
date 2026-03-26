import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    customer: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { GET, POST, PATCH } from "@/app/api/loyalty/customers/route";
import prisma from "@/lib/prisma";

describe("Loyalty Customers API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/loyalty/customers", () => {
    it("returns customer by phone", async () => {
      const mockCustomer = {
        id: "c1",
        phone: "0812345678",
        name: "John",
        vehicles: [],
        points: [],
      };
      vi.mocked(prisma.customer.findUnique).mockResolvedValue(mockCustomer as any);

      const req = makeRequest("http://localhost:3000/api/loyalty/customers?phone=0812345678&branch=test-branch");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.phone).toBe("0812345678");
      expect(prisma.customer.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { phone: "0812345678" },
        })
      );
    });

    it("filters points by branch slug when provided", async () => {
      vi.mocked(prisma.customer.findUnique).mockResolvedValue({ id: "c1" } as any);

      const req = makeRequest("http://localhost:3000/api/loyalty/customers?phone=0812345678&branch=my-branch");
      await GET(req);

      expect(prisma.customer.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            points: expect.objectContaining({
              where: { branch: { slug: "my-branch" } },
            }),
          }),
        })
      );
    });

    it("returns 400 when phone is missing", async () => {
      const req = makeRequest("http://localhost:3000/api/loyalty/customers");
      const res = await GET(req);
      expect(res.status).toBe(400);
    });

    it("returns 404 when customer not found", async () => {
      vi.mocked(prisma.customer.findUnique).mockResolvedValue(null);

      const req = makeRequest("http://localhost:3000/api/loyalty/customers?phone=0000000000");
      const res = await GET(req);
      expect(res.status).toBe(404);
    });

    it("returns 500 on database error", async () => {
      vi.mocked(prisma.customer.findUnique).mockRejectedValue(new Error("DB error"));

      const req = makeRequest("http://localhost:3000/api/loyalty/customers?phone=0812345678");
      const res = await GET(req);
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/loyalty/customers", () => {
    it("creates a new customer", async () => {
      const mockCustomer = { id: "c2", phone: "0899999999", name: "New Customer" };
      vi.mocked(prisma.customer.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.customer.create).mockResolvedValue(mockCustomer as any);

      const req = makeRequest("http://localhost:3000/api/loyalty/customers", {
        method: "POST",
        body: JSON.stringify({ phone: "0899999999", name: "New Customer" }),
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.name).toBe("New Customer");
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: { phone: "0899999999", name: "New Customer", lineId: null },
      });
    });

    it("returns 400 when phone is missing", async () => {
      const req = makeRequest("http://localhost:3000/api/loyalty/customers", {
        method: "POST",
        body: JSON.stringify({ name: "No Phone" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("returns 409 when phone already registered", async () => {
      vi.mocked(prisma.customer.findUnique).mockResolvedValue({ id: "existing" } as any);

      const req = makeRequest("http://localhost:3000/api/loyalty/customers", {
        method: "POST",
        body: JSON.stringify({ phone: "0812345678", name: "Duplicate" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(409);
    });
  });

  describe("PATCH /api/loyalty/customers", () => {
    it("updates customer name", async () => {
      vi.mocked(prisma.customer.update).mockResolvedValue({ id: "c1", name: "Updated" } as any);

      const req = makeRequest("http://localhost:3000/api/loyalty/customers", {
        method: "PATCH",
        body: JSON.stringify({ id: "c1", name: "Updated" }),
      });
      const res = await PATCH(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.name).toBe("Updated");
    });

    it("updates profile image", async () => {
      vi.mocked(prisma.customer.update).mockResolvedValue({ id: "c1" } as any);

      const req = makeRequest("http://localhost:3000/api/loyalty/customers", {
        method: "PATCH",
        body: JSON.stringify({ id: "c1", profileImage: "https://img.com/photo.jpg" }),
      });
      await PATCH(req);

      expect(prisma.customer.update).toHaveBeenCalledWith({
        where: { id: "c1" },
        data: expect.objectContaining({ profileImage: "https://img.com/photo.jpg" }),
      });
    });

    it("returns 400 when id is missing", async () => {
      const req = makeRequest("http://localhost:3000/api/loyalty/customers", {
        method: "PATCH",
        body: JSON.stringify({ name: "No ID" }),
      });
      const res = await PATCH(req);
      expect(res.status).toBe(400);
    });
  });
});

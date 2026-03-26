import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    banner: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAdmin: vi.fn() }));

import { GET, POST, PATCH, DELETE } from "@/app/api/admin/banners/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

describe("Admin Banners API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null);
  });

  it("GET returns banners sorted by sortOrder", async () => {
    vi.mocked(prisma.banner.findMany).mockResolvedValue([{ id: "b1", title: "Promo" }] as any);
    const res = await GET(makeRequest("http://localhost:3000/api/admin/banners"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
  });

  it("POST creates a banner", async () => {
    vi.mocked(prisma.banner.create).mockResolvedValue({ id: "b2", title: "New" } as any);
    const res = await POST(makeRequest("http://localhost:3000/api/admin/banners", {
      method: "POST",
      body: JSON.stringify({ title: "New", imageUrl: "https://img.com/1.jpg", sortOrder: "3" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.banner.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ title: "New", sortOrder: 3 }),
    });
  });

  it("PATCH updates a banner", async () => {
    vi.mocked(prisma.banner.update).mockResolvedValue({ id: "b1" } as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/banners", {
      method: "PATCH",
      body: JSON.stringify({ id: "b1", title: "Updated" }),
    }));
    expect(res.status).toBe(200);
  });

  it("PATCH returns 400 when id missing", async () => {
    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/banners", {
      method: "PATCH",
      body: JSON.stringify({ title: "No ID" }),
    }));
    expect(res.status).toBe(400);
  });

  it("DELETE removes a banner", async () => {
    vi.mocked(prisma.banner.delete).mockResolvedValue({} as any);
    const res = await DELETE(makeRequest("http://localhost:3000/api/admin/banners?id=b1", { method: "DELETE" }));
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("DELETE returns 400 when id missing", async () => {
    const res = await DELETE(makeRequest("http://localhost:3000/api/admin/banners", { method: "DELETE" }));
    expect(res.status).toBe(400);
  });
});

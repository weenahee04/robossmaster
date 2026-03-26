import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    serviceTicket: { findMany: vi.fn(), update: vi.fn() },
    ticketComment: { create: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAdmin: vi.fn() }));

import { GET, PATCH } from "@/app/api/admin/service/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

describe("Admin Service API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null);
  });

  it("GET returns service tickets", async () => {
    vi.mocked(prisma.serviceTicket.findMany).mockResolvedValue([{ id: "t1", title: "Broken" }] as any);
    const res = await GET(makeRequest("http://localhost:3000/api/admin/service"));
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });

  it("PATCH updates ticket status", async () => {
    vi.mocked(prisma.serviceTicket.update).mockResolvedValue({} as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/service", {
      method: "PATCH", body: JSON.stringify({ id: "t1", status: "FIXED" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.serviceTicket.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: expect.objectContaining({ status: "FIXED" }),
    });
  });

  it("PATCH adds comment when provided", async () => {
    vi.mocked(prisma.ticketComment.create).mockResolvedValue({} as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/admin/service", {
      method: "PATCH", body: JSON.stringify({ id: "t1", comment: "Fixed it", userId: "u1" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.ticketComment.create).toHaveBeenCalledWith({
      data: { ticketId: "t1", userId: "u1", message: "Fixed it" },
    });
  });
});

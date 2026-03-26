import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    serviceTicket: { findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    ticketComment: { create: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, POST, PATCH } from "@/app/api/branch/service/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Service API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns service tickets for branch", async () => {
    vi.mocked(prisma.serviceTicket.findMany).mockResolvedValue([{ id: "t1", title: "Broken" }] as any);
    const res = await GET(makeRequest("http://localhost:3000/api/branch/service?branchId=b1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/service"));
    expect(res.status).toBe(400);
  });

  it("POST creates service ticket", async () => {
    vi.mocked(prisma.serviceTicket.create).mockResolvedValue({ id: "t2" } as any);
    const res = await POST(makeRequest("http://localhost:3000/api/branch/service", {
      method: "POST",
      body: JSON.stringify({ branchId: "b1", title: "Machine down", description: "Not working", category: "MACHINE", priority: "HIGH" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.serviceTicket.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ branchId: "b1", title: "Machine down", priority: "HIGH" }),
    });
  });

  it("PATCH updates ticket status and adds comment", async () => {
    vi.mocked(prisma.serviceTicket.update).mockResolvedValue({} as any);
    vi.mocked(prisma.ticketComment.create).mockResolvedValue({} as any);

    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/service", {
      method: "PATCH",
      body: JSON.stringify({ id: "t1", status: "FIXED", comment: "Done", userId: "u1" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.serviceTicket.update).toHaveBeenCalled();
    expect(prisma.ticketComment.create).toHaveBeenCalled();
  });
});

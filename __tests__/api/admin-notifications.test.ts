import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    notification: { findMany: vi.fn(), create: vi.fn(), createMany: vi.fn() },
    branch: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAdmin: vi.fn() }));

import { GET, POST } from "@/app/api/admin/notifications/route";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

describe("Admin Notifications API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(null);
  });

  it("GET returns notifications and branches", async () => {
    vi.mocked(prisma.notification.findMany).mockResolvedValue([{ id: "n1", title: "Test" }] as any);
    vi.mocked(prisma.branch.findMany).mockResolvedValue([{ id: "b1", name: "Branch 1" }] as any);

    const res = await GET(makeRequest("http://localhost:3000/api/admin/notifications"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.notifications).toHaveLength(1);
    expect(data.branches).toHaveLength(1);
  });

  it("POST creates notification for single branch", async () => {
    vi.mocked(prisma.notification.create).mockResolvedValue({ id: "n2" } as any);

    const res = await POST(makeRequest("http://localhost:3000/api/admin/notifications", {
      method: "POST",
      body: JSON.stringify({ branchId: "b1", type: "GENERAL", title: "Test", message: "Hello" }),
    }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(prisma.notification.create).toHaveBeenCalled();
  });

  it("POST creates notifications for ALL branches", async () => {
    vi.mocked(prisma.branch.findMany).mockResolvedValue([{ id: "b1" }, { id: "b2" }] as any);
    vi.mocked(prisma.notification.createMany).mockResolvedValue({ count: 2 } as any);

    const res = await POST(makeRequest("http://localhost:3000/api/admin/notifications", {
      method: "POST",
      body: JSON.stringify({ branchId: "ALL", title: "Broadcast", message: "To all" }),
    }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(2);
    expect(prisma.notification.createMany).toHaveBeenCalled();
  });
});

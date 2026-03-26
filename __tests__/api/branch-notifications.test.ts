import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    notification: { findMany: vi.fn(), count: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, PATCH } from "@/app/api/branch/notifications/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Notifications API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns notifications and unread count", async () => {
    vi.mocked(prisma.notification.findMany).mockResolvedValue([{ id: "n1" }] as any);
    vi.mocked(prisma.notification.count).mockResolvedValue(3);

    const res = await GET(makeRequest("http://localhost:3000/api/branch/notifications?branchId=b1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.notifications).toHaveLength(1);
    expect(data.unreadCount).toBe(3);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/notifications"));
    expect(res.status).toBe(400);
  });

  it("PATCH marks single notification as read", async () => {
    vi.mocked(prisma.notification.update).mockResolvedValue({} as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/notifications", {
      method: "PATCH", body: JSON.stringify({ id: "n1" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.notification.update).toHaveBeenCalledWith({ where: { id: "n1" }, data: { isRead: true } });
  });

  it("PATCH marks all branch notifications as read", async () => {
    vi.mocked(prisma.notification.updateMany).mockResolvedValue({ count: 5 } as any);
    const res = await PATCH(makeRequest("http://localhost:3000/api/branch/notifications", {
      method: "PATCH", body: JSON.stringify({ branchId: "b1" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { branchId: "b1", isRead: false }, data: { isRead: true },
    });
  });
});

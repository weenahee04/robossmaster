import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    employee: { findMany: vi.fn(), create: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, POST } from "@/app/api/branch/employees/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Employees API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns employees for branch", async () => {
    vi.mocked(prisma.employee.findMany).mockResolvedValue([{ id: "e1", name: "John" }] as any);
    const res = await GET(makeRequest("http://localhost:3000/api/branch/employees?branchId=b1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/employees"));
    expect(res.status).toBe(400);
  });

  it("POST creates employee", async () => {
    vi.mocked(prisma.employee.create).mockResolvedValue({ id: "e2", name: "Jane" } as any);
    const res = await POST(makeRequest("http://localhost:3000/api/branch/employees", {
      method: "POST",
      body: JSON.stringify({ branchId: "b1", name: "Jane", position: "Washer", phone: "081", salary: "15000" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.employee.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: "Jane", salary: 15000 }),
    });
  });
});

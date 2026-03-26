import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeRequest } from "../helpers";

vi.mock("@/lib/prisma", () => ({
  default: {
    attendance: { findMany: vi.fn(), create: vi.fn() },
    employee: { findMany: vi.fn() },
  },
}));

vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { GET, POST } from "@/app/api/branch/attendance/route";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

describe("Branch Attendance API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null);
  });

  it("GET returns attendances and employees", async () => {
    vi.mocked(prisma.attendance.findMany).mockResolvedValue([{ id: "a1" }] as any);
    vi.mocked(prisma.employee.findMany).mockResolvedValue([{ id: "e1", name: "John" }] as any);

    const res = await GET(makeRequest("http://localhost:3000/api/branch/attendance?branchId=b1"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.attendances).toHaveLength(1);
    expect(data.employees).toHaveLength(1);
  });

  it("GET returns 400 when branchId missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/branch/attendance"));
    expect(res.status).toBe(400);
  });

  it("POST creates attendance with hours calculation", async () => {
    vi.mocked(prisma.attendance.create).mockResolvedValue({ id: "a2" } as any);

    const res = await POST(makeRequest("http://localhost:3000/api/branch/attendance", {
      method: "POST",
      body: JSON.stringify({
        branchId: "b1", employeeId: "e1", date: "2024-01-15",
        checkIn: "09:00", checkOut: "18:00", status: "PRESENT",
      }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.attendance.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        branchId: "b1", employeeId: "e1", status: "PRESENT",
        hoursWorked: 9, overtimeHours: 1,
      }),
    });
  });

  it("POST handles attendance without checkOut", async () => {
    vi.mocked(prisma.attendance.create).mockResolvedValue({ id: "a3" } as any);

    const res = await POST(makeRequest("http://localhost:3000/api/branch/attendance", {
      method: "POST",
      body: JSON.stringify({ branchId: "b1", employeeId: "e1", date: "2024-01-15", checkIn: "09:00" }),
    }));
    expect(res.status).toBe(200);
    expect(prisma.attendance.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ hoursWorked: null, overtimeHours: null }),
    });
  });
});

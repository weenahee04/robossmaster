/**
 * E2E Test Script - ทดสอบทุกระบบบน production
 * Usage: npx tsx scripts/e2e-test.ts [BASE_URL]
 */

const BASE = process.argv[2] || "https://robossmaster-alqv.vercel.app";

let sessionCookie = "";
let passed = 0;
let failed = 0;
const errors: string[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e: any) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
    errors.push(`${name}: ${e.message}`);
  }
}

async function fetchAPI(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...options.headers as any,
      Cookie: sessionCookie,
    },
    redirect: "manual",
  });
  return res;
}

async function fetchJSON(path: string, options: RequestInit = {}) {
  const res = await fetchAPI(path, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// ===== LOGIN =====
async function login(email: string, password: string): Promise<string> {
  // Get CSRF
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  const csrfCookies = csrfRes.headers.getSetCookie?.() || [];
  const { csrfToken } = await csrfRes.json();

  // Login
  const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookies.join("; "),
    },
    body: new URLSearchParams({ csrfToken, email, password, callbackUrl: "/" }),
    redirect: "manual",
  });

  const cookies = loginRes.headers.getSetCookie?.() || [];
  return [...csrfCookies, ...cookies].join("; ");
}

async function main() {
  console.log(`\n🧪 E2E Testing: ${BASE}\n`);

  // ===== ADMIN LOGIN =====
  console.log("📋 Admin Login");
  await test("Admin login", async () => {
    sessionCookie = await login("admin@roboss.com", "Roboss2026!");
    if (!sessionCookie.includes("session-token")) throw new Error("No session token in cookies");
  });

  // ===== ADMIN DASHBOARD =====
  console.log("\n📋 Admin Dashboard");
  await test("GET /api/admin/dashboard", async () => {
    const data = await fetchJSON("/api/admin/dashboard");
    if (data.error) throw new Error(data.error);
  });

  // ===== BRANCHES =====
  console.log("\n📋 Branches");
  await test("GET /api/admin/branches", async () => {
    const data = await fetchJSON("/api/admin/branches");
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  let testBranchId = "";
  await test("POST /api/admin/branches (create test branch)", async () => {
    const data = await fetchJSON("/api/admin/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "สาขาทดสอบ E2E",
        address: "123 ถนนทดสอบ",
        phone: "0812345678",
        ownerName: "E2E Owner",
        ownerEmail: "e2e-branch@roboss.com",
        ownerPhone: "0899999999",
        initialInvestment: 500000,
        openDate: new Date().toISOString(),
      }),
    });
    if (data.error) throw new Error(data.error);
    testBranchId = data.branch?.id || data.id;
  });

  // ===== USERS =====
  console.log("\n📋 Users");
  await test("GET /api/admin/users", async () => {
    const data = await fetchJSON("/api/admin/users");
    if (!data.users) throw new Error("Expected users property");
  });

  let branchAdminId = "";
  // Branch admin already created by POST /api/admin/branches, skip separate create

  let investorId = "";
  await test("POST /api/admin/users (create investor)", async () => {
    const data = await fetchJSON("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "e2e-investor@roboss.com",
        password: "Test1234!",
        name: "E2E Investor",
        role: "INVESTOR",
      }),
    });
    if (data.error) throw new Error(data.error);
    investorId = data.id;
  });

  // ===== FINANCE =====
  console.log("\n📋 Finance");
  await test("GET /api/admin/finance", async () => {
    const data = await fetchJSON("/api/admin/finance");
    if (data.error) throw new Error(data.error);
  });

  // ===== WASH PACKAGES =====
  console.log("\n📋 Wash Packages");
  await test("GET /api/admin/wash-packages", async () => {
    const data = await fetchJSON("/api/admin/wash-packages");
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ===== ROI CONFIG =====
  console.log("\n📋 ROI Config");
  await test("GET /api/admin/roi-config", async () => {
    const data = await fetchJSON("/api/admin/roi-config");
    if (data.error) throw new Error(data.error);
  });

  // ===== SOP =====
  console.log("\n📋 SOP");
  await test("GET /api/sop", async () => {
    const data = await fetchJSON("/api/sop");
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ===== MANUALS =====
  console.log("\n📋 Manuals");
  await test("GET /api/manuals", async () => {
    const data = await fetchJSON("/api/manuals");
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ===== SERVICE TICKETS =====
  console.log("\n📋 Service Tickets");
  await test("GET /api/admin/service", async () => {
    const data = await fetchJSON("/api/admin/service");
    if (!Array.isArray(data)) throw new Error("Expected array");
  });

  // ===== NOTIFICATIONS =====
  console.log("\n📋 Notifications");
  await test("GET /api/admin/notifications", async () => {
    const data = await fetchJSON("/api/admin/notifications");
    if (data.error) throw new Error(data.error);
  });

  // ===== SITE CONFIG =====
  console.log("\n📋 Site Config");
  await test("GET /api/site-config", async () => {
    const data = await fetchJSON("/api/site-config");
    if (data.error) throw new Error(data.error);
  });

  // ===== BANNERS =====
  console.log("\n📋 Banners");
  await test("GET /api/admin/banners", async () => {
    const data = await fetchJSON("/api/admin/banners");
    if (data.error) throw new Error(data.error);
  });

  // ===== HR =====
  console.log("\n📋 HR");
  await test("GET /api/admin/hr", async () => {
    const data = await fetchJSON("/api/admin/hr");
    if (data.error) throw new Error(data.error);
  });

  // ============================================
  // BRANCH PORTAL
  // ============================================
  console.log("\n\n🏪 Branch Portal");
  console.log("📋 Branch Login");
  let branchPassword = "";
  // Get branch admin credentials from the branch creation response
  // We need to re-login as admin and check, or use the password from creation
  // For now, test with admin session since branch APIs check role=BRANCH_ADMIN or auth
  await test("Branch admin login", async () => {
    // Branch admin was created by POST /api/admin/branches with auto-generated password
    // We can't know the password, so let's reset it via admin API
    const adminCookie = await login("admin@roboss.com", "Roboss2026!");
    // Update branch admin password
    const usersRes = await fetch(`${BASE}/api/admin/users`, {
      headers: { Cookie: adminCookie },
    });
    const usersData = await usersRes.json();
    const branchAdmin = usersData.users?.find((u: any) => u.email === "e2e-branch@roboss.com");
    if (!branchAdmin) throw new Error("Branch admin not found");
    branchAdminId = branchAdmin.id;

    // Update password via PATCH
    const patchRes = await fetch(`${BASE}/api/admin/users`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({ id: branchAdminId, password: "Test1234!" }),
    });

    // Now login as branch admin
    sessionCookie = await login("e2e-branch@roboss.com", "Test1234!");
    if (!sessionCookie.includes("session-token")) throw new Error("No session token");
  });

  const bq = `branchId=${testBranchId}`;

  console.log("\n📋 Branch Dashboard");
  await test("GET /api/branch/dashboard", async () => {
    const data = await fetchJSON(`/api/branch/dashboard?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Wash");
  await test("GET /api/branch/wash", async () => {
    const data = await fetchJSON(`/api/branch/wash?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Income");
  await test("GET /api/branch/income", async () => {
    const data = await fetchJSON(`/api/branch/income?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Expense");
  await test("GET /api/branch/expense", async () => {
    const data = await fetchJSON(`/api/branch/expense?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Reports");
  await test("GET /api/branch/reports", async () => {
    const data = await fetchJSON(`/api/branch/reports?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch ROI");
  await test("GET /api/branch/roi", async () => {
    const data = await fetchJSON(`/api/branch/roi?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Employees");
  await test("GET /api/branch/employees", async () => {
    const data = await fetchJSON(`/api/branch/employees?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Attendance");
  await test("GET /api/branch/attendance", async () => {
    const data = await fetchJSON(`/api/branch/attendance?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Leave");
  await test("GET /api/branch/leave", async () => {
    const data = await fetchJSON(`/api/branch/leave?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Payroll");
  await test("GET /api/branch/payroll", async () => {
    const data = await fetchJSON(`/api/branch/payroll?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Notifications");
  await test("GET /api/branch/notifications", async () => {
    const data = await fetchJSON(`/api/branch/notifications?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  console.log("\n📋 Branch Service");
  await test("GET /api/branch/service", async () => {
    const data = await fetchJSON(`/api/branch/service?${bq}`);
    if (data.error) throw new Error(data.error);
  });

  // ============================================
  // INVESTOR PORTAL
  // ============================================
  console.log("\n\n💰 Investor Portal");
  console.log("📋 Investor Login");
  await test("Investor login", async () => {
    sessionCookie = await login("e2e-investor@roboss.com", "Test1234!");
    if (!sessionCookie.includes("session-token")) throw new Error("No session token");
  });

  console.log("\n📋 Investor Dashboard");
  await test("GET /api/investor/dashboard", async () => {
    const data = await fetchJSON("/api/investor/dashboard");
    if (data.error) throw new Error(data.error);
  });

  // ============================================
  // CLEANUP - delete test data
  // ============================================
  console.log("\n\n🧹 Cleanup");
  // Re-login as admin for cleanup
  sessionCookie = await login("admin@roboss.com", "Roboss2026!");

  if (investorId) {
    await test("DELETE test investor", async () => {
      const res = await fetchAPI(`/api/admin/users?id=${investorId}`, { method: "DELETE" });
    });
  }

  if (testBranchId) {
    await test("DELETE test branch (cascade deletes users + bank)", async () => {
      const res = await fetchAPI(`/api/admin/branches?id=${testBranchId}`, { method: "DELETE" });
    });
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🧪 E2E Results: ${passed} passed, ${failed} failed`);
  if (errors.length > 0) {
    console.log("\n❌ Failures:");
    errors.forEach((e) => console.log(`  - ${e}`));
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);

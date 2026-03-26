import { z } from "zod";

// ─── Shared helpers ───
const requiredString = (field: string) => z.string().min(1, `${field} is required`);
const optionalString = z.string().optional();
const optionalNumber = z.number().optional();
const positiveNumber = (field: string) => z.number().positive(`${field} must be positive`);

// ─── Admin Users ───
export const createUserSchema = z.object({
  name: requiredString("name"),
  email: z.string().email("Invalid email"),
  phone: optionalString,
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPER_ADMIN", "BRANCH_ADMIN", "INVESTOR"]),
  branchId: optionalString.nullable(),
});

export const updateUserSchema = z.object({
  id: requiredString("id"),
  name: optionalString,
  email: z.string().email("Invalid email").optional(),
  phone: optionalString,
  password: z.string().min(6).optional(),
  role: z.enum(["SUPER_ADMIN", "BRANCH_ADMIN", "INVESTOR"]).optional(),
  branchId: optionalString.nullable(),
});

// ─── Admin Branches ───
export const createBranchSchema = z.object({
  name: requiredString("name"),
  slug: requiredString("slug"),
  address: optionalString,
  phone: optionalString,
  lineChannelId: optionalString,
  lineChannelSecret: optionalString,
  initialInvestment: z.number().min(0).optional(),
  openDate: z.string().optional(),
  adminName: optionalString,
  adminEmail: z.string().email().optional(),
  adminPassword: z.string().min(6).optional(),
});

export const updateBranchSchema = z.object({
  id: requiredString("id"),
  name: optionalString,
  address: optionalString,
  phone: optionalString,
  lineChannelId: optionalString.nullable(),
  lineChannelSecret: optionalString.nullable(),
  isActive: z.boolean().optional(),
  initialInvestment: z.number().min(0).optional(),
  openDate: z.string().optional(),
});

// ─── Banners ───
export const createBannerSchema = z.object({
  title: requiredString("title"),
  imageUrl: requiredString("imageUrl"),
  linkUrl: optionalString,
  sortOrder: z.union([z.string(), z.number()]).optional(),
});

export const updateBannerSchema = z.object({
  id: requiredString("id"),
  title: optionalString,
  imageUrl: optionalString,
  linkUrl: optionalString,
  sortOrder: z.union([z.string(), z.number()]).optional(),
});

// ─── Notifications ───
export const createNotificationSchema = z.object({
  branchId: requiredString("branchId"),
  type: z.string().optional(),
  title: requiredString("title"),
  message: requiredString("message"),
});

// ─── Wash Packages (Global) ───
export const createWashPackageSchema = z.object({
  name: requiredString("name"),
  type: z.enum(["CAR", "BIKE", "HELMET"]),
  price: z.union([z.string(), z.number()]),
});

export const updateWashPackageSchema = z.object({
  id: requiredString("id"),
  name: optionalString,
  type: z.enum(["CAR", "BIKE", "HELMET"]).optional(),
  price: z.union([z.string(), z.number()]).optional(),
  isActive: z.boolean().optional(),
});

// ─── ROI Config ───
export const updateRoiConfigSchema = z.object({
  depreciationRate: z.number().min(0).max(100).optional(),
  adminFeePercent: z.number().min(0).max(100).optional(),
  targetRoiPercent: z.number().min(0).optional(),
  targetPaybackMonths: z.number().min(0).optional(),
  includePayrollInCost: z.boolean().optional(),
});

// ─── Site Config ───
export const updateSiteConfigSchema = z.object({
  logoUrl: optionalString,
  brandName: optionalString,
});

// ─── Service Tickets ───
export const updateServiceTicketSchema = z.object({
  id: requiredString("id"),
  status: z.enum(["OPEN", "IN_PROGRESS", "FIXED", "CLOSED"]).optional(),
  comment: optionalString,
  userId: optionalString,
});

// ─── Loyalty Config ───
export const updateLoyaltyConfigSchema = z.object({
  pointsPerBaht: z.union([z.string(), z.number()]).optional(),
  pointsExpireDays: z.union([z.string(), z.number()]).optional(),
  goldThreshold: z.union([z.string(), z.number()]).optional(),
  platinumThreshold: z.union([z.string(), z.number()]).optional(),
  goldMultiplier: z.union([z.string(), z.number()]).optional(),
  platinumMultiplier: z.union([z.string(), z.number()]).optional(),
  stampsForFreeWash: z.union([z.string(), z.number()]).optional(),
  heroImageUrl: optionalString,
  heroTitle: optionalString,
  heroSubtitle: optionalString,
  heroButtonText: optionalString,
});

// ─── Loyalty Coupons ───
export const createCouponTemplateSchema = z.object({
  name: requiredString("name"),
  description: optionalString,
  imageUrl: optionalString,
  type: z.enum(["PERCENT", "FIXED", "FREE_WASH"]),
  value: z.union([z.string(), z.number()]),
  pointsCost: z.union([z.string(), z.number()]),
  maxRedemptions: z.union([z.string(), z.number()]).optional().nullable(),
  validDays: z.union([z.string(), z.number()]).optional(),
  branchId: optionalString.nullable(),
  expiresAt: z.string().optional().nullable(),
});

export const updateCouponTemplateSchema = z.object({
  id: requiredString("id"),
  name: optionalString,
  description: optionalString,
  imageUrl: optionalString,
  type: z.enum(["PERCENT", "FIXED", "FREE_WASH"]).optional(),
  value: z.union([z.string(), z.number()]).optional(),
  pointsCost: z.union([z.string(), z.number()]).optional(),
  maxRedemptions: z.union([z.string(), z.number()]).optional().nullable(),
  validDays: z.union([z.string(), z.number()]).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
});

// ─── Branch: Income / Expense ───
export const createIncomeExpenseSchema = z.object({
  branchId: requiredString("branchId"),
  amount: z.union([z.string(), z.number()]),
  categoryId: optionalString.nullable(),
  description: optionalString,
  date: requiredString("date"),
  createdById: optionalString,
});

// ─── Branch: Employee ───
export const createEmployeeSchema = z.object({
  branchId: requiredString("branchId"),
  name: requiredString("name"),
  position: optionalString,
  phone: optionalString,
  email: optionalString,
  salary: z.union([z.string(), z.number()]).optional(),
  startDate: z.string().optional().nullable(),
});

// ─── Branch: Attendance ───
export const createAttendanceSchema = z.object({
  branchId: requiredString("branchId"),
  employeeId: requiredString("employeeId"),
  date: requiredString("date"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.enum(["PRESENT", "LATE", "ABSENT", "LEAVE"]).optional(),
});

// ─── Branch: Leave Request ───
export const createLeaveRequestSchema = z.object({
  branchId: requiredString("branchId"),
  employeeId: requiredString("employeeId"),
  type: z.enum(["SICK", "PERSONAL", "VACATION", "OTHER"]),
  startDate: requiredString("startDate"),
  endDate: requiredString("endDate"),
  reason: optionalString,
});

export const updateLeaveRequestSchema = z.object({
  id: requiredString("id"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  approvedById: optionalString,
});

// ─── Branch: Payroll ───
export const createPayrollSchema = z.object({
  branchId: requiredString("branchId"),
  employeeId: requiredString("employeeId"),
  month: z.union([z.string(), z.number()]),
  year: z.union([z.string(), z.number()]),
  baseSalary: z.union([z.string(), z.number()]).optional(),
  overtimePay: z.union([z.string(), z.number()]).optional(),
  deductions: z.union([z.string(), z.number()]).optional(),
});

export const updatePayrollSchema = z.object({
  id: requiredString("id"),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]),
});

// ─── Branch: Wash Record ───
export const createWashRecordSchema = z.object({
  branchId: requiredString("branchId"),
  packageId: optionalString,
  vehicleType: z.enum(["CAR", "BIKE", "HELMET"]),
  amount: z.union([z.string(), z.number()]),
  note: optionalString,
  createdById: optionalString,
  packageName: optionalString,
});

// ─── Branch: Service Ticket ───
export const createServiceTicketSchema = z.object({
  branchId: requiredString("branchId"),
  title: requiredString("title"),
  description: optionalString,
  category: optionalString,
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  machineModel: optionalString,
  images: z.any().optional(),
});

// ─── Branch: Notification PATCH ───
export const markNotificationReadSchema = z.object({
  id: optionalString,
  branchId: optionalString,
}).refine((d) => d.id || d.branchId, { message: "Either id or branchId is required" });

// ─── Branch: Theme ───
export const updateThemeSchema = z.object({
  branchId: requiredString("branchId"),
  primaryColor: optionalString,
  secondaryColor: optionalString,
  accentColor: optionalString,
  backgroundColor: optionalString,
  cardStyle: optionalString,
  borderRadius: optionalString,
  fontFamily: optionalString,
}).passthrough();

// ─── Branch: Loyalty Banners ───
export const createLoyaltyBannerSchema = z.object({
  branchId: requiredString("branchId"),
  title: requiredString("title"),
  subtitle: optionalString,
  imageUrl: requiredString("imageUrl"),
  linkUrl: optionalString,
  tag: optionalString,
});

export const updateLoyaltyBannerSchema = z.object({
  id: requiredString("id"),
  title: optionalString,
  subtitle: optionalString,
  imageUrl: optionalString,
  linkUrl: optionalString,
  tag: optionalString,
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

// ─── Branch: Wash Packages ───
export const createBranchWashPackageSchema = z.object({
  branchId: requiredString("branchId"),
  name: requiredString("name"),
  type: z.enum(["CAR", "BIKE", "HELMET"]),
  price: z.union([z.string(), z.number()]),
});

export const updateBranchWashPackageSchema = z.object({
  id: requiredString("id"),
  name: optionalString,
  type: z.enum(["CAR", "BIKE", "HELMET"]).optional(),
  price: z.union([z.string(), z.number()]).optional(),
  isActive: z.boolean().optional(),
});

// ─── Loyalty: Customers ───
export const createCustomerSchema = z.object({
  phone: z.string().min(9, "Phone must be at least 9 digits"),
  name: optionalString,
  lineId: optionalString.nullable(),
});

export const updateCustomerSchema = z.object({
  id: requiredString("id"),
  name: optionalString,
  phone: optionalString,
  profileImage: optionalString,
}).passthrough();

// ─── LINE Verify ───
export const lineVerifySchema = z.object({
  channelId: requiredString("channelId"),
  channelSecret: requiredString("channelSecret"),
});

// ─── Validate helper ───
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  const messages = result.error.issues.map((e: z.ZodIssue) => e.message).join(", ");
  return { success: false, error: messages };
}

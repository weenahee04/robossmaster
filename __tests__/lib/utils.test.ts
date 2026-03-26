import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, formatDateShort, generateSlug, generatePassword } from "@/lib/utils";

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});

describe("formatCurrency()", () => {
  it("formats positive number as Thai Baht", () => {
    const result = formatCurrency(1500);
    expect(result).toContain("1,500");
    expect(result).toContain("฿");
  });

  it("formats zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("formats decimal numbers", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("1,234.56");
  });

  it("formats negative numbers", () => {
    const result = formatCurrency(-500);
    expect(result).toContain("500");
  });
});

describe("formatDate()", () => {
  it("formats Date object", () => {
    const result = formatDate(new Date("2024-01-15"));
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("formats date string", () => {
    const result = formatDate("2024-06-01");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("formatDateShort()", () => {
  it("formats date in short format", () => {
    const result = formatDateShort(new Date("2024-01-15"));
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("short format is shorter than full format", () => {
    const date = new Date("2024-01-15");
    const full = formatDate(date);
    const short = formatDateShort(date);
    expect(short.length).toBeLessThanOrEqual(full.length);
  });
});

describe("generateSlug()", () => {
  it("converts English name to slug", () => {
    expect(generateSlug("My Branch")).toBe("my-branch");
  });

  it("handles Thai characters", () => {
    const slug = generateSlug("สาขา บางนา");
    expect(slug).toBe("สาขา-บางนา");
  });

  it("removes special characters", () => {
    expect(generateSlug("Branch #1 @test!")).toBe("branch-1-test");
  });

  it("trims leading/trailing hyphens", () => {
    expect(generateSlug("  hello world  ")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(generateSlug("a---b")).toBe("a-b");
  });

  it("generates fallback for empty string", () => {
    const slug = generateSlug("");
    expect(slug).toMatch(/^branch-/);
  });

  it("generates fallback for only special chars", () => {
    const slug = generateSlug("!@#$%^&*()");
    expect(slug).toMatch(/^branch-/);
  });
});

describe("generatePassword()", () => {
  it("generates password of default length 12", () => {
    const pw = generatePassword();
    expect(pw.length).toBe(12);
  });

  it("generates password of custom length", () => {
    const pw = generatePassword(20);
    expect(pw.length).toBe(20);
  });

  it("only contains allowed characters (no ambiguous chars)", () => {
    const allowed = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    const pw = generatePassword(100);
    for (const char of pw) {
      expect(allowed).toContain(char);
    }
  });

  it("generates different passwords each time", () => {
    const pw1 = generatePassword();
    const pw2 = generatePassword();
    // Extremely unlikely to be the same
    expect(pw1).not.toBe(pw2);
  });
});

import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "@/lib/encryption";

describe("encrypt() / decrypt()", () => {
  it("round-trip: encrypt then decrypt returns original text", () => {
    const original = "my-secret-channel-secret-12345";
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it("encrypted text contains 3 base64 parts separated by colons", () => {
    const encrypted = encrypt("test");
    const parts = encrypted.split(":");
    expect(parts.length).toBe(3);
    // Each part should be valid base64
    parts.forEach((part) => {
      expect(() => Buffer.from(part, "base64")).not.toThrow();
    });
  });

  it("same plaintext produces different ciphertext each time (random IV)", () => {
    const text = "same-input";
    const enc1 = encrypt(text);
    const enc2 = encrypt(text);
    expect(enc1).not.toBe(enc2);
    // But both should decrypt to the same value
    expect(decrypt(enc1)).toBe(text);
    expect(decrypt(enc2)).toBe(text);
  });

  it("decrypt returns plain text as-is when no colons (migration compatibility)", () => {
    const plainText = "plain-secret-without-encryption";
    expect(decrypt(plainText)).toBe(plainText);
  });

  it("decrypt returns text as-is when format is wrong (not 3 parts)", () => {
    const badFormat = "part1:part2";
    expect(decrypt(badFormat)).toBe(badFormat);
  });

  it("handles empty string", () => {
    const encrypted = encrypt("");
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe("");
  });

  it("handles unicode characters", () => {
    const text = "ข้อมูลลับ 🔐 秘密";
    const encrypted = encrypt(text);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(text);
  });

  it("handles long strings", () => {
    const text = "a".repeat(10000);
    const encrypted = encrypt(text);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(text);
  });
});

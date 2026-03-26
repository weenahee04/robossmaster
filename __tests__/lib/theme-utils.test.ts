import { describe, it, expect } from "vitest";
import { getBorderRadius, getCardStyle, getButtonStyle, getHeaderStyle, defaultStyles, type ThemeStyles } from "@/lib/theme-utils";

const theme: ThemeStyles = { ...defaultStyles };

describe("getBorderRadius()", () => {
  it("returns correct class for sharp style", () => {
    expect(getBorderRadius("sharp", "sm")).toBe("rounded-none");
    expect(getBorderRadius("sharp", "lg")).toBe("rounded");
  });

  it("returns correct class for rounded style", () => {
    expect(getBorderRadius("rounded", "sm")).toBe("rounded-lg");
    expect(getBorderRadius("rounded", "xl")).toBe("rounded-3xl");
  });

  it("returns correct class for pill style", () => {
    expect(getBorderRadius("pill", "xl")).toBe("rounded-full");
  });

  it("defaults to lg size when no size given", () => {
    expect(getBorderRadius("rounded")).toBe("rounded-2xl");
  });

  it("falls back to rounded style for unknown style", () => {
    expect(getBorderRadius("unknown", "sm")).toBe("rounded-lg");
  });
});

describe("getCardStyle()", () => {
  it("returns glass style with backdrop filter", () => {
    const style = getCardStyle("glass", theme);
    expect(style.backdropFilter).toBe("blur(12px)");
  });

  it("returns solid style", () => {
    const style = getCardStyle("solid", theme);
    expect(style.background).toBe(theme.surfaceColor);
  });

  it("returns outline style with transparent bg", () => {
    const style = getCardStyle("outline", theme);
    expect(style.background).toBe("transparent");
    expect(style.border).toBeDefined();
  });

  it("returns gradient style", () => {
    const style = getCardStyle("gradient", theme);
    expect(style.background).toContain("linear-gradient");
  });

  it("returns default for unknown style", () => {
    const style = getCardStyle("unknown", theme);
    expect(style.background).toBeDefined();
  });
});

describe("getButtonStyle()", () => {
  it("returns gradient style", () => {
    const style = getButtonStyle("gradient", theme);
    expect(style.background).toContain("linear-gradient");
  });

  it("returns solid style", () => {
    const style = getButtonStyle("solid", theme);
    expect(style.background).toBe(theme.primaryColor);
  });

  it("returns outline style", () => {
    const style = getButtonStyle("outline", theme);
    expect(style.background).toBe("transparent");
    expect(style.border).toContain(theme.primaryColor);
    expect(style.color).toBe(theme.primaryColor);
  });

  it("returns glow style with box shadow", () => {
    const style = getButtonStyle("glow", theme);
    expect(style.boxShadow).toBeDefined();
  });

  it("returns default gradient for unknown style", () => {
    const style = getButtonStyle("unknown", theme);
    expect(style.background).toContain("linear-gradient");
  });
});

describe("getHeaderStyle()", () => {
  it("returns gradient style", () => {
    const style = getHeaderStyle("gradient", theme);
    expect(style.background).toContain("linear-gradient");
  });

  it("returns solid style", () => {
    const style = getHeaderStyle("solid", theme);
    expect(style.background).toBe(theme.primaryColor);
  });

  it("returns transparent for minimal style", () => {
    const style = getHeaderStyle("minimal", theme);
    expect(style.background).toBe("transparent");
  });

  it("returns image background when bannerUrl exists", () => {
    const t = { ...theme, bannerUrl: "https://example.com/banner.jpg" };
    const style = getHeaderStyle("image", t);
    expect(style.backgroundImage).toContain("https://example.com/banner.jpg");
  });

  it("falls back to gradient when image style but no bannerUrl", () => {
    const style = getHeaderStyle("image", theme);
    expect(style.background).toContain("linear-gradient");
  });
});

describe("defaultStyles", () => {
  it("has all required fields", () => {
    expect(defaultStyles.primaryColor).toBeDefined();
    expect(defaultStyles.secondaryColor).toBeDefined();
    expect(defaultStyles.backgroundColor).toBeDefined();
    expect(defaultStyles.surfaceColor).toBeDefined();
    expect(defaultStyles.textColor).toBeDefined();
    expect(defaultStyles.fontFamily).toBe("Kanit");
    expect(defaultStyles.templateId).toBe("classic");
  });
});

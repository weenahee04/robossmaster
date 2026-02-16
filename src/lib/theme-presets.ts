export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  accentColor: string;
  portalPrimary: string;
  portalBg: string;
  fontFamily: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: "roboss-classic",
    name: "Roboss Classic",
    description: "ดำ-แดง สไตล์ดั้งเดิม",
    primaryColor: "#FF4B5C",
    secondaryColor: "#D62D42",
    backgroundColor: "#000000",
    surfaceColor: "#111111",
    textColor: "#FFFFFF",
    accentColor: "#F9D423",
    portalPrimary: "#CC0000",
    portalBg: "#FFFFFF",
    fontFamily: "Kanit",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "น้ำเงินเข้ม สะอาดสดใส",
    primaryColor: "#3B82F6",
    secondaryColor: "#2563EB",
    backgroundColor: "#0F172A",
    surfaceColor: "#1E293B",
    textColor: "#F8FAFC",
    accentColor: "#38BDF8",
    portalPrimary: "#2563EB",
    portalBg: "#FFFFFF",
    fontFamily: "Kanit",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    description: "เขียวธรรมชาติ สดชื่น",
    primaryColor: "#10B981",
    secondaryColor: "#059669",
    backgroundColor: "#064E3B",
    surfaceColor: "#065F46",
    textColor: "#F0FDF4",
    accentColor: "#6EE7B7",
    portalPrimary: "#059669",
    portalBg: "#FFFFFF",
    fontFamily: "Kanit",
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    description: "ม่วงหรูหรา พรีเมียม",
    primaryColor: "#8B5CF6",
    secondaryColor: "#7C3AED",
    backgroundColor: "#1E1B4B",
    surfaceColor: "#312E81",
    textColor: "#F5F3FF",
    accentColor: "#C4B5FD",
    portalPrimary: "#7C3AED",
    portalBg: "#FFFFFF",
    fontFamily: "Kanit",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    description: "ส้มอุ่น พลังงานสูง",
    primaryColor: "#F97316",
    secondaryColor: "#EA580C",
    backgroundColor: "#1C1917",
    surfaceColor: "#292524",
    textColor: "#FFF7ED",
    accentColor: "#FBBF24",
    portalPrimary: "#EA580C",
    portalBg: "#FFFFFF",
    fontFamily: "Kanit",
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    description: "ขาวสะอาด มินิมอล",
    primaryColor: "#CC0000",
    secondaryColor: "#EF4444",
    backgroundColor: "#FFFFFF",
    surfaceColor: "#F8FAFC",
    textColor: "#0F172A",
    accentColor: "#EF4444",
    portalPrimary: "#CC0000",
    portalBg: "#FFFFFF",
    fontFamily: "Kanit",
  },
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    description: "ดำ-ทอง หรูหราระดับพรีเมียม",
    primaryColor: "#D4AF37",
    secondaryColor: "#B8860B",
    backgroundColor: "#0A0A0A",
    surfaceColor: "#1A1A1A",
    textColor: "#FFFBEB",
    accentColor: "#FFD700",
    portalPrimary: "#B8860B",
    portalBg: "#FFFFFF",
    fontFamily: "Kanit",
  },
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    description: "ชมพูหวาน น่ารักสดใส",
    primaryColor: "#EC4899",
    secondaryColor: "#DB2777",
    backgroundColor: "#1A1A2E",
    surfaceColor: "#16213E",
    textColor: "#FDF2F8",
    accentColor: "#F9A8D4",
    portalPrimary: "#DB2777",
    portalBg: "#FFFFFF",
    fontFamily: "Kanit",
  },
];

export const fontOptions = [
  { value: "Kanit", label: "Kanit", url: "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" },
  { value: "Prompt", label: "Prompt", url: "https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" },
  { value: "Sarabun", label: "Sarabun", url: "https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" },
  { value: "Noto Sans Thai", label: "Noto Sans Thai", url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" },
];

export const defaultTheme: ThemePreset = themePresets[0];

// ===== Layout Templates =====

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // emoji or icon for preview
  features: string[];
}

export const layoutTemplates: LayoutTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "แบบดั้งเดิม — การ์ดแต้ม + แถบเมนูล่าง",
    thumbnail: "🏠",
    features: ["Stamp Card แนวนอน", "Bottom Nav 5 แท็บ", "Header gradient", "Card แบบ glass"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "โมเดิร์นมินิมอล — เน้นพื้นที่โล่ง สะอาดตา",
    thumbnail: "✨",
    features: ["Stamp Card แบบวงกลม", "Bottom Nav แบบ floating", "Header minimal", "Card แบบ outline"],
  },
  {
    id: "premium",
    name: "Premium",
    description: "หรูหรา — gradient ทอง เอฟเฟกต์เรืองแสง",
    thumbnail: "👑",
    features: ["Stamp Card แบบ premium gold", "Bottom Nav แบบ glow", "Header แบบ image overlay", "Card แบบ gradient"],
  },
  {
    id: "playful",
    name: "Playful",
    description: "สนุกสดใส — มุมโค้งมน สีสดใส",
    thumbnail: "🎨",
    features: ["Stamp Card แบบ bubble", "Bottom Nav แบบ pill สี", "Header แบบ wave", "Card แบบ solid สีสด"],
  },
];

// ===== Skin Options =====

export interface SkinOption {
  key: string;
  label: string;
  options: { value: string; label: string; preview?: string }[];
}

export const skinOptions: SkinOption[] = [
  {
    key: "borderRadius",
    label: "มุมขอบ",
    options: [
      { value: "sharp", label: "เหลี่ยม", preview: "rounded-none" },
      { value: "rounded", label: "มน", preview: "rounded-xl" },
      { value: "pill", label: "โค้งมาก", preview: "rounded-3xl" },
    ],
  },
  {
    key: "cardStyle",
    label: "สไตล์การ์ด",
    options: [
      { value: "glass", label: "Glass (โปร่งแสง)" },
      { value: "solid", label: "Solid (ทึบ)" },
      { value: "outline", label: "Outline (เส้นขอบ)" },
      { value: "gradient", label: "Gradient (ไล่สี)" },
    ],
  },
  {
    key: "navStyle",
    label: "แถบเมนูล่าง",
    options: [
      { value: "pill", label: "Pill (แคปซูล)" },
      { value: "underline", label: "Underline (ขีดเส้น)" },
      { value: "icon-only", label: "Icon Only (ไอคอนเท่านั้น)" },
      { value: "floating", label: "Floating (ลอย)" },
    ],
  },
  {
    key: "buttonStyle",
    label: "สไตล์ปุ่ม",
    options: [
      { value: "gradient", label: "Gradient (ไล่สี)" },
      { value: "solid", label: "Solid (ทึบ)" },
      { value: "outline", label: "Outline (เส้นขอบ)" },
      { value: "glow", label: "Glow (เรืองแสง)" },
    ],
  },
  {
    key: "headerStyle",
    label: "สไตล์หัวข้อ",
    options: [
      { value: "gradient", label: "Gradient (ไล่สี)" },
      { value: "solid", label: "Solid (ทึบ)" },
      { value: "minimal", label: "Minimal (เรียบ)" },
      { value: "image", label: "Image (รูปภาพ)" },
    ],
  },
];

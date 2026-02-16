// Utility functions for dynamic theme styling

export interface ThemeStyles {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  templateId: string;
  borderRadius: string;
  cardStyle: string;
  navStyle: string;
  buttonStyle: string;
  headerStyle: string;
  logoUrl?: string | null;
  brandName?: string | null;
  tagline?: string | null;
  bannerUrl?: string | null;
  backgroundImage?: string | null;
}

export const defaultStyles: ThemeStyles = {
  primaryColor: "#FF4B5C",
  secondaryColor: "#D62D42",
  backgroundColor: "#000000",
  surfaceColor: "#111111",
  textColor: "#FFFFFF",
  accentColor: "#F9D423",
  fontFamily: "Kanit",
  templateId: "classic",
  borderRadius: "rounded",
  cardStyle: "glass",
  navStyle: "pill",
  buttonStyle: "gradient",
  headerStyle: "gradient",
};

// Border radius mapping
export function getBorderRadius(style: string, size: "sm" | "md" | "lg" | "xl" = "lg") {
  const map: Record<string, Record<string, string>> = {
    sharp: { sm: "rounded-none", md: "rounded-sm", lg: "rounded", xl: "rounded-md" },
    rounded: { sm: "rounded-lg", md: "rounded-xl", lg: "rounded-2xl", xl: "rounded-3xl" },
    pill: { sm: "rounded-2xl", md: "rounded-3xl", lg: "rounded-[2rem]", xl: "rounded-full" },
  };
  return map[style]?.[size] || map.rounded[size];
}

// Card style CSS
export function getCardStyle(style: string, t: ThemeStyles): React.CSSProperties {
  switch (style) {
    case "glass":
      return { background: `${t.surfaceColor}CC`, backdropFilter: "blur(12px)", border: `1px solid ${t.textColor}10` };
    case "solid":
      return { background: t.surfaceColor };
    case "outline":
      return { background: "transparent", border: `2px solid ${t.primaryColor}40` };
    case "gradient":
      return { background: `linear-gradient(135deg, ${t.surfaceColor}, ${t.primaryColor}20)` };
    default:
      return { background: `${t.surfaceColor}CC` };
  }
}

// Button style CSS
export function getButtonStyle(style: string, t: ThemeStyles): React.CSSProperties {
  switch (style) {
    case "gradient":
      return { background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` };
    case "solid":
      return { background: t.primaryColor };
    case "outline":
      return { background: "transparent", border: `2px solid ${t.primaryColor}`, color: t.primaryColor };
    case "glow":
      return { background: t.primaryColor, boxShadow: `0 0 20px ${t.primaryColor}60, 0 0 40px ${t.primaryColor}30` };
    default:
      return { background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` };
  }
}

// Header style CSS
export function getHeaderStyle(style: string, t: ThemeStyles): React.CSSProperties {
  switch (style) {
    case "gradient":
      return { background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` };
    case "solid":
      return { background: t.primaryColor };
    case "minimal":
      return { background: "transparent" };
    case "image":
      return t.bannerUrl
        ? { backgroundImage: `url(${t.bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
        : { background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` };
    default:
      return { background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})` };
  }
}

import { NextResponse } from "next/server";
import { themePresets, fontOptions, layoutTemplates, skinOptions } from "@/lib/theme-presets";

// GET — return all preset themes, templates, skins, fonts
export async function GET() {
  return NextResponse.json({ presets: themePresets, fonts: fontOptions, templates: layoutTemplates, skins: skinOptions });
}

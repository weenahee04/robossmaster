import { NextResponse } from "next/server";
import { themePresets, fontOptions } from "@/lib/theme-presets";

// GET — return all preset themes (public)
export async function GET() {
  return NextResponse.json({ presets: themePresets, fonts: fontOptions });
}

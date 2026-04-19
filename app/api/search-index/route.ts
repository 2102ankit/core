import { getSiteSearchEntries } from "@/lib/site-search";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(getSiteSearchEntries());
}


import { NextResponse } from "next/server";
import demoData from "@/data/chat.json";

export async function GET() {
  return NextResponse.json(demoData);
}

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();

    if (!sql) {
      return NextResponse.json([]);
    }

    const data = await sql`SELECT * FROM projects ORDER BY week_number ASC`;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Projects GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

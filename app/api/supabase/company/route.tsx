import { db } from "@/app/db/index";
import { profiles, company_table } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Join profiles with company_table to get company info
    const result = await db
      .select({
        title: company_table.title,
        description: company_table.description,
      })
      .from(profiles)
      .leftJoin(company_table, eq(profiles.company_id, company_table.id))
      .where(eq(profiles.id, parseInt(userId)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({
        title: "A Visual Interactive Experience",
        description: "Change the way you engage with educational content",
      });
    }

    return NextResponse.json({
      title: result[0].title || "A Visual Interactive Experience",
      description:
        result[0].description ||
        "Change the way you engage with educational content",
    });
  } catch (error) {
    console.error("Error fetching company info:", error);
    return NextResponse.json(
      { error: "Failed to fetch company info" },
      { status: 500 }
    );
  }
}

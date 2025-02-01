import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { db } from "@/app/db/index";
import { NextResponse } from "next/server";
import { company_table, experience, profiles } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get("experienceId");
    const userId = searchParams.get("userId");

    if (!experienceId || !userId) {
      return NextResponse.json(
        { error: "Experience ID and User ID are required" },
        { status: 400 }
      );
    }

    // First get the profile ID using the user ID
    const profileResult = await db
      .select({ id: profiles.id, company_id: profiles.company_id })
      .from(profiles)
      .where(eq(profiles.user_id, userId))
      .limit(1);

    if (!profileResult.length) {
      return NextResponse.json(
        { bucket_name: "experience-videos" }, // Default bucket if no profile found
        { status: 200 }
      );
    }

    // If profile has a company, get company's bucket name
    if (profileResult[0].company_id) {
      const companyResult = await db
        .select({ bucket_name: company_table.bucket_name })
        .from(company_table)
        .where(eq(company_table.id, profileResult[0].company_id))
        .limit(1);

      if (companyResult.length) {
        return NextResponse.json(
          { bucket_name: companyResult[0].bucket_name || "experience-videos" },
          { status: 200 }
        );
      }
    }

    // Default response if no company found or no bucket specified
    return NextResponse.json(
      { bucket_name: "experience-videos" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bucket name:", error);
    return NextResponse.json(
      { error: "Failed to fetch bucket name" },
      { status: 500 }
    );
  }
}

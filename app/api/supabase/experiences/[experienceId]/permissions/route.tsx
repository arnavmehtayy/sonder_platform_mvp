import { db } from "@/app/db/index";
import { experience, profiles } from "@/app/db/schema";
import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { experienceId: string } }
) {
  try {
    const supabase = await createClient();
    const experienceId = parseInt(params.experienceId);

    // Get experience details with creator profile
    const [experienceDetails] = await db
      .select({
        userId: experience.user_id,
        creatorProfile: profiles,
      })
      .from(experience)
      .leftJoin(profiles, eq(experience.user_id, profiles.id))
      .where(eq(experience.id, experienceId));

    if (!experienceDetails) {
      return NextResponse.json({ hasAccess: false, isEditor: false });
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If creator has no company, allow public access
    if (!experienceDetails.creatorProfile?.company_id) {
      return NextResponse.json({ 
        hasAccess: true,
        isEditor: user?.id === experienceDetails.creatorProfile?.user_id
      });
    }

    // For authenticated users
    if (!authError && user) {
      // Get user profile
      const [userProfile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.user_id, user.id));

      if (!userProfile) {
        return NextResponse.json({ hasAccess: false, isEditor: false });
      }

      // User is the creator
      if (experienceDetails.userId === userProfile.id) {
        return NextResponse.json({ hasAccess: true, isEditor: true });
      }

      // User is from same company
      if (userProfile.company_id === experienceDetails.creatorProfile?.company_id) {
        return NextResponse.json({ hasAccess: true, isEditor: false });
      }
    }

    return NextResponse.json({ hasAccess: false, isEditor: false });

  } catch (error) {
    console.error("Error checking permissions:", error);
    return NextResponse.json(
      { error: "Failed to check permissions" },
      { status: 500 }
    );
  }
}
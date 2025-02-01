import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";
import { ExperienceVideo, company_table } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { experience } from "@/app/db/schema";
import { profiles } from "@/app/db/schema";
import { db } from "@/app/db/index";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received body:", body);

    const { experienceId, index, filePath } = body;

    // More detailed validation
    if (!experienceId) {
      return NextResponse.json(
        { error: "experienceId is required" },
        { status: 400 }
      );
    }
    if (index === undefined || index === null) {
      return NextResponse.json({ error: "index is required" }, { status: 400 });
    }
    if (!filePath) {
      return NextResponse.json(
        { error: "filePath is required" },
        { status: 400 }
      );
    }

    // Get the company bucket name by joining necessary tables
    const result = await db
      .select({
        video_path: ExperienceVideo.videoPath,
        bucket_name: company_table.bucket_name,
      })
      .from(experience)
      .leftJoin(profiles, eq(experience.user_id, profiles.id))
      .leftJoin(company_table, eq(profiles.company_id, company_table.id))
      .leftJoin(
        ExperienceVideo,
        and(
          eq(ExperienceVideo.experienceId, experience.id),
          eq(ExperienceVideo.index, index)
        )
      )
      .where(eq(experience.id, parseInt(experienceId)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    const bucketName = result[0].bucket_name || "experience-videos";
    const existingVideoPath = result[0].video_path;

    const supabase = await createClient();

    // If exists, delete old file
    if (existingVideoPath) {
      await supabase.storage.from(bucketName).remove([existingVideoPath]);

      // Delete the database record
      await db
        .delete(ExperienceVideo)
        .where(
          and(
            eq(ExperienceVideo.experienceId, parseInt(experienceId)),
            eq(ExperienceVideo.index, index)
          )
        );
    }

    // Insert new database record
    await db.insert(ExperienceVideo).values({
      experienceId: parseInt(experienceId),
      index: index,
      videoPath: filePath,
    });

    return NextResponse.json({
      success: true,
      videoPath: filePath,
      bucket_name: bucketName,
    });
  } catch (error) {
    console.error("Error handling video:", error);
    return NextResponse.json(
      { error: "Failed to process video" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get("experienceId");
    const index = searchParams.get("index");

    if (!experienceId || !index) {
      return NextResponse.json(
        { error: "Experience ID and index are required" },
        { status: 400 }
      );
    }

    // Join experience with profiles and company to get the bucket name
    const result = await db
      .select({
        video_path: ExperienceVideo.videoPath,
        bucket_name: company_table.bucket_name,
      })
      .from(ExperienceVideo)
      .innerJoin(experience, eq(ExperienceVideo.experienceId, experience.id))
      .innerJoin(profiles, eq(experience.user_id, profiles.id))
      .leftJoin(company_table, eq(profiles.company_id, company_table.id))
      .where(
        and(
          eq(ExperienceVideo.experienceId, parseInt(experienceId)),
          eq(ExperienceVideo.index, parseInt(index))
        )
      )
      .limit(1);

    const video = result[0];

    return NextResponse.json({
      video_path: video?.video_path || null,
      bucket_name: video?.bucket_name || "experience-videos", // Default bucket if no company bucket
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

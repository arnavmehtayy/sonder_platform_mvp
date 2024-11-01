import { NextResponse } from "next/server";
import {
  saveStateToDatabase,
  loadStateFromDatabase,
} from "@/app/api/supabase/databaseFunctions";
import {
  SerializeStateInsert,
  SerializeStateSelect,
} from "@/classes/database/Serializtypes";

export async function POST(request: Request) {
  const {
    exp_title,
    profileId,
    exp_desc,
    experienceId,
    state,
    index
  }: {
    exp_title: string;
    profileId: number;
    exp_desc: string;
    experienceId: number;
    state: SerializeStateInsert;
    index: number
  } = await request.json();
  // console.log(state)
  try {
    await saveStateToDatabase(experienceId, profileId, state, exp_desc, exp_title, index);
    return NextResponse.json({ message: "State saved successfully" });
  } catch (error) {
    console.error("Error saving state:", error);
    return NextResponse.json(
      { error: "Failed to save state" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const experienceId = searchParams.get("experienceId");
  const index = searchParams.get("index");

  if (!experienceId || !index) {
    return NextResponse.json(
      { error: "Experience ID and index are required" },
      { status: 400 }
    );
  }

  

  try {
    const loadedState: SerializeStateSelect  = await loadStateFromDatabase(
      parseInt(experienceId),
      parseInt(index)
    );
    // console.log(experienceId, index, loadedState)
    return NextResponse.json(loadedState);
  } catch (error) {
    console.error("Error loading state:", error);
    return NextResponse.json(
      { error: "Failed to load state" },
      { status: 500 }
    );
  }
}

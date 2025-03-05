import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/app/store";
import { createClient } from "@/app/utils/supabase/client";
import { serializeState } from "@/classes/database/stateSerializer";
import { toast } from "sonner";
import { useParams } from "next/navigation";

// A curved back button that takes the user back to the experiences page from each slide of a viztool

const CurvedBackButton = () => {
  const [isSaving, setIsSaving] = useState(false);
  const params = useParams();
  const isEditMode = useStore((state) => state.isEditMode);

  const handleBack = async () => {
    // Navigate first, then save in the background
    // We don't need to set isSaving since we're navigating away immediately

    try {
      // Only save if in edit mode
      if (isEditMode) {
        // Get the experience ID and index from URL params
        const experienceId = Number(params.ExpID);
        const index = Number(params.index);

        // Save state in the background
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.log("User not logged in, skipping save");
        } else {
          // Fetch profile using the user ID
          const profileResponse = await fetch(
            `/api/supabase/profile?userId=${user.id}`
          );

          if (profileResponse.ok) {
            const profile = await profileResponse.json();
            const state = useStore.getState();
            const serializedState = serializeState(state);

            const response = await fetch("/api/supabase/DataBaseAPI", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                state: serializedState,
                profileId: profile.id,
                experienceId: experienceId,
                index: index,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to save state");
            }

            toast.success("State saved successfully");
          }
        }
      }

      // Clear the state
      useStore.setState({
        order: [],
        vizobjs: {},
        title: "",
        questions: {},
        controls: {},
        placement: {},
        scores: {},
        validations: [],
        influenceAdvIndex: {},
      });
    } catch (error) {
      console.error("Error saving state:", error);
      toast.error("Failed to save state");
    }
  };

  return (
    <Link
      href="/" // link to the main page
      onClick={handleBack}
      className="absolute top-2 left-2 z-10 w-20 h-20 bg-black bg-opacity-20 rounded-full flex items-center justify-center text-blue-100 hover:bg-opacity-40 hover:text-white transition-all duration-300 group"
      title="Back to Experiences"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10 transform group-hover:scale-110 transition-transform duration-300"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </Link>
  );
};

export default CurvedBackButton;

"use client";
import { useState, useEffect } from "react";
import { Minigame } from "@/app/Components/Sidebar/Minigame";
import { experiences } from "@/classes/Data/CompleteData";
import CurvedBackButton from "@/app/Components/three/BackButton";
import { useParams, useRouter } from "next/navigation";
import { FeedbackComponent } from "@/app/Components/MainMenu/FeedbackComponent";
import "@/app/TutorialOverlay.css";
import { deserializeState } from "@/classes/database/stateSerializer";
import { useStore } from "@/app/store";
import { MinigameDB } from "@/app/Components/Sidebar/MinigameDB";
import { MobileMinigameDB } from "@/app/Components/MainMenu/Mobile/MobileMinigameDB";
import { LoadingScreen } from "@/app/Components/MainMenu/LoadingScreen";
import { VideoPlayer } from "@/app/Components/MainMenu/VideoPlayer";
import { Analytics } from "@vercel/analytics/react";
import { track } from "@vercel/analytics";
import { useMediaQuery } from "@/app/Components/MainMenu/useMediaQuery";
import { createClient } from "@/app/utils/supabase/client";
import { toast } from "sonner";

const resetState = () => {
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
};

const handleLoadState = async (experienceId: number, index: number) => {
  try {
    const response = await fetch(
      `/api/supabase/DataBaseAPI?experienceId=${experienceId}&index=${index}`
    );
    if (!response.ok) {
      throw new Error("Failed to load state");
    }
    const serializedState = await response.json();
    const loadedState = deserializeState(serializedState);
    useStore.setState(loadedState);
  } catch (error) {
    console.error("Error loading state:", error);
  }
};

export default function ExperiencePage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const experienceId = Number(params.ExpID);
        const index = Number(params.index);

        // Auth check
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        // Check experience permissions
        const response = await fetch(
          `/api/supabase/experiences/${experienceId}/permissions`
        );
        const { hasAccess } = await response.json();

        if (!hasAccess) {
          toast.error("You don't have permission to access this experience");
          router.push("/");
          return;
        }

        // Track page visit
        track("visit_experience", {
          experienceId,
          index,
          path: window.location.pathname,
          device: isMobile ? "mobile" : "desktop",
        });

        await handleLoadState(experienceId, index);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load experience");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params, router, isMobile]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-[100dvh] bg-black">
        <div className="absolute top-[calc(env(safe-area-inset-top)+1rem)] left-4 z-[100]">
          <CurvedBackButton />
        </div>
        <div className="relative h-full w-full">
          <MobileMinigameDB
            experienceID={Number(params.ExpID)}
            index={Number(params.index)}
          />
        </div>
        <Analytics />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow relative">
        <div className="absolute top-4 left-4 z-[100]">
          <CurvedBackButton />
        </div>

        <MinigameDB
          experienceID={Number(params.ExpID)}
          index={Number(params.index)}
        />
        <FeedbackComponent />
      </div>
    </div>
  );
}

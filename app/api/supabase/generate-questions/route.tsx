import { NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { db } from "@/app/db/index";
import {
  ExperienceVideo,
  experience,
  profiles,
  company_table,
} from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { experienceId, index, description, questionType } =
      await request.json();

    if (!experienceId || index === undefined) {
      return NextResponse.json(
        { error: "Experience ID and index are required" },
        { status: 400 }
      );
    }

    // Get video information from database
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
          eq(ExperienceVideo.experienceId, parseInt(experienceId.toString())),
          eq(ExperienceVideo.index, parseInt(index.toString()))
        )
      )
      .limit(1);

    if (!result.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const video = result[0];
    const bucketName = video.bucket_name || "experience-videos";

    // Get the video file from Supabase storage
    const supabase = await createClient();
    const { data: fileData, error: fileError } = await supabase.storage
      .from(bucketName)
      .download(video.video_path);

    if (fileError || !fileData) {
      console.error("Error downloading video:", fileError);
      return NextResponse.json(
        { error: "Failed to download video" },
        { status: 500 }
      );
    }

    // Detect file extension to help with format identification
    const fileExtension = video.video_path.split(".").pop()?.toLowerCase();
    console.log(`File extension: ${fileExtension}`);

    // Try multiple formats to find one that works with Whisper
    const formatsToTry = [
      { name: "audio.mp3", type: "audio/mpeg" },
      { name: "audio.mp4", type: "audio/mp4" },
      { name: "audio.m4a", type: "audio/mp4" },
      { name: "audio.webm", type: "audio/webm" },
    ];

    // For QuickTime files, prioritize mp4 which is most likely to work
    if (fileExtension === "mov" || fileExtension === "qt") {
      formatsToTry.unshift({ name: "audio.mp4", type: "audio/mp4" });
    }

    let transcript = ""; // Default to empty transcript

    // Try each format until one works
    for (const format of formatsToTry) {
      try {
        console.log(`Trying format: ${format.name} (${format.type})`);
        const blob = new Blob([fileData], { type: format.type });
        const file = new File([blob], format.name, { type: format.type });

        console.log(`File created: ${format.name}, size: ${file.size} bytes`);

        const transcriptionResponse = await openai.audio.transcriptions.create({
          file: file,
          model: "whisper-1",
        });

        transcript = transcriptionResponse.text;
        console.log(`Transcription succeeded with format: ${format.name}`);
        break; // Exit the loop if transcription succeeds
      } catch (error) {
        console.error(
          `Transcription failed with format ${format.name}:`,
          error
        );
        // Continue to the next format
      }
    }

    // If all formats failed, continue with empty transcript
    if (!transcript) {
      console.log(
        "All transcription formats failed. Continuing with empty transcript."
      );
      transcript = ""; // Ensure transcript is an empty string
    }

    // Generate a title based on the transcript (or a default if transcript is empty)
    const titleCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an educational content creator. Based on the transcript of a video, create a concise, engaging title that summarizes the main topic.`,
        },
        {
          role: "user",
          content: transcript
            ? `Here is the transcript of an educational video: "${transcript}". Please generate a title for this content. Please only return the title, no other text or quotations or markdown.`
            : `Please generate a generic title for an educational module. Please only return the title, no other text or quotations or markdown.`,
        },
      ],
    });

    const title =
      titleCompletion.choices[0].message.content || "Educational Module";

    // Define system prompt and tools based on question type
    let systemPrompt = "";
    let tools: any[] = [];
    let functionName = "";

    if (questionType === "multichoice") {
      systemPrompt = `You are an educational content creator. Based on the transcript of a video, create one multiple-choice question with 4 options.`;
      functionName = "createMultipleChoiceQuestion";
      tools = [
        {
          type: "function",
          function: {
            name: functionName,
            description: "Create a multiple-choice question with options",
            parameters: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                  description: "The question text",
                },
                options: {
                  type: "array",
                  description: "The answer options",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description: "Unique identifier for the option",
                      },
                      label: {
                        type: "string",
                        description: "The text of the option",
                      },
                      correct: {
                        type: "boolean",
                        description: "Whether this option is correct",
                      },
                    },
                    required: ["id", "label", "correct"],
                  },
                },
              },
              required: ["question", "options"],
            },
          },
        },
      ];
    } else if (questionType === "slider") {
      systemPrompt = `You are an educational content creator. Based on the transcript of a video, create one question that requires using a slider to find a specific value.`;
      functionName = "createSliderQuestion";
      tools = [
        {
          type: "function",
          function: {
            name: functionName,
            description: "Create a slider-based question",
            parameters: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                  description: "The question text",
                },
                targetValue: {
                  type: "number",
                  description:
                    "The target value that the slider should be set to",
                },
                minValue: {
                  type: "number",
                  description: "The minimum value of the slider",
                },
                maxValue: {
                  type: "number",
                  description: "The maximum value of the slider",
                },
                errorTolerance: {
                  type: "number",
                  description:
                    "How close the answer needs to be to the target value",
                },
                relation: {
                  type: "string",
                  description: "The relation to use for validation",
                  enum: ["==", ">", "<", ">=", "<="],
                },
              },
              required: [
                "question",
                "targetValue",
                "minValue",
                "maxValue",
                "errorTolerance",
                "relation",
              ],
            },
          },
        },
      ];
    } else if (questionType === "number") {
      systemPrompt = `You are an educational content creator. Based on the transcript of a video, create one question that requires a numerical answer.`;
      functionName = "createNumberInputQuestion";
      tools = [
        {
          type: "function",
          function: {
            name: functionName,
            description: "Create a numerical input question",
            parameters: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                  description: "The question text",
                },
                answer: {
                  type: "number",
                  description: "The correct numerical answer",
                },
                errorTolerance: {
                  type: "number",
                  description:
                    "How close the user's answer needs to be to the correct answer",
                },
              },
              required: ["question", "answer", "errorTolerance"],
            },
          },
        },
      ];
    }

    // Generate questions based on the transcript (or without it if empty)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: transcript
            ? `Here is the transcript of an educational video: "${transcript}".
              
              ${description ? `Additional instructions: ${description}` : ""}
              
              Please generate a ${
                questionType === "multichoice"
                  ? "multiple-choice question"
                  : questionType === "slider"
                  ? "slider question"
                  : "numerical input question"
              } based on this content.`
            : `Please generate a generic ${
                questionType === "multichoice"
                  ? "multiple-choice question"
                  : questionType === "slider"
                  ? "slider question"
                  : "numerical input question"
              } for an educational module.
              
              ${description ? `Additional instructions: ${description}` : ""}`,
        },
      ],
      tools: tools,
      tool_choice: {
        type: "function",
        function: {
          name: functionName,
        },
      },
    });

    // Extract the tool call from the response
    const toolCall = completion.choices[0].message.tool_calls?.[0];

    if (!toolCall) {
      return NextResponse.json(
        { error: "Failed to generate question data" },
        { status: 500 }
      );
    }

    // Parse the function arguments as JSON
    const questionData = JSON.parse(toolCall.function.arguments);

    console.log(questionType);
    console.log(questionData);

    // Format the response based on question type
    let formattedQuestion;

    switch (questionType) {
      case "multichoice":
        formattedQuestion = {
          title: title,
          question: questionData.question,
          options: questionData.options.map((option: any, index: number) => ({
            id: index + 1, // Generate sequential IDs starting from 1
            label: option.label,
          })),
          correctAnswers: questionData.options
            .map((option: any, index: number) =>
              option.correct ? index + 1 : null
            )
            .filter((index: number | null) => index !== null), // Map to same sequential IDs
          type: "multipleChoice",
        };
        break;

      case "slider":
        formattedQuestion = {
          title: title,
          question: questionData.question,
          targetValue: questionData.targetValue,
          minValue: questionData.minValue,
          maxValue: questionData.maxValue,
          errorTolerance: questionData.errorTolerance,
          relation: questionData.relation,
          type: "slider",
        };
        break;

      case "number":
        formattedQuestion = {
          title: title,
          question: questionData.question,
          answer: questionData.answer,
          errorTolerance: questionData.errorTolerance,
          type: "numberInput",
        };
        break;
    }

    console.log(formattedQuestion);
    return NextResponse.json(formattedQuestion);
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}

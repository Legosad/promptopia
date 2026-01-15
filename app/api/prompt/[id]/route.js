import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

// GET
export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params;

    if (!id) {
      return new Response("Missing ID", { status: 400 });
    }

    const prompt = await Prompt.findById(id).populate("creator");

    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.error("GET /api/prompt/[id] error:", error);
    return new Response("Failed to fetch the prompt", { status: 500 });
  }
};

// PATCH
export const PATCH = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params;
    const { prompt, tag } = await req.json();

    const existingPrompt = await Prompt.findById(id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/prompt/[id] error:", error);
    return new Response("Failed to update the prompt", { status: 500 });
  }
};

// DELETE
export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params;

    const deletedPrompt = await Prompt.findByIdAndDelete(id);

    if (!deletedPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response("Prompt deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE /api/prompt/[id] error:", error);
    return new Response("Failed to delete the prompt", { status: 500 });
  }
};

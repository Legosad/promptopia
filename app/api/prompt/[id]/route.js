import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export const GET = async (_, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.error("GET /api/prompt/[id] error:", error);
    return new Response("Failed to fetch the prompt", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await connectToDB();

    const { prompt, tag } = await req.json();
    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    if (existingPrompt.creator.toString() !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
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

export const DELETE = async (_, { params }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id);

    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }
    if (prompt.creator.toString() !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    await Prompt.findByIdAndDelete(params.id);

    return new Response("Prompt deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE /api/prompt/[id] error:", error);
    return new Response("Failed to delete the prompt", { status: 500 });
  }
};

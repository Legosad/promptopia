import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { Filter } from 'bad-words'


const filter = new Filter();

export const GET = async (_, context) => {
  try {
    await connectToDB();
    const { params } = await context;
    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt) {
      return new Response(JSON.stringify({message: "Prompt not found"}), { status: 404 });
    }

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.error("GET /api/prompt/[id] error:", error);
    return new Response(JSON.stringify({message: "Failed to fetch the prompt"}), { status: 500 });
  }
};

export const PATCH = async (req, context) => {
  const session = await getServerSession(authOptions);
  const { params } = await context;
  if (!session?.user?.id) {
    return new Response(JSON.stringify({message: "Unauthorized"}), { status: 401 });
  }

  try {
    await connectToDB();

    const { prompt, tag } = await req.json();
    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response(JSON.stringify({message: "Prompt not found"}), { status: 404 });
    }

    if (
      existingPrompt.creator.toString() !== session.user.id &&
      !session.user.isAdmin
    ) {
      return new Response(JSON.stringify({message: "Forbidden"}), { status: 403 });
    }
    if (filter.isProfane(prompt) || filter.isProfane(tag)) {
  return new Response(JSON.stringify({message: "Prompt or tag contains prohibited words"}), { status: 400 });
}

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/prompt/[id] error:", error);
    return new Response(JSON.stringify({message: "Failed to update the prompt"}), { status: 500 });
  }
};

export const DELETE = async (_, context) => {

  const { params } = await context
  const id = params.id
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(JSON.stringify({message: "Unauthorized"}), { status: 401 });
  }

  try {
    await connectToDB();

    const prompt = await Prompt.findById(id);

    if (!prompt) {
      return new Response(JSON.stringify({message: "Prompt not found"}), { status: 404 });
    }
    if (
      prompt.creator.toString() !== session.user.id &&
      !session.user.isAdmin
    ) {
      return new Response(JSON.stringify({message: "Forbidden"}), { status: 403 });
    }

    await prompt.deleteOne();

    return new Response(JSON.stringify({message: "Prompt deleted"}), { status: 200 });
  } catch (error) {
    console.error("DELETE /api/prompt/[id] error:", error);
    return new Response(JSON.stringify({message: "Failed to delete the prompt"}), { status: 500 });
  }
};

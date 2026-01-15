import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export const POST = async (req) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { prompt, tag } = await req.json();

  if (!prompt) {
    return new Response("Prompt is required", { status: 400 });
  }

  try {
    await connectToDB();

    const newPrompt = await Prompt.create({
      creator: session.user.id,
      prompt,
      tag,
    });

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    console.error("Create prompt error:", error);
    return new Response("Failed to create prompt", { status: 500 });
  }
};

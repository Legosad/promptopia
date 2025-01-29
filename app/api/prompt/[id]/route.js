import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import mongoose from "mongoose";

// GET
export const GET = async (request, context) => {
    try {
        await connectToDB();

        // Explicitly await params if necessary
        const params = await context.params;
        
        if (!params?.id) {
            return new Response("Invalid request: Missing ID", { status: 400 });
        }

        const prompt = await Prompt.findById(new mongoose.Types.ObjectId(params.id)).populate("creator");

        if (!prompt) {
            return new Response("Prompt not Found", { status: 404 });
        }
        return new Response(JSON.stringify(prompt), { status: 200 });
    } catch (error) {
        console.error("Error fetching prompt:", error);
        return new Response("Failed to fetch the prompt", { status: 500 });
    }
};

// PATCH
export const PATCH = async (request, context) => {
    try {
        await connectToDB();

        const params = await context.params;

        if (!params?.id) {
            return new Response("Invalid request: Missing ID", { status: 400 });
        }

        const { prompt, tag } = await request.json();
        const existingPrompt = await Prompt.findById(new mongoose.Types.ObjectId(params.id)).populate("creator");

        if (!existingPrompt) {
            return new Response("Prompt not Found", { status: 404 });
        }

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();
        return new Response(JSON.stringify(existingPrompt), { status: 200 });
    } catch (error) {
        console.error("Error updating prompt:", error);
        return new Response("Failed to update the prompt", { status: 500 });
    }
};

// DELETE
export const DELETE = async (request, context) => {
    try {
        await connectToDB();

        const params = await context.params;

        if (!params?.id) {
            return new Response("Invalid request: Missing ID", { status: 400 });
        }

        const prompt = await Prompt.findByIdAndDelete(new mongoose.Types.ObjectId(params.id)).populate("creator");

        if (!prompt) {
            return new Response("Prompt not Found", { status: 404 });
        }
        return new Response("Prompt Deleted", { status: 200 });
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return new Response("Failed to delete the prompt", { status: 500 });
    }
};

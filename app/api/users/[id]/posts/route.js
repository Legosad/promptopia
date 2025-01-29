import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import mongoose from "mongoose";

export const GET = async (request, context) => {
    try {
        await connectToDB();
        const params = await context.params;
        console.log("Params recieved in API:", params)
        if (!params.id) {
            return new Response("User Id is missing", {status: 400})
        }
        // console.log(params, params.id)
        const prompts = await Prompt.find({
            creator: new mongoose.Types.ObjectId(params.id) 
        }).populate("creator");
        return new Response(JSON.stringify(prompts), {status: 200} )
    } catch (error) {
        return new Response("Failed to fetch all prompts", {status: 500} )
        
    }
}
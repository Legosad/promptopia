import mongoose from "mongoose"

let isConnected = false; //track connection status

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share-prompt",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        isConnected = true;
    } catch (error) {
        console.log(error)
    }
}
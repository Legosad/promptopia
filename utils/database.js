import mongoose from "mongoose"

let isConnected = false; //track connection status

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDB is already connectd");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "share-prompt",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        isConnected = true;
        console.log("MongoDB is connected");
    } catch (error) {
        console.log(error)
    }
}
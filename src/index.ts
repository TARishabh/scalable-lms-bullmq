import express from "express";
import { addUserToCourse } from "./utils/course";
import { sendEmail } from "./utils/email";
import { Queue } from "bullmq";
import dotenv from 'dotenv';

dotenv.config();

const redisPort = process.env.redisport ? parseInt(process.env.redisport) : undefined;


const emailQueue = new Queue("email-queue",{
    connection:{
        host:process.env.host,
        port:redisPort,
        username:process.env.username,
        password:process.env.password
    }
});

const app = express();
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    return res.json({ status: "success", message: "Hello World" });
});

app.post("/addUserToCourse", async (req, res) => {
    console.log("Adding user to course");
    // Critical task, thats why added in the main thread
    await addUserToCourse();

    // Non crtical task, thats why added in message queue
    await emailQueue.add(`${Date.now()}`, {
        from: "[email protected]",
        to: "[email protected]",
        subject: "Welcome to the course",
        body: "You have been added to the course"
    })
    // await sendEmail({
        // from: "[email protected]",
        // to: "[email protected]",
        // subject: "Welcome to the course",
        // body: "You have been added to the course"
    // });
    // return res.json({ status: "success", message: "User added to course" });
});

app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});
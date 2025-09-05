// Importing all necessary modules
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";
import { connect } from "node:http2";

const app = express();

// Since our socker server and the express instance is different so we need something to connect them both
// That's what createServer does
// Instance of app using createserver
const server = createServer(app);
// Now we need to connect socket io to the server

// Imported from /controllers/socketManager.js
const io = connectToSocket(server);

// Set port for the io server
app.set("port", process.env.PORT || 8000);
app.use(cors());
// Use limit to avoid too much payload
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// app.get("/home", (req, res) => {
// 	res.json({ hello: "world" });
// });

const start = async () => {
    // Connecting mongodb
    const connectionDb = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`Mongo connected DB HOST ${connectionDb.connection.host}`);
    server.listen(app.get("port"), () => {
        console.log("Listening on port 8000");
    });
};
start();

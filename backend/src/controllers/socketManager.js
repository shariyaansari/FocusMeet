import mongoose from "mongoose";
import { Server } from "socket.io";
const connection = mongoose.connection;
let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  // So if there is a cross origin error in the socket connection
  const io = new Server(server, {
    //This needs not to be there in production 
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });
  // Like tha .addEventListener in frontend
  // this is used to connect to socket
  io.on("connection", (socket) => {
    // After connection we can use functions here to perform actiopns
    // join-call is a custom event name it ould have been anything
    // If somebody triggers a emit call it also has to listen to the same event name

    // 1. Join the call
    socket.on("join-call", (path) => {
      // Initialize the room if it doesn't exist
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      // Each socket has a unique id
      // Add user to the room
      connections[path].push(socket.id);

      //Store the time when the user joined
      timeOnline[socket.id] = new Date();

      //   Could have used a for each loop as well
      // connections.forEach(element => {
      //     io.to(element)
      // });

      //   Notify all users that a new user has joined
      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }

      // Replay chat history to the newly joined user
      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; a++) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"]
          );
        }
      }
    });

    // 2. Sending signals to other users
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    // 3. Sending chat messages
    // Now the users are in the call and can send messages to each other
    // So the message is already sent here
    socket.on("chat-message", (data, sender) => {
      // this is a bit advanced to code
      // One method is to loop through connections and find which room the socket is in
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomkey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomkey, true];
          }
          return [room, isFound];
        },
        [" ", false]
      );
      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }
        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log("message", key, ":", sender, data);

        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    // 3. Disconnecting from the call
    socket.on("disconnect", () => {
      // Calculate time spent online
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());
      var key;
      // k = room id , v = array of socket ids
      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connections))
      )) {
        // make deep copy to avoid mutation issues
        for (let a = 0; a < v.length; a++) {
          if (v[a] === socket.id) {
            key = k;
            for (let a = 0; a < connections[key].length; a++) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }
            var index = connections[key].indexOf(socket.id);
            connections[key].splice(index, 1);
            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
    });
  });
  return io;
};

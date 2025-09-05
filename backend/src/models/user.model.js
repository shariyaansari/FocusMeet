import { Schema } from "mongoose";
const userSchema = new Schema({
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
    // Token is to keep on the local storage rest all we will fetch and get
	token: { type: String },
});

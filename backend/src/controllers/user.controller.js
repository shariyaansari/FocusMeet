import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

const login = async (req, res) => {
  // If we go writing code here, there will be the repition of try and catch and we always try to avoid repition of the code sop therefore there is something called as async handler
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }
    // If we find the user.....the go for matching the password
    // Don't bcrypt.hash(password, 10) = user.password becuause it encrypts uniquely everytime
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Why crypto.randomBytes...When we log in it will generate and give a login token.....That token is stred in the local storage rather than the user credentials.....things stored in local storage can be accessed easily
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid password" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();

    return res.status(httpStatus.OK).json({
      token,
      message: "Login successful",
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already Exists" });
    }
    // These are called ear;y return statements and are a part of good practice of writing code
    // here 10 is the salt which is basically specification of encryption
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });
    await newUser.save();
    res
      .status(httpStatus.CREATED)
      .json({ message: "User registered Successfullty" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

export { login, register };

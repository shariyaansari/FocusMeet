import { Children, createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";

export const AuthContext = createContext({});
const client = axios.create({
	baseURL: "http://localhost:3000/api/v1/users",
});

export const AuthProvider = ({ children }) => {
	const authContext = useContext(AuthContext);
	const [userData, setUserData] = useState(authContext);
	const router = useNavigate();
	const handleRegister = async (name, username, password) => {
		try {
			let request = await client.post("/register", {
				name: name,
				username: username,
				password: password,
			});
			if (request.status === httpStatus.CREATED) {
				return request.data.message;
			}
		} catch (err) {
			if (err.response?.status === 409) {
				return err.response.data.message;
			}

			throw err;
		}
	};

	const handleLogin = async (username, password) => {
		try {
			let request = await client.post("/login", {
				username: username,
				password: password,
			});
			console.log(request.data);
			if (request.status === httpStatus.OK) {
				// As soon as we login the router should go to home
				localStorage.setItem("token", request.data.token);
				router("/home")
			}
		} catch (err) {
			console.log("LOGIN ERROR:", err.response?.data);
			console.log("STATUS:", err.response?.status);
		}
	};

	// const router = useNavigate();

	const data = {
		userData,
		setUserData,
		handleRegister,
		handleLogin,
	};
	return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

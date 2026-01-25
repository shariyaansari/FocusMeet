import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import Snackbar from "@mui/material/Snackbar";


const theme = createTheme();

export default function Authentication() {
	// const handleSubmit = (event) => {
	// 	event.preventDefault();
	// 	const data = new FormData(event.currentTarget);

	// 	console.log({
	// 		email: data.get("email"),
	// 		password: data.get("password"),
	// 	});
	// };
	// This is for storing username display and handling
	const [name, setName] = useState();
	const [username, setUsername] = useState();
	const [password, setPassword] = useState();
	const [error, setError] = useState();
	const [messages, setMessages] = useState();

	// For snackbar
	const [formState, setFormState] = useState(0);
	const [open, setOpen] = useState(false);

	const { handleRegister, handleLogin } = React.useContext(AuthContext);

	let handleAuth = async () => {
		try {
			// Login
			if (formState === 0) {
				let result = await handleLogin(username, password);
				
				console.log(result);
			}
			// Sign in
			if (formState === 1) {
				let result = await handleRegister(name, username, password);
				console.log(result);
				setUsername("")
				setMessages(result);
				setOpen(true);
				setError("")
				setFormState(0)
				setPassword("")
				
			}
		} catch (err) {
			// throw err;
			console.log(err)
			return;
			let message = err.data.response.message;
			setError(message);
		}
	};

	// UseState for the formState to get the status of the form

	return (
		<ThemeProvider theme={theme}>
			<Grid container component="main" sx={{ height: "100vh" }}>
				<CssBaseline />

				{/* LEFT SIDE - FORM */}
				<Grid
					item
					xs={12}
					sm={8}
					md={5}
					component={Box}
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "100vh",
					}}
				>
					<Container maxWidth="xs">
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
								<LockOutlinedIcon />
							</Avatar>

							<div>
								{/* Form state 0 -> sign in(login), 1 - Register */}
								<Button
									variant={formState === 0 ? "contained" : ""}
									onClick={() => {
										setFormState(0);
									}}
								>
									Sign In
								</Button>
								<Button
									variant={formState === 1 ? "contained" : ""}
									onClick={() => {
										setFormState(1);
									}}
								>
									Sign Up
								</Button>
							</div>

							<Box component="form" sx={{ mt: 1 }}>
								<p>{name}</p>
								{formState == 1 ? (
									<TextField
										margin="normal"
										required
										fullWidth
										id="username"
										label="Full Name"
										name="username"
										// value = {Fullname}
										autoFocus
										onChange={(e) => {
											setName(e.target.value);
										}}
									/>
								) : (
									<></>
								)}

								<TextField
									margin="normal"
									required
									fullWidth
									id="username"
									label="Username"
									name="username"
									// value = {username}
									autoFocus
									onChange={(e) => {
										setUsername(e.target.value);
									}}
								/>

								<TextField
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									// value = {password}
									onChange={(e) => {
										setPassword(e.target.value);
									}}
								/>

								{/* <FormControlLabel
									control={<Checkbox value="remember" color="primary" />}
									label="Remember me"
								/> */}
								<p style={{color:"red"}}>{error}</p>

								<Button
									type="button"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
									onClick={handleAuth}
								>
									{formState === 0 ? "Login" : "" } Sign In
								</Button>
							</Box>
						</Box>
					</Container>
				</Grid>

				{/* RIGHT SIDE - IMAGE */}
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						height: "100vh", // ⭐ THIS IS THE KEY FIX
						backgroundImage:
							"url(https://images.unsplash.com/random?photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80)",
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
			</Grid>

			<Snackbar open={open} autoHideDuration={4000} message={messages} />
		</ThemeProvider>
	);
}

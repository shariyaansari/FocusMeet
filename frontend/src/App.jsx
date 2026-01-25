import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./pages/landing.jsx";
import Authentication from "./pages/authentication.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import VideoMeetComponent from "./pages/VideoMeet.jsx";

const App = () => {
	return (
		<div>
			<Router>
				{/*Do not write the auth provoder outside the Router cause useNavigate should only be used inside router*/}
				<AuthProvider>
					<Routes>
						{/* <Route path= '/home'></Route> */}
						<Route path="/" element={<LandingPage />}></Route>
						<Route path="/auth" element={<Authentication />} />
						{/* Using slugs here */}
						<Route path = "/:url" element = {<VideoMeetComponent />}/>
					</Routes>
				</AuthProvider>
			</Router>
		</div>
	);
};

export default App;

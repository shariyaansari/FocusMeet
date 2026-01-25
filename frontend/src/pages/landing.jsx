import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function landing() {
	return (
		<div className="landingPageContainer">
			<nav>
				<div className="navHeader">
					<h2>FocusMeet</h2>
				</div>
				<div className="navlist">
					<p>Join as Guest</p>
					<p>Register</p>
					{/* <button>Login</button> */}
					{/* Another way of writing a button - good for seo */}
					<div role="button">
						<p>Login</p>
					</div>
				</div>
			</nav>

			<div className="landingMainContainer">
				<div>
					<h1>
						<span style={{ color: "#FF9839" }}>Connect</span> with your Loved
						Ones
					</h1>
					<p>Cover a distance by FocusMeet Video Call</p>
					<div role="button">
						<Link to={"/auth"}>Get Started</Link>
					</div>
				</div>
				<div>
					<img src="/mobile.png" alt="" />
				</div>
			</div>
		</div>
	);
}

// Css -> template from figma file
// Learn material ui and how to reshape the premade components as per our need

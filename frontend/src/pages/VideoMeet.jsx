import React, { useState, useRef, useEffect } from "react";
import "../styles/videoComponent.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import Navigator from

const server_url = "http://localhost:3000";

var connections = {};

const peerConfigConnections = {
	// Stun servers - light weight servers running on public internet which returns the ip address of requester's device
	iceServers: [{ urls: "stun:stun.l.google.com:19032" }],
};

function VideoMeetComponent() {
	const connect = () => {
		console.log("Connected");
	};
	// general info - {window.location.href tells us where we are rn eg - http://localhost:5173/irhuf }
	// Anything related to socket will take place here
	var socketRef = useRef();

	// To store socket Id as soon as the connection is established
	var socketId = useRef();

	// To see our video and for the rest of the videos we can define an array
	let localVideoRef = useRef();

	// Access to video or not
	let [videoAvailable, setVideoAvailable] = useState(true);

	let [audioAvailable, setAudioAvailable] = useState(true);

	let [video, setVideo] = useState();

	let [audio, setAudio] = useState();

	let [screen, setScreen] = useState();

	let [showModal, setShowModal] = useState();

	let [screenAvailable, setScreenAvailable] = useState();

	let [message, setMessages] = useState();

	let [newMessages, setNewMessages] = useState(0);

	let [askForUsername, setAskForUsername] = useState(true);

	let [username, setUsername] = useState("");

	const videoRef = useRef([]);

	let [videos, setVideos] = useState([]);

	// TODO
	// if(Chrome === false){

	// }

	const getPermissions = async () => {
		try {
			// for video permissions
			// Navigator - global browser API - automatically available in the browser environment
			const videoPermissions = await navigator.mediaDevices.getUserMedia({
				video: true,
			});
			if (videoPermissions) {
				setVideoAvailable(true);
			} else {
				setVideoAvailable(false);
			}

			// for audio permissions
			const audioPermissions = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			if (audioPermissions) {
				setAudioAvailable(true);
			} else {
				setAudioAvailable(false);
			}

			if (navigator.mediaDevices.getDisplayMedia) {
				setScreenAvailable(true);
			} else {
				setScreenAvailable(false);
			}

			// So here we took the userMedia's both streams audio and video stream - then we set the stream to local stream
			if (videoAvailable || audioAvailable) {
				const userMediaStream = await navigator.mediaDevices.getUserMedia({
					video: videoAvailable,
					audio: audioAvailable,
				});

				if (userMediaStream) {
					window.localStream = userMediaStream;
					if (localVideoRef.current) {
						localVideoRef.current.srcObject = userMediaStream;
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getPermissions();
	}, []);

	let getUserMediaSuccess = (stream) => {};

	let getUserMedia = () => {
		if ((video && videoAvailable) || (audio && audioAvailable)) {
			navigator.mediaDevices
				.getUserMedia({ video: video, audio: audio })
				.then((getUserMediaSuccess) => {})
				.then((stream) => {})
				.catch((e) => {
					console.log(e);
				});
		} else {
			try {
				let tracks = localVideoRef.current.srcObject.getTracks();
				tracks.forEach((track) => track.stop());
			} catch {}
		}
	};

	useEffect(() => {
		if (video !== undefined && audio !== undefined) {
			getUserMedia();
		}
	}, [audio, video]);

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, {secure: false})
    }
    

	let getMedia = () => {
		setVideo(videoAvailable);
		setAudio(videoAvailable);
		// connectToSocketServer();
	};

	return (
		<div>
			{askForUsername === true ? (
				<div>
					<h2>Enter into Lobby</h2>

					<TextField
						id="outlined-basic"
						label="Username"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						variant="outlined"
					/>
					<Button variant="contained" onClick={connect}>
						Connect
					</Button>
					<div>
						{/* Useref is like accessing the dom element */}
						<video ref={localVideoRef} autoPlay muted></video>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default VideoMeetComponent;

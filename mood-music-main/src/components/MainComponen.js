// cSpell:ignore faceapi shazam rapidapi

import axios from "axios";
import SongCard from "./SongCard";
import * as faceapi from "face-api.js";
import WebcamModal from "./WebcamModal";
import { Bars } from "react-loader-spinner";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Box, Paper, Grid } from "@mui/material";

var geolocation = require("geolocation");

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: "10px",
}));

function MainComponent() {
  const [loader, setShowLoader] = useState(false);
  const [songs, setSongs] = useState([]);
  const [showSongs, setShowSongs] = useState(false);
  const [webcamModal, setWebcamModal] = useState(false);
  const [emotion, setEmotion] = useState();
  const [weather, setWeather] = useState();
  const [location, setLocation] = useState();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => setModelsLoaded(true));
    };

    if (!modelsLoaded) loadModels();

    if (!location) {
      geolocation.getCurrentPosition(function (err, position) {
        if (err) throw err;
        setLocation(position.coords.latitude + "," + position.coords.longitude);
      });
    }

    if (location) {
      axios
        .get(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}&aqi=no`
        )
        .then((response) => {
          setWeather(response.data.current.condition.text);
        });
    }

    // Fetch Spotify Access Token on component mount
    const fetchAccessToken = async () => {
      const clientId = "39798627b39140e48b95e681d88151c4";
      const clientSecret = "e876cc99129448b8adda0b371473069a";

      const tokenUrl = "https://accounts.spotify.com/api/token";
      const body = new URLSearchParams({
        grant_type: "client_credentials",
      });

      const headers = {
        Authorization: `Basic ${btoa(clientId + ":" + clientSecret)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };

      try {
        const response = await axios.post(tokenUrl, body, { headers });
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error("Failed to fetch Spotify access token:", error);
      }
    };

    fetchAccessToken();
  }, [location, modelsLoaded]);

  // Use useCallback to memoize the recommendSongs function
  const recommendSongs = useCallback(
    (mood) => {
      setEmotion(mood);
      setShowLoader(true);
      setShowSongs(true);

      if (!weather) {
        alert("Detecting weather...");
        return;
      }

      if (!accessToken) {
        console.error("Spotify access token is missing.");
        return;
      }

      // Map mood to Hindi playlist on Spotify
      const moodToPlaylist = {
        Happy: "4nNVfQ9eWidZXkBKZN5li4", // Example playlist ID for Bollywood
        Sad: "37i9dQZF1DXdFesNN9TzXT", // Example playlist ID for Hindi Sad Songs
        Surprised: "37i9dQZF1DX0XUfTFmNBRM", // Example playlist ID for Hindi Surprise Mood
        Fearful: "08eWe5qrfPRCH4V7P69KRs", // Example playlist ID for Hindi Fearful Mood
        Angry: "3JNWpteYvH3ynMcyPcvxfx", // Example playlist ID for Hindi Angry Mood
        Disgusted: "0EDTgQrMbfS7RGToucSGoK", // Example playlist ID for Hindi Disgust Mood
        Neutral: "1b6Lj2j6z1cUg2WWsuGGk0", // Example playlist ID for Hindi Neutral Mood
      };

      const playlistId = moodToPlaylist[mood];

      axios
        .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            market: "IN", // Ensure the market is set to India for Hindi songs
            limit: 50,
          },
        })
        .then((response) => {
          setShowLoader(false);
          setSongs(
            response.data.items
              .map((item) => item.track)
              .filter((track) => track.preview_url) // Only keep songs with a preview URL
          );
        })
        .catch((error) => {
          setShowLoader(false);
          console.error("Error fetching recommendations from Spotify:", error);
        });
    },
    [weather, accessToken] // Add weather and accessToken as dependencies
  );

  useEffect(() => {
    if (emotion) {
      recommendSongs(emotion);
    }
  }, [emotion, recommendSongs]);

  // Function to handle song playback
  const handleSongPlay = (previewUrl) => {
    if (currentAudio) {
      currentAudio.pause(); // Pause the currently playing song
    }

    const audio = new Audio(previewUrl);
    audio.play();
    setCurrentAudio(audio);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ color: "white" }}>Mood Tunes</h1>

      <div
        style={{
          gap: "15px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        {[
          { emotion: "Happy", emoji: "😀" },
          { emotion: "Sad", emoji: "😔" },
          { emotion: "Surprised", emoji: "😲" },
          { emotion: "Fearful", emoji: "😨" },
          { emotion: "Angry", emoji: "😠" },
          { emotion: "Disgusted", emoji: "🤢" },
          { emotion: "Neutral", emoji: "😶" },
        ].map((item) => (
          <div key={item.emotion}>
            <Button
              style={{ fontSize: "40px" }}
              onClick={() => recommendSongs(item.emotion)}
            >
              {item.emoji}
            </Button>
            <div style={{ color: "lightblue" }}>{item.emotion}</div>
          </div>
        ))}
      </div>

      <Button variant="contained" onClick={() => setWebcamModal(true)}>
        Play my mood!
      </Button>

      {webcamModal && (
        <WebcamModal
          webcamModal={webcamModal}
          closeWebcamModal={() => setWebcamModal(false)}
          setEmotion={setEmotion}
          modelsLoaded={modelsLoaded}
        />
      )}

      <div style={{ marginTop: "20px" }}>
        {emotion && <div style={{ color: "white" }}>Mood : {emotion}</div>}
        {weather && <div style={{ color: "white" }}>Weather : {weather}</div>}
        {loader ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <Bars
              height="80"
              width="80"
              color="#fff"
              ariaLabel="bars-loading"
              visible={true}
            />
          </div>
        ) : showSongs ? (
          <Box sx={{ marginTop: "10px", padding: "20px" }}>
            <Grid
              container
              spacing={3}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {songs.map((item, index) => (
                <Grid item xs={4} md={2} key={index}>
                  <Item>
                    <SongCard song={item} onPlay={handleSongPlay} />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <div style={{ color: "white" }}>No songs available.</div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;














// old code 
// import axios from "axios";
// import SongCard from "./SongCard";
// import * as faceapi from "face-api.js";
// import WebcamModal from "./WebcamModal";
// import { Bars } from "react-loader-spinner";
// import { styled } from "@mui/material/styles";
// import React, { useState, useEffect, useCallback } from "react";
// import { Button, Box, Paper, Grid } from "@mui/material";

// var geolocation = require("geolocation");

// const Item = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body2,
//   textAlign: "center",
//   color: theme.palette.text.secondary,
//   borderRadius: "10px",
// }));

// function MainComponent() {
//   const [loader, setShowLoader] = useState(false);
//   const [songs, setSongs] = useState([]);
//   const [showSongs, setShowSongs] = useState(false);
//   const [webcamModal, setWebcamModal] = useState(false);
//   const [emotion, setEmotion] = useState();
//   const [weather, setWeather] = useState();
//   const [location, setLocation] = useState();
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = process.env.PUBLIC_URL + "/models";

//       Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//         faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//         faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
//         faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
//       ]).then(() => setModelsLoaded(true));
//     };

//     if (!modelsLoaded) loadModels();

//     if (!location) {
//       geolocation.getCurrentPosition(function (err, position) {
//         if (err) throw err;
//         setLocation(position.coords.latitude + "," + position.coords.longitude);
//       });
//     }

//     if (location) {
//       axios
//         .get(
//           `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}&aqi=no`
//         )
//         .then((response) => {
//           setWeather(response.data.current.condition.text);
//         });
//     }
//   }, [location, modelsLoaded]);

//   // Use useCallback to memoize the recommendSongs function
//   const recommendSongs = useCallback(
//     (mood) => {
//       setEmotion(mood);
//       setShowLoader(true);
//       setShowSongs(true);

//       if (!weather) {
//         alert("Detecting weather...");
//         return;
//       }

//       const options = {
//         method: "GET",
//         url: "https://shazam.p.rapidapi.com/search",
//         params: {
//           term: `${mood} ${weather}`,
//           locale: "hi-IN",
//           offset: "0",
//           limit: "30",
//         },
//         headers: {
//           "x-rapidapi-host": "shazam.p.rapidapi.com",
//           "x-rapidapi-key": process.env.REACT_APP_MUSIC_API_KEY,
//         },
//       };

//       axios
//         .request(options)
//         .then((response) => {
//           setShowLoader(false);
//           setSongs(response.data.tracks.hits);
//         })
//         .catch((error) => {
//           setShowLoader(false);
//           console.error(error);
//         });
//     },
//     [weather] // Add weather as a dependency
//   );

//   useEffect(() => {
//     if (emotion) {
//       recommendSongs(emotion);
//     }
//   }, [emotion, recommendSongs]);

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1 style={{ color: "white" }}>Mood Tunes</h1>

//       <div
//         style={{
//           gap: "15px",
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "center",
//           marginBottom: "30px",
//         }}
//       >
//         {[
//           { emotion: "Happy", emoji: "😀" },
//           { emotion: "Sad", emoji: "😔" },
//           { emotion: "Surprised", emoji: "😲" },
//           { emotion: "Fearful", emoji: "😨" },
//           { emotion: "Angry", emoji: "😠" },
//           { emotion: "Disgusted", emoji: "🤢" },
//           { emotion: "Neutral", emoji: "😶" },
//         ].map((item) => (
//           <div key={item.emotion}>
//             {/* Ensure the key is unique */}
//             <Button
//               style={{ fontSize: "40px" }}
//               onClick={() => recommendSongs(item.emotion)}
//             >
//               {item.emoji}
//             </Button>
//             <div style={{ color: "lightblue" }}>{item.emotion}</div>
//           </div>
//         ))}
//       </div>

//       <Button variant="contained" onClick={() => setWebcamModal(true)}>
//         Play my mood!
//       </Button>

//       {webcamModal && (
//         <WebcamModal
//           webcamModal={webcamModal}
//           closeWebcamModal={() => setWebcamModal(false)}
//           setEmotion={setEmotion}
//           modelsLoaded={modelsLoaded}
//         />
//       )}

//       <div style={{ marginTop: "20px" }}>
//         {emotion && <div style={{ color: "white" }}>Mood : {emotion}</div>}
//         {weather && <div style={{ color: "white" }}>Weather : {weather}</div>}
//         {loader ? (
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "center",
//               marginTop: "50px",
//             }}
//           >
//             <Bars
//               height="80"
//               width="80"
//               color="#fff"
//               ariaLabel="bars-loading"
//               visible={true}
//             />
//           </div>
//         ) : showSongs ? (
//           <Box sx={{ marginTop: "10px", padding: "20px" }}>
//             <Grid
//               container
//               spacing={3}
//               style={{ display: "flex", justifyContent: "center" }}
//             >
//               {songs.map((item, index) => (
//                 <Grid item xs={4} md={2} key={index}>
//                   <Item>
//                     <SongCard song={item} />
//                   </Item>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// export default MainComponent;

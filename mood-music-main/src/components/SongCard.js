// cSpell:ignore shazam noopener  noreferrer
import React from "react";
import spotifyIcon from "../assets/spotify.png"; // Add a Spotify icon in your assets


function SongCard(props) {
  const { song } = props;

  // Spotify API data structure
  const songImage = song.album?.images?.[0]?.url || ""; // Use the first available image
  const songTitle = song.name || "Unknown Song"; // Song title
  const audioUri = song.preview_url || ""; // Audio preview URL
  const spotifyLink = song.external_urls?.spotify || "#"; // Link to Spotify
  return (
    <div
      style={{
        color: "white",
        display: "flex",
        height: "300px",
        paddingTop: "10px",
        borderRadius: "10px",
        flexDirection: "column",
        backgroundColor: "black",
        justifyContent: "space-between",
      }}
    >
      <div>
        <img
          src={songImage}
          alt="Song Thumbnail"
          width="90%"
          style={{ borderRadius: "10px" }}
        />
      </div>
      <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        {songTitle}
      </div>

      <div>
        {audioUri ? (
          <audio controls style={{ width: "90%", height: "30px" }}>
            <source src={audioUri} />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p style={{ color: "red", textAlign: "center" }}>
            Audio preview not available.
          </p>
        )}
      </div>

      <div>
        <a
          href={spotifyLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: "20px" }}
        >
          <img src={spotifyIcon} alt="Spotify" width="30px" height="30px" />
        </a>
       
      </div>
    </div>
  );
}

export default SongCard;















// old code
// import React from "react";
// import shazamIcon from "../assets/shazam.png";
// import appleIcon from "../assets/apple.png";

// function SongCard(props) {
//   const { song } = props;

//   // Check if all necessary data is available to avoid errors
//   const songImage = song.track?.share?.image || "";
//   const songTitle = song.track?.share?.subject || "Unknown Song";
//   const audioUri = song.track?.hub?.actions?.[1]?.uri || "";
//   const shazamLink = song.track?.share?.href || "#";
//   const appleMusicLink = song.track?.hub?.options?.[0]?.actions?.[0]?.uri || "#";

//   return (
//     <div
//       style={{
//         color: "white",
//         display: "flex",
//         height: "400px",
//         paddingTop: "10px",
//         borderRadius: "10px",
//         flexDirection: "column",
//         backgroundColor: "black",
//         justifyContent: "space-between",
//       }}
//     >
//       <div>
//         <img
//           src={songImage}
//           alt="Song Thumbnail"
//           width="90%"
//           style={{ borderRadius: "10px" }}
//         />
//       </div>
//       <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
//         {songTitle}
//       </div>

//       <div>
//         {audioUri ? (
//           <audio controls style={{ width: "90%", height: "30px" }}>
//             <source src={audioUri} />
//             Your browser does not support the audio element.
//           </audio>
//         ) : (
//           <p style={{ color: "red", textAlign: "center" }}>
//             Audio preview not available.
//           </p>
//         )}
//       </div>

//       <div>
//         <a
//           href={shazamLink}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ marginRight: "20px" }}
//         >
//           <img src={shazamIcon} alt="Shazam" width="30px" height="30px" />
//         </a>
//         <a
//           href={appleMusicLink}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <img src={appleIcon} alt="Apple Music" width="30px" height="30px" />
//         </a>
//       </div>
//     </div>
//   );
// }

// export default SongCard;

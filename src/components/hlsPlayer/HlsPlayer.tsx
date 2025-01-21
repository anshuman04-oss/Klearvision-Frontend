/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { logout } from "../../features/loginSlice";

interface HlsPlayerProps {
  onLogout?: () => void; // Optional callback for logout functionality
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ onLogout }) => {
  const [hlsUrl, setHlsUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsInstance = useRef<Hls | null>(null);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hlsUrl.trim()) return;

    // Destroy existing HLS instance if it exists
    if (hlsInstance.current) {
      hlsInstance.current.destroy();
      hlsInstance.current = null;
    }

    if (Hls.isSupported()) {
      console.log("HLS.js is supported");
      const hls = new Hls();
      hlsInstance.current = hls;

      hls.loadSource(hlsUrl);
      if (videoRef.current) {
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log(`Manifest loaded, found ${hls.levels.length} quality level(s)`);
          setIsPlaying(true);
          videoRef.current?.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Network error encountered");
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Media error encountered");
                break;
              default:
                console.error("Fatal error encountered");
                break;
            }
          }
        });
      }
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("Native HLS support detected (e.g., Safari)");
      videoRef.current.src = hlsUrl;
      videoRef.current.addEventListener("loadedmetadata", () => {
        setIsPlaying(true);
        videoRef.current?.play();
      });
    } else {
      console.error("HLS is not supported in this browser.");
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup HLS instance on unmount
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="hls-player-container" style={{ textAlign: "center", padding: "20px" }}>
      <h1
        className="text-gray-50 text-4xl font-bold mt-10"
      >
        HLS Stream Player</h1>
      {onLogout && (
        <Button 
          className="text-red-500 font-bold bg-gray-200 p-2 rounded-lg"
          onClick={() => {
            const dispatch = useDispatch();
            dispatch(logout());
          }}
        />
      )}

      <form onSubmit={handleFormSubmit} style={{ margin: "20px 0" }}>
        <label htmlFor="hls_url" className="text-gray-50 font-bold" style={{ display: "block", marginBottom: "10px" }}>
          Enter HLS stream URL:
        </label>
        <input
          type="text"
          id="hls_url"
          name="hls_url"
          value={hlsUrl}
          onChange={(e) => setHlsUrl(e.target.value)}
          placeholder="Enter .m3u8 URL"
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "100%",
            maxWidth: "500px",
            marginBottom: "20px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Play Stream
        </button>
      </form>

      {isPlaying && (
        <div className="video-container" style={{ marginTop: "30px", maxWidth: "1000px" }}>
          <h2>Stream is now playing:</h2>
          <video
            ref={videoRef}
            controls
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HlsPlayer;

































// import React from 'react'
// import { Link } from 'react-router-dom'
// import LogoutPage from '../../pages/LogoutPage'
// import Input from '../Input'
// import Button from '../Button'
// import { Form, useForm } from 'react-hook-form'
// import { hlsURL } from '../../types'

// function HlsPlayer() {

//     const [hlsUrl, setHlsUrl] = React.useState('');

//     const { register, handleSubmit, formState: { errors } } = useForm<hlsURL>();

//     return (
//         <>
//             <h1>HLS Stream Player</h1>

//             {/* A Logout button to be added */}

//             <Form
//                 onSubmit={handleSubmit(onSubmit)}
//             >
//                 <Input 
//                     {...register("hlsURL", { required: "URL is required" })}
//                     type="text"
//                     name="hlsUrl"
//                     placeholder="Enter .m3u8 URL"
//                     className="w-full p-12 mb-20 border border-2 border-gray-300 border-radius-4 text-black text-base"
//                 />

//                 {errors.hlsURL && <p className="text-red-500">{errors.hlsURL.message}</p>}

//                 <button type="submit" className="bg-blue-500 text-white px-4 py-2">
//                     Submit
//                 </button>
//             </Form>
//         </>
//     )
// }

// export default HlsPlayer

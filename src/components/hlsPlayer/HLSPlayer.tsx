/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/loginSlice";
import { RootState } from "@reduxjs/toolkit/query";
import { DeviceState } from "../../types";
import { PLAYBACK_URL } from "../../constants";
import { UUID } from "crypto";
import API_BASE_URL from "../../constants";
import axios from "axios";
import { useParams } from "react-router-dom";
import { fetchPlaybackToken } from "../../api/deviceAPI";
import CommonFilters from "../commonFilters/CommonFilters";
import Dropdown from "../Dropdown";
import DropdownSide from "../DropdownSide";
import FogFilter from "../fog/FogFilter";
import RainFilter from "../rainFilter/RainFilter";

// TODO: Add with base page.
// TODO: Before commiting, github -> PR -> File change


// Get playback url and token from redux store,
// Put url?token=token in video src

// To be handled later.

const HlsPlayer: React.FC= () => {
  // const [hlsUrl, setHlsUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsInstance = useRef<Hls | null>(null);
  let playbackURLToken = `${PLAYBACK_URL}?token=`;
  const accessToken = "";
  const { deviceId } = useParams<{ deviceId: string }>();
  const [filter, setFilter] = useState<string>("Fog");

  // Call API for playback token 

  useEffect(() => {
    fetchPlaybackToken(deviceId as unknown as UUID, accessToken);
    const playbackToken = localStorage.getItem("playbackToken");
    playbackURLToken += playbackToken;
    console.log("Playback URL Token: ", playbackURLToken);
  }, []);

  // fine
  useEffect(() => {
    return () => {
      // Cleanup HLS instance on unmount
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!playbackURLToken.trim()) return;

    // if (hlsInstance.current) {
    //   hlsInstance.current.destroy();
    //   hlsInstance.current = null;
    // }

    if (Hls.isSupported()) {
      console.log("HLS.js is supported");
      const hls = new Hls();
      hlsInstance.current = hls;

      hls.loadSource(playbackURLToken);
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
      videoRef.current.src = playbackURLToken;
      videoRef.current.addEventListener("loadedmetadata", () => {
        setIsPlaying(true);
        videoRef.current?.play();
      });
    } else {
      console.error("HLS is not supported in this browser.");
    }
  }

  // const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  // };

  return (
    <div className="hls-player-container" style={{ textAlign: "center", padding: "20px" }}>
      <h1
        className="text-gray-50 text-4xl font-bold mt-10"
      >
        Playing Your Video</h1>

        <div className="video-container" style={{ alignContent: "center", justifyContent: "center", display:"flex", marginTop: "30px", maxWidth: "1000px", marginLeft: "50px", position: "relative" }}>
          {isPlaying && <h2>Stream is now playing:</h2>}
          <video
            ref={videoRef}
            controls
            style={{
              marginLeft: "375px",
              width: "50%",
              height: "auto",
              borderRadius: "8px",
              border: "1px white solid",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>

        {/* For Fog or Rain */}
        <DropdownSide sideElements={["Fog", "Rain"]} 
          onChange={(e) => {
            useEffect(() => (setFilter(e.target.value)))
          }}
        />
        <button
          style={{
            padding: "5px 10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "2px solid #4CAF50",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
            marginLeft: "2px",
            fontWeight: "bold",
          }}
          onClick={handlePlay}
        >
          Play Stream
        </button>
        {/* To conditionally place filters */}
        {filter === "Fog" && <FogFilter />}
        {filter === "Rain" && <RainFilter />}
        <CommonFilters />
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
// import { playbackURLToken } from '../../types'

// function HlsPlayer() {

//     const [playbackURLToken, setplaybackURLToken] = React.useState('');

//     const { register, handleSubmit, formState: { errors } } = useForm<playbackURLToken>();

//     return (
//         <>
//             <h1>HLS Stream Player</h1>

//             {/* A Logout button to be added */}

//             <Form
//                 onSubmit={handleSubmit(onSubmit)}
//             >
//                 <Input 
//                     {...register("playbackURLToken", { required: "URL is required" })}
//                     type="text"
//                     name="playbackURLToken"
//                     placeholder="Enter .m3u8 URL"
//                     className="w-full p-12 mb-20 border border-2 border-gray-300 border-radius-4 text-black text-base"
//                 />

//                 {errors.playbackURLToken && <p className="text-red-500">{errors.playbackURLToken.message}</p>}

//                 <button type="submit" className="bg-blue-500 text-white px-4 py-2">
//                     Submit
//                 </button>
//             </Form>
//         </>
//     )
// }

// export default HlsPlayer

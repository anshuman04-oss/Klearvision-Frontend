import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import { useDispatch } from "react-redux";
import { Device } from "../../types";
import { fetchPlaybackToken } from "../../api/deviceAPI";
import useAuth from "../../hooks/useAuth";
import { AppDispatch } from "../../app/store";
import { Button } from "@mui/material";

const HlsPlayer: React.FC<{ device?: Device }> = ({ device }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsInstance = useRef<Hls | null>(null);

  const { accessToken } = useAuth();

  useEffect(() => {
    if(device) {
      let needToFetchToken = false;
      if(!device.playBackToken) needToFetchToken = true;
      if(!device.tokenExpiry || device.tokenExpiry <= Date.now()/1000) needToFetchToken = true;
      if (accessToken && needToFetchToken) {
        dispatch(fetchPlaybackToken(device.deviceId, accessToken));
      }
    }
  }, [device, accessToken]);

  useEffect(() => {
    return () => {
      // Cleanup HLS instance on unmount
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
        hlsInstance.current = null;
      }
    };
  }, []);

  const handlePlay = () => {
    if (!device?.playBackUrl || !device.playBackToken) {
      console.error("Playback URL or token is missing.");
      return;
    }

    const playbackURLToken = `${device.playBackUrl}?token=${device.playBackToken}`;
    // const playbackURLToken = `https://9f18fad97252.ap-south-1.playback.live-video.net/api/video/v1/ap-south-1.495846082945.channel.xYRQgBuqgDAd.m3u8`;

    if (hlsInstance.current) {
      hlsInstance.current.destroy();
      hlsInstance.current = null;
    }

    if (Hls.isSupported()) {
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

        hls.on(Hls.Events.ERROR, (data) => {
          console.error("HLS Error:", data);
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
  };

  return (
    <div
      className="hls-player-container"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h1 className="text-gray-50 text-4xl font-bold mt-10">Playing Your Video</h1>

      <div
        className="video-container"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          maxWidth: "1000px",
          position: "relative",
        }}
      >
        {isPlaying && <h2>Stream is now playing:</h2>}
        {device && device.playBackUrl && device.playBackToken && (
          <video
            ref={videoRef}
            controls
            style={{
              width: "50%",
              height: "auto",
              borderRadius: "8px",
              border: "1px solid white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        )}
      </div>

      <Button
        style={{
          padding: "5px 10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "2px solid #4CAF50",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
          fontWeight: "bold",
        }}
        onClick={handlePlay}
      >
        Play Stream
      </Button>
    </div>
  );
};

export default HlsPlayer;

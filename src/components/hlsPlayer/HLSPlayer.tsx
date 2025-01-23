/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import { useDispatch } from "react-redux";
import { Device } from "../../types";
import { useParams } from "react-router-dom";
import { fetchPlaybackToken } from "../../api/deviceAPI";
import CommonFilters from "../commonFilters/CommonFilters";
import DropdownSide from "../DropdownSide";
import FogFilter from "../fog/FogFilter";
import RainFilter from "../rainFilter/RainFilter";
import useAuth from "../../hooks/useAuth";
import useDevice from "../../hooks/useDevice";
import { AppDispatch } from "../../app/store";

const HlsPlayer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [device, setDevice] = useState<Device | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsInstance = useRef<Hls | null>(null);
  const [filter, setFilter] = useState<string>("Fog");

  const { deviceId } = useParams<{ deviceId: string }>();
  const { accessToken } = useAuth();
  const { devices } = useDevice();

  useEffect(() => {
    if (devices && deviceId) {
      setDevice(devices[deviceId]);
    }
  }, [devices, deviceId]);

  useEffect(() => {
    if(device) {
      let needToFetchToken = false;
      if(!device.playBackToken) needToFetchToken = true;
      if(!device.tokenExpiry || device.tokenExpiry <= Date.now()/1000) needToFetchToken = true;
      if (accessToken && needToFetchToken) {
        dispatch(fetchPlaybackToken(device.deviceId, accessToken));
      }
    }
  }, [device, accessToken, dispatch]);

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

      <DropdownSide
        sideElements={["Fog", "Rain"]}
        onChange={(e) => setFilter(e.target.value)}
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
          fontWeight: "bold",
        }}
        onClick={handlePlay}
      >
        Play Stream
      </button>

      {filter === "Fog" && <FogFilter />}
      {filter === "Rain" && <RainFilter />}
      <CommonFilters />
    </div>
  );
};

export default HlsPlayer;

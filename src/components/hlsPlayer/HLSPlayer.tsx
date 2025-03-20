import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import { useDispatch } from "react-redux";
import { Device } from "../../types";
import { fetchPlaybackToken } from "../../api/deviceAPI";
import CommonFilters from "../commonFilters/CommonFilters";
import DropdownSide from "../DropdownSide";
import useAuth from "../../hooks/useAuth";
import { AppDispatch } from "../../app/store";
import FogFilter from "./filters/FogFilter";
import RainFilter from "./filters/RainFilter";

const HlsPlayer: React.FC<{ device?: Device }> = ({ device }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);   // 
  // const [device, setDevice] = useState<Device | undefined>(undefined);
  // const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsInstance = useRef<Hls | null>(null);
  const [filter, setFilter] = useState<string>("Fog");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
        hlsInstance.current = null;
      }
  //   };
  // }, []);

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
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }
  handlePlay();
}}, [socket, stream]);

  const handleStreamStart = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('getUserMedia is not supported in your browser.');
        return;
      }

      // console.log("Inside handleStartStream");

      const constraints = {
        // video: {
        //   width: { ideal: 1280 },
        //   height: { ideal: 720 },
        //   frameRate: { ideal: 30 }
        // },
        audio: true,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      console.log(mediaStream);
      // Stream is null now
      // mediaStream is not null

      const newSocket = new WebSocket('ws://13.201.146.30/ws/');
      setSocket(newSocket);

      console.log(newSocket);

      newSocket.onopen = () => {
        // console.log('Inside onopen in newSocket')
        console.log('✅ WebSocket connection established.');
        const recorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm; codecs=vp8' });
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && newSocket.readyState === WebSocket.OPEN) {
            newSocket.send(event.data);
          }
        };

        recorder.start(100);
      };
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  console.log(isPlaying);   // This is false every time

  const handleStreamStop = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (socket) {
      socket.close();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (isPlaying) {
      setIsPlaying(isPlaying);
    }
  }, [isPlaying]);
  return (
    <div className="hls-player-container" style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="text-gray-50 text-4xl font-bold mt-10">Playing Your Video</h1>
      <div className="video-container" style={{ display: "flex", justifyContent: "center", marginTop: "30px", maxWidth: "1000px", position: "relative" }}>
        {isPlaying && <h2>Stream is now playing:</h2>}
        {/* {if(isPlaying) setIsPlaying(isPlaying);} */}
        {device && device.playBackUrl && device.playBackToken && (
          <video ref={videoRef} controls style={{ width: "50%", height: "auto", borderRadius: "8px", border: "1px solid white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} />
        )}
      </div>
      <DropdownSide sideElements={["Fog", "Rain"]} onChange={(e) => setFilter(e.target.value)} />
      <button onClick={handleStreamStart} style={{ padding: "5px 10px", backgroundColor: "#4CAF50", color: "white", border: "2px solid #4CAF50", borderRadius: "4px", cursor: "pointer", marginTop: "10px", fontWeight: "bold" }}>Start Streaming</button>
      <button onClick={handleStreamStop} style={{ padding: "5px 10px", backgroundColor: "#F44336", color: "white", border: "2px solid #F44336", borderRadius: "4px", cursor: "pointer", marginTop: "10px", fontWeight: "bold", marginLeft: "10px" }}>Stop Streaming</button>
      {filter === "Fog" && <FogFilter />}
      {filter === "Rain" && <RainFilter />}
      <CommonFilters />
    </div>
  );
};

export default HlsPlayer;
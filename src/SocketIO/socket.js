"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
var ws_1 = require("ws");
var fluent_ffmpeg_1 = require("fluent-ffmpeg");
var ffmpeg_static_1 = require("ffmpeg-static");
var rtmp_client_1 = require("rtmp-client");
// Configure RTMP client
var rtmpClient = new rtmp_client_1.RTMPClient();
rtmpClient.connect('rtmp://<server-ip>/live/stream_name'); // Update RTMP URL
// Set ffmpeg path
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
var wss = new ws_1.default.Server({ port: 8080 });
wss.on('connection', function (ws) {
    console.log('WebSocket connection established.');
    // Buffer to accumulate video chunks
    var videoBuffer = [];
    ws.on('message', function (data) {
        videoBuffer.push(data);
        // Stream video to RTMP when buffer reaches threshold
        if (videoBuffer.length > 30) {
            var videoStream = Buffer.concat(videoBuffer);
            videoBuffer = [];
            // Use FFmpeg to send video to RTMP server
            (0, fluent_ffmpeg_1.default)()
                .input(videoStream)
                .inputFormat('mpegts')
                .videoCodec('libx264')
                .audioCodec('aac')
                .format('flv')
                .output(rtmpClient)
                .on('error', function (err) { return console.error('FFmpeg error:', err); })
                .run();
        }
    });
    ws.on('close', function () {
        console.log('WebSocket connection closed.');
    });
});
// import http from 'http'
// import express from 'express'
// import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
// import path from 'path'
// import { Server as SocketIO } from 'socket.io'
// import API_BASE_URL from '../constants'
// import axios from 'axios'
// // import cors from 'cors'
// // import { useSelector } from 'react-redux'
// // import { RootState } from '@reduxjs/toolkit/query'
// // import { DeviceState } from '../types'
// // import { error } from 'console'
// // import { data } from 'react-router-dom'
// // import { Stream } from 'stream'
// const app  = express()
// const server = http.createServer(app)
// const io = new SocketIO(server);
// // const corsOptions = {
// //     origin: 'http://localhost:5000',
// //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //     allowedHeaders: ['Content-Type', 'Authorization'],
// // }
// let pbToken = "";
// let pbUrl = "";
// let expirationTime = 0;
// // So, now we have to call api for getting the playback token.
// const getPBToken = async (deviceId: string) => {
//     try {
//         const endPoint = `${API_BASE_URL}/v1/auth/playbackToken`;
//         const response = await axios.post(endPoint, {
//             "deviceId" : "a65561fb-138a-4da0-a6f4-b77e0d367973"
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrbGVhcnZpc2lvbi5jb20iLCJ1c2VyIjp7ImlkIjoiNDZhYzFhMGYtMmY5OC00MTIyLWFkZTktZDAwMDRiNzIzZWYyIiwibmFtZSI6ImFicmFyQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbImRldmljZS1yZWdpc3RlciIsInN0cmVhbS1wbGF5YmFjayJdfSwiYXV0aGVudGljYXRpb25UeXBlIjoiUEFTU1dPUkQiLCJpYXQiOjE3MzY5NjIwNTEsImV4cCI6MTczNjk2NTY1MX0.Xciehrhc6sXLq9BMxC8aY7Ty-5IJCV-F9Ihcd3WZdRg'
//             }
//         })
//         if(response) {
//             pbUrl = response.data.playBackUrl
//             pbToken = response.data.playbackAccessToken
//             expirationTime = response.data.expiration
//             console.log(`${pbUrl}?token=${pbToken}`)
//         }
//     } catch (error) {
//         console.error("Error fetching playback token: ", error)
//     }
// } 
// getPBToken("f8296422-735d-40c3-8616-36b02270a522")
// // app.use(cors(corsOptions))
// const options: string[] = [
//     '-i',
//     '-',
//     '-vf', 'scale=1280:720',
//     'aspect', '16:9',
//     '-c:v', 'libx264',
//     '-preset', 'ultrafast',
//     '-tune', 'zerolatency',
//     '-r', `<input-frame-rate>`,                       // ${25}
//     '-g', `${25 * 2}`,
//     '-keyint_min', '25',
//     '-crf', '25',
//     '-pix_fmt', 'yuv420p',                            // This attribute to be checked to ensure compatibility
//     '-sc_threshold', '0',
//     '-profile:v', 'main',
//     '-level', '3.1',
//     '-c:a', 'aac',
//     '-b:a', '128k',
//     '-ar', '32000',
//     '-f', 'flv',
//     `rtmp://VideoProcessingServerASG-NLB-49b63e78c9aa7744.elb.ap-south-1.amazonaws.com:443/live/sk_53RKgM8XBON1ZxHvtDifbd_9vXJVnl5n4LUcZ3JGTGgh7va0bLdFf`,
// ];
// // We are getting an error on running straightaway. Docker was needed for running without installing 
// // ffmpeg in our system. However, with proper installation of ffmpeg and addition of it as an environment 
// // variable, docker is no longer required.
// const ffmpegProcess: ChildProcessWithoutNullStreams = spawn('ffmpeg', options);
// // We are basically adding two event listeners on output and error we have got
// ffmpegProcess.stdout.on('data', (data) => {
//     console.log(`ffmpeg stdout: ${data}`)
//     console.log(`Here at stdout`)
// })
// ffmpegProcess.stderr.on('data', (data) => {
//     console.error(`ffmpeg stderr: ${data}`)
//     console.log(`Here at stderr`)
// })
// ffmpegProcess.on('close', (code) => {
//     console.log(`ffmpeg process exited with code ${code}`)
//     if(code != 0) {
//         console.error('ffmpeg exited unexpectedly')
//     }
// })
// ffmpegProcess.on('error', (err) => {
//     console.error(`ffmpeg process error ${err}`)
// })
// app.use(express.static(path.resolve('./public')))
// io.on('connection', socket => {
//     console.log("Socket connected", socket.id)
//     socket.on('binarystream', streamData => {
//         // const buffer = Buffer.from(new streamData)
//         console.log('Binary string incoming...')
//         if(ffmpegProcess.stdin.writable) {
//             ffmpegProcess.stdin.write(streamData, (err) => {
//                 console.log('Err: ', err)
//             })
//         } else {
//             console.error('ffmpeg stdin is not writable')
//         }
//     })
//     socket.on('disconnect', () => {
//         if(!ffmpegProcess.stdin.destroyed) ffmpegProcess.stdin.end()
//         console.log(`Socket disconnected ${socket.id}`)
//     })
// })
// // app.get('example)
// server.listen(5000, () => console.log(`HTTP Server is running on port 5173`))

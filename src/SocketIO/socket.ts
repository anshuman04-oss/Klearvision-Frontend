import WebSocket, { WebSocketServer } from 'ws';    // Peace hai iska
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

// Create a WebSocket server on port 8001
const wsServer = new WebSocketServer({ port: 8001 }, () => {
  console.log('✅ WebSocket server started on port 8001');
});

wsServer.on('connection', (socket: WebSocket) => {
  console.log('🔗 WebSocket client connected.');

  // Spawn the FFmpeg process
  const ffmpeg: ChildProcessWithoutNullStreams = spawn('ffmpeg', [
    '-rtbufsize', '4M',             // Moderate buffer size (4MB) for stability
    '-i', 'pipe:0',                 // Input from standard input (stdin)

    '-c:v', 'libx264',              // H.264 video codec
    '-preset', 'veryfast',          // Balance between quality and encoding speed
    '-tune', 'film',                // Optimized for better quality at standard latency
    '-crf', '20',                   // Constant Rate Factor for good quality
    '-g', '60',                     // GOP (Group of Pictures) set to 60 for keyframes every 2 sec
    '-keyint_min', '30',            // Minimum keyframe interval (1 sec)

    '-c:a', 'aac',                  // AAC audio codec
    '-b:a', '160k',                 // Higher audio bitrate for better quality
    '-ar', '44100',                 // Audio sample rate for compatibility
    
    '-f', 'flv',                    // RTMP requires FLV format
    'rtmp://43.204.103.160/live/stream' // RTMP streaming server URL
  ]);

  // Handle incoming messages from WebSocket and write to FFmpeg's stdin
  socket.on('message', (data: WebSocket.RawData) => {
    if (ffmpeg.stdin.writable) {
      ffmpeg.stdin.write(data, (err) => {
        if (err) {
          console.error('❌ Error writing to FFmpeg stdin:', err);
        }
      });
    } else {
      console.warn('⚠️ FFmpeg stdin is not writable.');
    }
  });

  // Handle WebSocket errors
  socket.on('error', (err: Error) => {
    console.error('❌ WebSocket error:', err);
    cleanup();
  });

  // Handle WebSocket closure
  socket.on('close', () => {
    console.log('🔌 WebSocket client disconnected.');
    cleanup();
  });

  // Capture FFmpeg stderr output
  ffmpeg.stderr.on('data', (chunk: Buffer) => {
    console.error(`🎥 FFmpeg error: ${chunk.toString()}`);
  });

  // Handle FFmpeg process exit
  ffmpeg.on('exit', (code: number | null, signal: string | null) => {
    console.log(`⚠️ FFmpeg exited with code ${code} and signal ${signal}`);
    cleanup();
  });

  // Handle FFmpeg process errors
  ffmpeg.on('error', (err: Error) => {
    console.error('❌ FFmpeg process error:', err);
    cleanup();
  });

  // Cleanup function to terminate FFmpeg process
  function cleanup() {
    if (!ffmpeg.killed) {
      ffmpeg.stdin.end();
      ffmpeg.kill('SIGTERM');
    }
  }
});

console.log('🚀 WebSocket server listening on ws://localhost:8001');




































// import http from 'http'
// import express from 'express'
// import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
// import path from 'path'
// import { Server as SocketIO } from 'socket.io'
// // import { error } from 'console'
// // import { data } from 'react-router-dom'
// // import { Stream } from 'stream'

// const app  = express()
// const server = http.createServer(app)
// const io = new SocketIO(server);

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
//     `rtmp://13.234.113.75/live/`,
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

// server.listen(5173, () => console.log(`HTTP Server is running on port 5173`))
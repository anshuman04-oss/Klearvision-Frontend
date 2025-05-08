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
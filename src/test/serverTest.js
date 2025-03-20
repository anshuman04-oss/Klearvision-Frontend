import WebSocket, { WebSocketServer } from 'ws';
import { spawn } from 'child_process';

// Create a WebSocket server on port 8001
const wsServer = new WebSocketServer({ port: 9000 });
const port = wsServer.options.port;

wsServer.on('connection', (socket) => {
  console.log('🔗 WebSocket client connected.');

  const ffmpeg = spawn('ffmpeg', [
  '-fflags', '+genpts+nobuffer',
  '-i', 'pipe:0',
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-tune', 'zerolatency',
  '-profile:v', 'baseline',
  '-x264-params', 'keyint=30:min-keyint=30',
  '-bufsize', '3000k',
  '-maxrate', '2500k',
  '-fps_mode', 'cfr',        // Updated from -vsync
  '-g', '30',  '-f', 'flv',
  '-flvflags', 'no_duration_filesize',
  'rtmp://65.1.34.136/live/stream'
]);

  // Write incoming WebSocket messages to FFmpeg's stdin.
  socket.on('message', (data) => {
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

  // Log FFmpeg stderr for debugging.
  ffmpeg.stderr.on('data', (chunk) => {
    console.error(`🎥 FFmpeg error: ${chunk.toString()}`);
  });

  // Handle WebSocket errors.
  socket.on('error', (err) => {
    console.error('❌ WebSocket error:', err);
    cleanup();
  });

  // When WebSocket closes, clean up FFmpeg process.
  socket.on('close', () => {
    console.log('🔌 WebSocket client disconnected.');
    cleanup();
  });

  // Handle FFmpeg process exit.
  ffmpeg.on('exit', (code, signal) => {
    console.log(`⚠️ FFmpeg exited with code ${code} and signal ${signal}`);
    cleanup();
  });

  // Handle FFmpeg process errors.
  ffmpeg.on('error', (err) => {
    console.error('❌ FFmpeg process error:', err);    cleanup();
  });

  // Cleanup function to gracefully terminate the FFmpeg process.
  function cleanup() {
    if (!ffmpeg.killed) {
      ffmpeg.stdin.end();
      ffmpeg.kill('SIGTERM');
    }
  }
});

console.log(`🚀 WebSocket server listening on ws://localhost:${port}`);
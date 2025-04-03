export const WS_ERROR_CODES = {
  INVALID_PROCESS: 4000,
  FFMPEG_SPAWN_ERROR: 4001,
  FFMPEG_STREAM_ERROR: 4002,
  FFMPEG_WRITE_ERROR: 4003,
  INTERNAL_ERROR: 4500
} as const;

export const getErrorMessage = (code: number, message?: string): string => {
  switch (code) {
    case WS_ERROR_CODES.INVALID_PROCESS:
      return `Invalid process type: ${message}`;
    case WS_ERROR_CODES.FFMPEG_SPAWN_ERROR:
      return `Failed to start streaming service: ${message}`;
    case WS_ERROR_CODES.FFMPEG_STREAM_ERROR:
      return `Streaming error: ${message}`;
    case WS_ERROR_CODES.FFMPEG_WRITE_ERROR:
      return `Failed to process video data: ${message}`;
    case WS_ERROR_CODES.INTERNAL_ERROR:
      return `Server error: ${message}`;
    default:
      return message || 'Unknown error occurred';
  }
}; 
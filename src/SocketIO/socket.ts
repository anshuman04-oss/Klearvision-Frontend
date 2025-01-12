import http from 'http'
import express from 'express'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import path from 'path'
import { Server as SocketIO } from 'socket.io'
// import { error } from 'console'
// import { data } from 'react-router-dom'
// import { Stream } from 'stream'

const app  = express()
const server = http.createServer(app)
const io = new SocketIO(server);

const options: string[] = [
    '-i',
    '-',
    '-vf', 'scale=1280:720',
    'aspect', '16:9',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-r', `<input-frame-rate>`,                       // ${25}
    '-g', `${25 * 2}`,
    '-keyint_min', '25',
    '-crf', '25',
    '-pix_fmt', 'yuv420p',                            // This attribute to be checked to ensure compatibility
    '-sc_threshold', '0',
    '-profile:v', 'main',
    '-level', '3.1',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '32000',
    '-f', 'flv',
    `rtmp://13.234.113.75/live/`,
];
// We are getting an error on running straightaway. Docker was needed for running without installing 
// ffmpeg in our system. However, with proper installation of ffmpeg and addition of it as an environment 
// variable, docker is no longer required.

const ffmpegProcess: ChildProcessWithoutNullStreams = spawn('ffmpeg', options);

// We are basically adding two event listeners on output and error we have got
ffmpegProcess.stdout.on('data', (data) => {
    console.log(`ffmpeg stdout: ${data}`)
    console.log(`Here at stdout`)
})

ffmpegProcess.stderr.on('data', (data) => {
    console.error(`ffmpeg stderr: ${data}`)
    console.log(`Here at stderr`)
})

ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process exited with code ${code}`)
    if(code != 0) {
        console.error('ffmpeg exited unexpectedly')
    }
})

ffmpegProcess.on('error', (err) => {
    console.error(`ffmpeg process error ${err}`)
})

app.use(express.static(path.resolve('./public')))

io.on('connection', socket => {
    console.log("Socket connected", socket.id)
    socket.on('binarystream', streamData => {
        // const buffer = Buffer.from(new streamData)
        console.log('Binary string incoming...')
        if(ffmpegProcess.stdin.writable) {
            ffmpegProcess.stdin.write(streamData, (err) => {
                console.log('Err: ', err)
            })
        } else {
            console.error('ffmpeg stdin is not writable')
        }
    })

    socket.on('disconnect', () => {
        if(!ffmpegProcess.stdin.destroyed) ffmpegProcess.stdin.end()
        console.log(`Socket disconnected ${socket.id}`)
    })
})

server.listen(5173, () => console.log(`HTTP Server is running on port 5173`))
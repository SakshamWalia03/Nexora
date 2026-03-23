import { Server } from 'socket.io'
import config from '../config/config.js';

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                const allowedOrigins = ["http://localhost:5173", config.FRONTEND_URL];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error(`Socket CORS: Origin ${origin} not allowed`));
                }
            },
            credentials: true
        }
    })

    io.on("connection", (socket) => {
        console.log("A user connected with ", socket.id);
    })
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}
import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import config from './src/config/config.js';
import http from 'http';
import { initSocket } from './src/sockets/server.socket.js';

const PORT = config.PORT;

const httpServer = http.createServer(app)

initSocket(httpServer)

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
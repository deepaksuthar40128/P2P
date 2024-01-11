import express, { Request, Response } from 'express';
import homeRoutes from './routes/home'
import path from 'path'
import { Server } from "socket.io";
import http from "http";
import { ioFunction } from './controller/io';

const app = express();
const server = http.createServer(app);

app.use(homeRoutes);
app.use(express.static(path.join(__dirname, 'static')))



const io = new Server(server);
ioFunction(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

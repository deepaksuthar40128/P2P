"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const home_1 = __importDefault(require("./routes/home"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const io_1 = require("./controller/io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(home_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, 'static')));
const io = new socket_io_1.Server(server);
(0, io_1.ioFunction)(io);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

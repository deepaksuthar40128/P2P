"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const socket_io_client_1 = require("socket.io-client");
const io_1 = require("../controller/io");
describe("Socket.IO Server Tests", () => {
    let io, clientSocket, httpServer;
    beforeAll((done) => {
        httpServer = (0, http_1.createServer)();
        io = new socket_io_1.Server(httpServer);
        (0, io_1.ioFunction)(io);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = (0, socket_io_client_1.io)(`http://localhost:${port}`);
            clientSocket.on("connect", done);
        });
    });
    afterAll(() => {
        io.close();
    });
    test("should create room and notify userJoined", (done) => {
        clientSocket.emit("createRoom", "room1", "user123");
        done();
    });
});

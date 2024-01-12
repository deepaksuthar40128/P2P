import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { AddressInfo } from "net";
import { io as ioc, Socket as ClientSocket } from "socket.io-client"; 
import { ioFunction } from "../controller/io";

describe("Socket.IO Server Tests", () => {
    let io: Server, clientSocket: ClientSocket, httpServer: any;

    beforeAll((done) => {
        httpServer = createServer();
        io = new Server(httpServer);

        ioFunction(io);

        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            clientSocket = ioc(`http://localhost:${port}`) as ClientSocket;
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

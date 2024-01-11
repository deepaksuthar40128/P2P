import { Server, Socket } from "socket.io";

type usersType = {
    [key: string]: string
}
let users: usersType = {};
export const ioFunction = (io: Server) => {
    io.on('connection', (socket: Socket) => {

        socket.on('createRoom', (roomName: string, userId: string) => {
            users[userId] = socket.id;
            socket.join(roomName);
            socket.to(roomName).emit('userJoined', userId);
        });

        socket.on('message', (userId: string, peerId: string, message: string) => {
            io.to(users[userId]).emit('message', message, peerId);
        })

        socket.on('leavingRoom', (peerId: string, roomName: string) => {
            console.log(peerId);
            delete users[peerId];
            socket.to(roomName).emit('leave');
        })

        socket.on('disconnect', () => {
            for (let key in users) {
                if (users[key] == socket.id) {
                    delete users[key];
                    break;
                }
            }
            socket.emit('leave');
        })

    });
}; 
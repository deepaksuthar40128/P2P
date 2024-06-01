"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioFunction = void 0;
let users = {};
const ioFunction = (io) => {
    io.on('connection', (socket) => {
        socket.on('createRoom', (roomName, userId) => {
            users[userId] = socket.id;
            socket.join(roomName);
            socket.to(roomName).emit('userJoined', userId);
        });
        socket.on('message', (userId, peerId, message) => {
            io.to(users[userId]).emit('message', message, peerId);
        });
        socket.on('leavingRoom', (peerId, roomName) => {
            console.log(peerId);
            delete users[peerId];
            socket.to(roomName).emit('leave');
        });
        socket.on('disconnect', () => {
            for (let key in users) {
                if (users[key] == socket.id) {
                    delete users[key];
                    break;
                }
            }
            socket.emit('leave');
        });
    });
};
exports.ioFunction = ioFunction;

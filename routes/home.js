"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const basePath = path_1.default.resolve(path_1.default.resolve(), 'views');
const shareFile = (file) => {
    return path_1.default.join(basePath, `${file}.html`);
};
app.get('/', (req, res) => {
    res.sendFile(shareFile('home'));
});
app.get('/room', (req, res) => {
    res.sendFile(shareFile('room'));
});
exports.default = app;

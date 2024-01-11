import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const basePath = path.resolve(path.resolve(), 'views');

const shareFile = (file: string): string => {
    return path.join(basePath, `${file}.html`);
};

app.get('/', (req: Request, res: Response) => {
    res.sendFile(shareFile('home'));
});

app.get('/room', (req: Request, res: Response) => {
    res.sendFile(shareFile('room'));
})

export default app;
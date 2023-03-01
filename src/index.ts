import express, { Request, Response } from 'express';
import {CONFIG} from './config'

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
    console.log(CONFIG.TEST)
});


app.post('/example', (req: Request, res: Response) => {

});


import express, { Request, Response } from 'express';
import {CONFIG} from './config'
import {Bot} from './bot'
import { UserGateway } from './dataAccess';
import User from './DTOs';

const app = express();

app.use(express.json());

app.listen(5000, () => {
    console.log('Servidor iniciado en el puerto 5000');
    console.log(CONFIG.TEST)
    const userDataAccessService = UserGateway.getInstance();
    const bot = new Bot(userDataAccessService);
    let result =userDataAccessService.getUserData("LowLife2000")
    console.log(result)
});

app.post('/findPhone', (req: Request, res: Response) => {
  
    //if(req.body.username){
    //    bot.enviarMensajeDeAlerta(req.body.username)
    //}
});

app.post('/register', (req: Request, res: Response) => {

});

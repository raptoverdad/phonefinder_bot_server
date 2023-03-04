import express, { Request, Response } from 'express';
import {CONFIG} from './config'
import {Bot} from './bot'
import { UserGateway } from './dataAccess';
import User from './DTOs';

const app = express();

app.use(express.json());

app.listen(5000, () => {
    console.log("server listening on port 5000")
});

app.post('/findPhone', async(req: Request, res: Response) => {
    if(req.body.username)
    {
        const userDataAccessService =await UserGateway.getInstance();
        if(userDataAccessService != null)
        {
            const bot =await new Bot(userDataAccessService);
            if(bot instanceof Bot)
            {
                let result=await userDataAccessService.getUserData(req.body.username)
                if(result != null)
                {
                    bot.enviarMensajeDeAlerta(req.body.username)
                }
            }
            
        }        
    }
});

app.post('/register', (req: Request, res: Response) => {

});

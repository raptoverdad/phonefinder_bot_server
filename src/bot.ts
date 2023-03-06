import { User } from './DTOs';
import express, { Request, Response } from 'express';
import { Telegraf, Context } from 'telegraf';
import { UserGateway } from './dataAccess';
import {CONFIG} from './config'


export class Bot 
{
  
  private bot: Telegraf<Context>;
  private userGateway: UserGateway;
  private sendAlerts: boolean;

  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
    this.bot = new Telegraf(CONFIG.TELEGRAM_TOKEN);
    this.sendAlerts = true;
    this.iniciar()
  }

 private async iniciar(): Promise<void> {
      //funcion que escucha los mensajes de la gente
      this.bot.hears(/^[0-9]{10,11}$/,async (ctx) => {
        const chatId = ctx.chat?.id.toString();
        if (chatId) {
          const username = ctx.message?.from?.username;
          if (username) {
            const user = new User(username,chatId);
            let serverResponse=await this.userGateway.insertData(user);
            if (serverResponse == true){
                ctx.reply(`Hi ${username}, your phone has been successfully registered`);
            }else{
                ctx.reply(`Hi ${username}, your phone has NOT been successfully registered. please try again later`);
            }
            
          }
        }
      });
       this.bot.hears('stop', (ctx) => {
        ctx.reply('you found your phone 👍');
        this.sendAlerts = false;       
      });
    await this.bot.launch();

  }

  detener(): void {
    this.bot.stop();
  }

  async enviarMensajeDeAlerta(username: string): Promise<void> {
    
    try{
      this.sendAlerts=true
      let chatId = await this.userGateway.getUserData(username);
        if (chatId == null) {
          console.log('chatId es null:', chatId)
        
        }else{        
          const checkSendAlerts = setInterval(() => {
            const message = `Hi ${username}, your phone is here, type 'stop' to stop receiving this message`
            if(chatId){
                this.bot.telegram.sendMessage(chatId, message);
            }
            if(!this.sendAlerts){
                clearInterval(checkSendAlerts);   
            }                   
            }, 1000);
         }
       

    } catch (error) {
      console.log(error)
    }
  }
} 
   




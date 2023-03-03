import { User } from './DTOs';
import express, { Request, Response } from 'express';
import { Telegraf, Context } from 'telegraf';
import { UserGateway } from './dataAccess';
import {CONFIG} from './config'

export class Bot {
  private bot: Telegraf<Context>;
  private userGateway: UserGateway;
  public phoneLost:boolean;

  constructor(userGateway: UserGateway) {
    this.userGateway = userGateway;
    this.bot = new Telegraf(CONFIG.TELEGRAM_TOKEN);
    this.phoneLost=false
    this.bot.help((ctx) => ctx.reply('Send me a sticker'));
    this.bot.hears('stop', (ctx) =>{
        this.phoneLost=false
        ctx.reply('you found your phone 👍')

        }) ;
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
  }

  iniciar(): void {
    this.bot.launch();
  }

  detener(): void {
    this.bot.stop();
  }

  async enviarMensajeDeAlerta(username: string): Promise<void> {
    try {
      let chatId = await this.userGateway.getUserData(username);
      if (chatId == null) {
        console.log('chatId es null:',chatId)
      } else {
        const message = `Hi ${username}, your phone is here, type 'stop' to stop receiving this message`;
        if (!this.phoneLost) {
          this.phoneLost = true;
        }
        const sendMessage = new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        const phoneFound = new Promise<void>((resolve) => {
          const intervalId = setInterval(() => {
            if (!this.phoneLost) {
              clearInterval(intervalId);
              resolve();
            }
          }, 1000);
        });
        await Promise.race([sendMessage, phoneFound]);
        if (!this.phoneLost) {
          await this.bot.telegram.sendMessage(chatId, message);
        }
      }
    } catch (error) {
      console.log(error)
    }
   
  }
}




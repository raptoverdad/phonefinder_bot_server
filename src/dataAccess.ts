import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';
import { User } from './DTOs';
import {CONFIG} from './config'


export class UserGateway {
  private static instance: UserGateway;
  private connection: mysql.Connection | null;

  private constructor(){
    this.connection = null;
  }

  public static async getInstance(): Promise<UserGateway> {
    if (!UserGateway.instance) {
      UserGateway.instance = new UserGateway();
      let setup=await UserGateway.instance.setupDatabase();
    }
    return UserGateway.instance;
  }

  public async insertData(user: User): Promise<boolean> {
    let result: boolean=false;
    try {
        const sql = 'INSERT INTO users (username, chatid) VALUES (?, ?)';
        const values = [user.username, user.chatid];
        if(this.connection){
           const [rows] = await this.connection.execute(sql, values);
           if(rows)
           {
           result=true
           }
        }     
        return result
    } catch (error) {
        result=false
        return result
    }

    
  }

  public async getUserData(user: string): Promise<string | null > {
    console.log("DATA ACCESS:getuserdata function")
    try {
      let result: null |string =null;

      if (this.connection) {
        console.log("connection ")
        const sql = 'SELECT chatid FROM users WHERE username = ?';
        const values = [user];
        console.log('DATA ACCESS:connection established')
        const [rows] = await this.connection.execute<RowDataPacket[]>(sql, values);
        console.log("hola",rows)
        if (rows.length > 0) {
            console.log('i see results')
            result=rows[0].chatid
            console.log(typeof(result))
          } else {
            console.log('DATA ACCESS:something weird is happening here')
          }
      }else{
        console.log("connection to the database interrupted")
      }
      console.log('DATA ACCESS:lets see what the result variablw returns in the dataccess file:',result)
      return result
    } catch (error) {
      console.log(error)
      let result=null
      return result;
    }
   
  }

  private async setupDatabase(): Promise<boolean> {
   
    try{
        this.connection = await mysql.createConnection({
            host: CONFIG.MYSQL_HOST,
            user: CONFIG.MYSQL_USER,
            password: CONFIG.MYSQL_PASSWORD,
            database: CONFIG.MYSQL_DATABASE,
          });
          console.log('DATA ACCESS:Connection established successfully');
          const tableName = 'users';
          const createTable = `CREATE TABLE IF NOT EXISTS ${tableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255),
            chatid VARCHAR(255)
          )`;
          const [rows] = await this.connection.execute(createTable);
          let result=true
          return result
    }catch{
      console.log("DATA ACCESS:aqui el error")
        let result=false
        return result
    }

  }
}
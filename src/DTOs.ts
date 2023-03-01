export class User{
    username: string;
    chatid: string;
  
    constructor(username: string, chatid: string) {
      this.username = username;
      this.chatid = chatid;
    }
}
export default User
//const user1 = new User("johndoe", "12345");
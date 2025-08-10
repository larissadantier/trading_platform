import HttpServer from "./HttpServer";
import { inject } from "./Registry";
import Signup from "./Signup";
import GetAccount from "./GetAccount";

// Interface Adapter
export default class AccountController {
  @inject("httpServer")
  httpServer!: HttpServer;
  @inject("signup")
  signup!: Signup;
  @inject("getAccount")
  getAccount!: GetAccount;

  constructor() { 
    this.httpServer.route('post', '/signup', async (params: any, body: any) => { 
      const output = await this.signup.execute(body);
      return output;
    })
    
    this.httpServer.route('get', '/accounts/:accountId', async (params: any, body: any) => {
      const output = await this.getAccount.execute(params.accountId);
      return output;
    });
  }
}
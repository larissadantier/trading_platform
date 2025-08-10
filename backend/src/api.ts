import { AccountDAODatabase } from './AccountDAO';
import { AccountAssetDAODatabase } from './AccountAssetDAO';
import Registry from './Registry';
import { ExpressAdapter } from './HttpServer';
import { PgPromiseAdapter } from './DatabaseConnection';
import AccountController from './AccountController';
import Signup from './Signup';
import GetAccount from './GetAccount';
import Deposit from './Deposit';

// Entrypoint
async function main() {
  const httpServer = new ExpressAdapter();

Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
Registry.getInstance().provide('httpServer', httpServer);
Registry.getInstance().provide("signup", new Signup());
Registry.getInstance().provide("getAccount", new GetAccount());
Registry.getInstance().provide("deposit", new Deposit());

new AccountController(); 

httpServer.listen(3000);
}

main();
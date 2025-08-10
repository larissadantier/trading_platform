import { inject } from "./Registry";
import DatabaseConnection from "./DatabaseConnection";

export default interface AccountDAO {
  save(account: any): Promise<void>;
  getById (accountId: string): Promise<any>;
}
// Interface Adapter
export class AccountDAODatabase implements AccountDAO {
  @inject("databaseConnection")
  connection!: DatabaseConnection;

  async save(account: any): Promise<void> {
    await this.connection.query(`
      INSERT INTO ccca.account (account_id, name, email, document, password) VALUES ($1, $2, $3, $4, $5)`, 
      [account.accountId, account.name, account.email, account.document, account.password]);
  }

  async getById(accountId: string): Promise<any> {
    const [account] = await this.connection.query(`SELECT * FROM ccca.account WHERE account_id = $1`, [accountId]);
    return account;
  }
}

export class AccountDAOMemory implements AccountDAO {
  accounts: any[] = [];

  async save(account: any): Promise<void> {
    this.accounts.push(account);
  }
  async getById(accountId: string): Promise<any> {
    return this.accounts.find(account => account.accountId === accountId);
  }
}
import { inject } from "../di/Registry";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface AccountDAO {
  save(account: any): Promise<void>;
  update(account: any): Promise<void>;
  getById (accountId: string): Promise<any>;
}
// Interface Adapter
export class AccountDAODatabase implements AccountDAO {
  @inject("databaseConnection")
  connection!: DatabaseConnection;

  async save(account: any): Promise<void> {
    await this.connection.query(`
      INSERT INTO ccca.account (account_id, name, email, document, password) 
      VALUES ($1, $2, $3, $4, $5)`, 
      [account.accountId, account.name, account.email, account.document, account.password]);
  }

  async update(account: any): Promise<void> {
    await this.connection.query(`
      UPDATE ccca.account 
      SET name = $1, email = $2, document = $3, password = $4 WHERE account_id = $5
    `, [account.name, account.email, account.document, account.password, account.accountId])
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

  update(account: any): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getById(accountId: string): Promise<any> {
    return this.accounts.find(account => account.accountId === accountId);
  }
}
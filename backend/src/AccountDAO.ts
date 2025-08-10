import pg from 'pg-promise';
export default interface AccountDAO {
  save(account: any): Promise<void>;
  getById (accountId: string): Promise<any>;
}

export class AccountDAODatabase implements AccountDAO {
  async save(account: any): Promise<void> {
    const connection = pg()('postgres://postgres:123456@db:5432/app');
    await connection.query(`
      INSERT INTO ccca.account (account_id, name, email, document, password) VALUES ($1, $2, $3, $4, $5)`, 
      [account.accountId, account.name, account.email, account.document, account.password]);
    await connection.$pool.end();
  }

  async getById(accountId: string): Promise<any> {
    const connection = pg()('postgres://postgres:123456@db:5432/app');
    const [account] = await connection.query(`SELECT * FROM ccca.account WHERE account_id = $1`, [accountId]);
    await connection.$pool.end();
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
import pg from 'pg-promise';

export default interface AccountAssetDAO {
  deposit(accountAsset: any): Promise<void>;
  update(accountAsset: any): Promise<void>;
  getAccountById(accountId: string): Promise<void>;
}

export class AccountAssetDAODatabase implements AccountAssetDAO {
  async update(accountAsset: any): Promise<void> {
    const connection = pg()('postgres://postgres:123456@db:5432/app');
    await connection.query(`
      UPDATE ccca.account_asset 
      SET quantity = $1 
      WHERE account_id = $2 AND asset_id = $3
    `, [accountAsset.quantity, accountAsset.accountId, accountAsset.assetId])
    await connection.$pool.end();
  }
  
  async deposit(accountAsset: any): Promise<void> {
    const connection = pg()('postgres://postgres:123456@db:5432/app');
    await connection.query(`
      INSERT INTO ccca.account_asset (account_id, asset_id, quantity) 
      VALUES ($1, $2, $3)`, 
      [accountAsset.accountId, accountAsset.assetId, accountAsset.quantity])
    await connection.$pool.end();
  }

  async getAccountById(accountId: string): Promise<void> {
    const connection = pg()('postgres://postgres:123456@db:5432/app');
    const accountAssets = await connection.query(`
      SELECT * FROM ccca.account_asset WHERE account_id = $1
    `, [accountId])
    await connection.$pool.end();

    return accountAssets;
  }
}
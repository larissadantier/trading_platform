import pg from 'pg-promise';

export async function saveAccount( account: any) {
  const connection = pg()('postgres://postgres:123456@db:5432/app');
  await connection.query(`
    INSERT INTO ccca.account (account_id, name, email, document, password) VALUES ($1, $2, $3, $4, $5)`, 
    [account.accountId, account.name, account.email, account.document, account.password]);
  await connection.$pool.end();
}

export async function getAccountById(accountId: string) {
  const connection = pg()('postgres://postgres:123456@db:5432/app');
  const [account] = await connection.query(`SELECT * FROM ccca.account WHERE account_id = $1`, [accountId]);
  await connection.$pool.end();
  return account;
}
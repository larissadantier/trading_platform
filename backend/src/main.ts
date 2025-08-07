import pg from 'pg-promise';
import {randomUUID} from 'node:crypto';
import { validateName } from './validateName';
import { validateEmail } from './validateEmail';
import { validateCpf } from './validateCpf';
import { validatePassword } from './validatePassword';

const connection = pg()('postgres://postgres:123456@db:5432/app');

export async function signup(account: any) {
  const accountId = randomUUID();

  if (!validateName(account.name)) throw new Error('Invalid name');
  if (!validateEmail(account.email)) throw new Error('Invalid email');
  if (!validateCpf(account.document)) throw new Error('Invalid document');
  if (!validatePassword(account.password)) throw new Error('Invalid password');
  
  await connection.query(`
    INSERT INTO ccca.account (account_id, name, email, document, password) VALUES ($1, $2, $3, $4, $5)`, 
    [accountId, account.name, account.email, account.document, account.password]);

  return {
    accountId
  };
}

export async function getAccountById(accountId: string) {
  const [account] = await connection.query(`SELECT * FROM ccca.account WHERE account_id = $1`, [accountId]);
  return account;
}
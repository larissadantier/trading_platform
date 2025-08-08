import {randomUUID} from 'node:crypto';
import { validateName } from './validateName';
import { validateEmail } from './validateEmail';
import { validateCpf } from './validateCpf';
import { validatePassword } from './validatePassword';
import { getAccountById, saveAccount } from './data';

export async function signup(account: any) {
  account.accountId = randomUUID();

  if (!validateName(account.name)) throw new Error('Invalid name');
  if (!validateEmail(account.email)) throw new Error('Invalid email');
  if (!validateCpf(account.document)) throw new Error('Invalid document');
  if (!validatePassword(account.password)) throw new Error('Invalid password');
  
  await saveAccount(account);

  return {
    accountId: account.accountId
  };
}

export async function getAccount(accountId: string) {
  const account = await getAccountById(accountId);
  return account;
}
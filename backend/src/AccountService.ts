import {randomUUID} from 'node:crypto';
import { validateName } from './validateName';
import { validateEmail } from './validateEmail';
import { validateCpf } from './validateCpf';
import { validatePassword } from './validatePassword';
import AccountDAO from './AccountDAO';

export default class AccountService  {
  constructor(readonly accountDAO: AccountDAO) { }

  async signup(account: any) {
    account.accountId = randomUUID();
  
    if (!validateName(account.name)) throw new Error('Invalid name');
    if (!validateEmail(account.email)) throw new Error('Invalid email');
    if (!validateCpf(account.document)) throw new Error('Invalid document');
    if (!validatePassword(account.password)) throw new Error('Invalid password');
    
    await this.accountDAO.save(account);
  
    return {
      accountId: account.accountId
    };
  }
  
  async getAccount(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}


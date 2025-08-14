import { randomUUID } from 'node:crypto';

import { validateCpf } from "./validateCpf";
import { validateEmail } from "./validateEmail";
import { validateName } from "./validateName";
import { validatePassword } from "./validatePassword";

// Use Case
export default class Account {
  balances: Balance[] = [];

  constructor(
    readonly accountId: string, 
    readonly name: string, 
    readonly email: string, 
    readonly document: string, 
    readonly password: string) {
    if (!validateName(name)) throw new Error('Invalid name');
    if (!validateEmail(email)) throw new Error('Invalid email');
    if (!validateCpf(document)) throw new Error('Invalid document');
    if (!validatePassword(password)) throw new Error('Invalid password');
  }

  static create(name: string, email: string, document: string, password: string) {
    const accountId = randomUUID();
    const account = new Account(accountId, name, email, document, password);
    return account;
  }

  deposit(assetId: string, quantity: number) { 
    const balance = this.balances.find((balance: Balance) => balance.assetId === assetId);

    if(balance) balance.quantity += quantity;
    if(!balance) this.balances.push({assetId, quantity});
  }

  withdraw(assetId: string, quantity: number) { 
    const balance = this.balances.find((balance: Balance) => balance.assetId === assetId);
    if (!balance || balance.quantity < quantity) throw new Error('Insufficient funds');
    balance.quantity -= quantity;
  }
}

type Balance = {
  assetId: string;
  quantity: number;
}
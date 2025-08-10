import Account from "./Account";

export default interface AccountRepository { 
  save(account: Account): Promise<void>;
  getById(accountId: string): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  save(account: Account): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getById(accountId: string): Promise<void> {
    throw new Error("Method not implemented.");
  } 
  
}
import { inject } from "./Registry";
import AccountDAO from "./AccountDAO";
import AccountAssetDAO from "./AccountAssetDAO";

// Use Case
export default class GetAccount {
  @inject("accountDAO")
  accountDAO!: AccountDAO;
  @inject("accountAssetDAO")
  accountAssetDAO!: AccountAssetDAO;

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountDAO.getById(accountId);
    if(!account) throw new Error('Account not found');
    account.balances = await this.accountAssetDAO.getAccountById(accountId);
    return account;
   }
}

type Output = {
  accountId: string;
  name: string;
  email: string;
  document: string;
  balances: {  
    asset_id: string;
    quantity: string;}[];
}
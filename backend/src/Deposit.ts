import AccountAssetDAO from "./AccountAssetDAO";
import AccountDAO from "./AccountDAO";
import { inject } from "./Registry";

// Use Case
export default class Deposit {
  @inject("accountDAO")
  accountDAO!: AccountDAO;
  @inject("accountAssetDAO")
  accountAssetDAO!: AccountAssetDAO;
  
  async execute(input: Input): Promise<void> {
    const account = await this.accountDAO.getById(input.accountId);
    if(!account) throw new Error('Account not found');
    await this.accountAssetDAO.save(input);
  }
}

type Input = {
  accountId: string;
  assetId: string;
  quantity: number;
}
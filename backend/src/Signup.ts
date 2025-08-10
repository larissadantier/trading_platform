import AccountDAO from "./AccountDAO";
import { inject } from "./Registry";
import Account from './Account';

// Use Case
export default class Signup { 
  @inject("accountDAO")
  accountDAO!: AccountDAO;

  async execute(input: Input): Promise<Output> {
    const account = Account.create(input.name, input.email, input.document, input.password);
    await this.accountDAO.save(account);
  
    return {
      accountId: account.accountId
    };
  }
};

type Input = { 
  name: string;
  email: string;
  document: string;
  password: string;
}

type Output = {
  accountId: string;
}
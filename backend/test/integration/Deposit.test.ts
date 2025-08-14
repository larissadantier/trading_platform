import { randomUUID } from 'node:crypto';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { AccountAssetDAODatabase } from "../../src/infra/dao/AccountAssetDAO";
import { AccountDAODatabase } from "../../src/infra/dao/AccountDAO";
import Registry from "../../src/infra/di/Registry";
import Signup from '../../src/application/usecase/Signup';
import GetAccount from '../../src/application/usecase/GetAccount';
import Deposit from '../../src/application/usecase/Deposit';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;

beforeEach(() => { 
  connection = new PgPromiseAdapter();
  signup = new Signup();
  getAccount = new GetAccount();
  deposit = new Deposit();

  Registry.getInstance().provide("databaseConnection", connection);
  Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
  Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
  Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
  // const accountDAO = new AccountDAOMemory();
})

test('should be deposit in an account', async () => { 
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const outputSignup = await signup.execute(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 1000,
  }
  await deposit.execute(inputDeposit);
  const outputAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputAccount.balances[0].assetId).toBe("USD");
  expect(outputAccount.balances[0].quantity).toBe(1000);
})

test('should be not deposit in an account that not exists', async () => { 
  const inputDeposit = {
    accountId: randomUUID(),
    assetId: "USD",
    quantity: 1000,
  }
  
  await expect(() => deposit.execute(inputDeposit)).rejects.toThrow(new Error("Account not found"));
})

afterEach(async () => { 
  await connection.close()
})
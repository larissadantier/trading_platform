import { randomUUID } from 'node:crypto';
import DatabaseConnection, { PgPromiseAdapter } from '../src/DatabaseConnection';
import { AccountAssetDAODatabase } from "../src/AccountAssetDAO";
import { AccountDAODatabase } from "../src/AccountDAO";
import Registry from "../src/Registry";
import Signup from '../src/Signup';
import GetAccount from '../src/GetAccount';
import Deposit from '../src/Deposit';
import Withdraw from '../src/Withdraw';

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;
let withdraw: Withdraw;

beforeEach(() => { 
  connection = new PgPromiseAdapter();
  signup = new Signup();
  getAccount = new GetAccount();
  deposit = new Deposit();
  withdraw = new Withdraw();

  Registry.getInstance().provide("databaseConnection", connection);
  Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
  Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
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
  expect(outputAccount.balances[0].asset_id).toBe("USD");
  expect(outputAccount.balances[0].quantity).toBe("1000");
})

test('should be not deposit in an account that not exists', async () => { 
  const inputDeposit = {
    accountId: randomUUID(),
    assetId: "USD",
    quantity: 1000,
  }
  
  await expect(() => deposit.execute(inputDeposit)).rejects.toThrow(new Error("Account not found"));
})

test('should be withdraw of an account', async () => { 
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

  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 500,
  }

  await withdraw.execute(inputWithdraw);
  const outputAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputAccount.balances[0].asset_id).toBe("USD");
  expect(outputAccount.balances[0].quantity).toBe("500");
})

test('should be not withdraw if not has balance enough', async () => { 
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
    quantity: 500,
  }
  
  await deposit.execute(inputDeposit);

  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 1000,
  }

  await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("Insuficient funds"));
})

afterEach(async () => { 
  await connection.close()
})
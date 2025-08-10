import { randomUUID } from 'node:crypto';
import sinon from "sinon";
import { AccountAssetDAODatabase } from "../src/AccountAssetDAO";
import { AccountDAODatabase, AccountDAOMemory } from "../src/AccountDAO";
import AccountService from "../src/AccountService";
import Registry from "../src/Registry";

let accountService: AccountService;

beforeEach(() => { 
  const accountDAO = new AccountDAODatabase();
  const accountAssetDAO = new AccountAssetDAODatabase();
  Registry.getInstance().provide("accountDAO", accountDAO);
  Registry.getInstance().provide("accountAssetDAO", accountAssetDAO);
  // const accountDAO = new AccountDAOMemory();
  accountService = new AccountService();
})
test('should be create an account', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const outputSignup = await accountService.signup(input);
  const outputAccount = await accountService.getAccount(outputSignup.accountId);

  expect(outputSignup.accountId).toBeDefined();
  expect(outputAccount.name).toBe(input.name);
  expect(outputAccount.email).toBe(input.email);
  expect(outputAccount.document).toBe(input.document);
  expect(outputAccount.password).toBe(input.password);
});

test('should be not create an account if the name is invalid', async () => {  
  const input = {
    name: "John",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test('should be not create an account if the email is invalid', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail",
    document: "87748248800",
    password: "asdQWE123"
  };

  await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test('should be not create an account if the document is invalid', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "877",
    password: "asdQWE123"
  };

  await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid document"));
});

test('should be not create an account if the password is invalid', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE"
  };

  await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid password"));
});

test('should be create an account with stub', async () => {  
  const saveStub = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const getByIdStub = sinon.stub(AccountDAODatabase.prototype, 'getById').resolves(input)

  const outputSignup = await accountService.signup(input);
  const outputAccount = await accountService.getAccount(outputSignup.accountId);

  expect(outputSignup.accountId).toBeDefined();
  expect(outputAccount.name).toBe(input.name);
  expect(outputAccount.email).toBe(input.email);
  expect(outputAccount.document).toBe(input.document);
  expect(outputAccount.password).toBe(input.password);

  saveStub.restore();
  getByIdStub.restore();
});

test('should be create an account with spy', async () => {  
  const saveSpy = sinon.spy(AccountDAODatabase.prototype, 'save');
  const getByIdSpy = sinon.spy(AccountDAODatabase.prototype, 'getById');
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const outputSignup = await accountService.signup(input);
  const outputAccount = await accountService.getAccount(outputSignup.accountId);

  expect(outputSignup.accountId).toBeDefined();
  expect(outputAccount.name).toBe(input.name);
  expect(outputAccount.email).toBe(input.email);
  expect(outputAccount.document).toBe(input.document);
  expect(outputAccount.password).toBe(input.password);
  expect(saveSpy.calledOnce).toBe(true);
  expect(getByIdSpy.calledOnce).toBe(true);
  expect(getByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
  saveSpy.restore();
  getByIdSpy.restore();
});

test('should be create an account with fake', async () => {  
  const accountDAO = new AccountDAOMemory();
  Registry.getInstance().provide("accountDAO", accountDAO);
  accountService = new AccountService();
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const outputSignup = await accountService.signup(input);
  const outputAccount = await accountService.getAccount(outputSignup.accountId);

  expect(outputSignup.accountId).toBeDefined();
  expect(outputAccount.name).toBe(input.name);
  expect(outputAccount.email).toBe(input.email);
  expect(outputAccount.document).toBe(input.document);
  expect(outputAccount.password).toBe(input.password);
});

test('should be deposit in an account', async () => { 
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const outputSignup = await accountService.signup(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 1000,
  }
  await accountService.deposit(inputDeposit);
  const outputAccount = await accountService.getAccount(outputSignup.accountId);
  expect(outputAccount.balances[0].asset_id).toBe("USD");
  expect(outputAccount.balances[0].quantity).toBe("1000");
})

test('should be not deposit in an account that not exists', async () => { 
  const inputDeposit = {
    accountId: randomUUID(),
    assetId: "USD",
    quantity: 1000,
  }
  
  await expect(() => accountService.deposit(inputDeposit)).rejects.toThrow(new Error("Account not found"));
})

test('should be withdraw of an account', async () => { 
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const outputSignup = await accountService.signup(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 1000,
  }
  
  await accountService.deposit(inputDeposit);

  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 500,
  }

  await accountService.withdraw(inputWithdraw);
  const outputAccount = await accountService.getAccount(outputSignup.accountId);
  expect(outputAccount.balances[0].asset_id).toBe("USD");
  expect(outputAccount.balances[0].quantity).toBe("500");
})

test.only('should be not withdraw if not has balance enough', async () => { 
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const outputSignup = await accountService.signup(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 500,
  }
  
  await accountService.deposit(inputDeposit);

  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 1000,
  }

  await expect(() => accountService.withdraw(inputWithdraw)).rejects.toThrow(new Error("Insuficient funds"));
})
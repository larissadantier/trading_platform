import sinon from "sinon";
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { AccountAssetDAODatabase } from "../../src/infra/dao/AccountAssetDAO";
import { AccountDAODatabase, AccountDAOMemory } from "../../src/infra/dao/AccountDAO";
import Registry from "../../src/infra/di/Registry";
import Signup from '../../src/application/usecase/Signup';
import GetAccount from '../../src/application/usecase/GetAccount';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => { 
  connection = new PgPromiseAdapter();
  signup = new Signup();
  getAccount = new GetAccount();

  Registry.getInstance().provide("databaseConnection", connection);
  Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
  Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
  Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
  // const accountDAO = new AccountDAOMemory();
})

test('should be create an account', async () => { 
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const outputSignup = await signup.execute(input);
  const outputAccount = await getAccount.execute(outputSignup.accountId);

  expect(outputSignup.accountId).toBeDefined();
  expect(outputAccount.name).toBe(input.name);
  expect(outputAccount.email).toBe(input.email);
  expect(outputAccount.document).toBe(input.document);
  expect(outputAccount.password).toBe(input.password);
})

test('should be not create an account if the name is invalid', async () => {  
  const input = {
    name: "John",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
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

  const outputSignup = await signup.execute(input);
  const outputAccount = await getAccount.execute(outputSignup.accountId);

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

  const outputSignup = await signup.execute(input);
  const outputAccount = await getAccount.execute(outputSignup.accountId);

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
  signup = new Signup();
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  const outputSignup = await signup.execute(input);
  const outputAccount = await getAccount.execute(outputSignup.accountId);

  expect(outputSignup.accountId).toBeDefined();
  expect(outputAccount.name).toBe(input.name);
  expect(outputAccount.email).toBe(input.email);
  expect(outputAccount.document).toBe(input.document);
  expect(outputAccount.password).toBe(input.password);
});

afterEach(async () => { 
  await connection.close()
})
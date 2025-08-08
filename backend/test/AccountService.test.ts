import { AccountDAODatabase, AccountDAOMemory } from "../src/AccountDAO";
import AccountService from "../src/AccountService";

let accountService: AccountService;

beforeEach(() => { 
  // const accountDAO = new AccountDAODatabase()
  const accountDAO = new AccountDAOMemory();
  accountService = new AccountService(accountDAO);
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
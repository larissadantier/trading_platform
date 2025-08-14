import Account from "../../src/domain/Account"

test("should be create an account", () => {
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "97456321558",
    password: "asdQWE123"
  };
  const account = Account.create(input.name, input.email, input.document, input.password);

  expect(account.name).toBe(input.name);
  expect(account.email).toBe(input.email);
  expect(account.document).toBe(input.document);
  expect(account.password).toBe(input.password);
 })

 test('should be not create an account if the name is invalid', async () => {  
  const input = {
    name: "John",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  expect(() => Account.create(input.name, input.email, input.document, input.password)).toThrow(new Error("Invalid name"));
});

test('should be not create an account if the email is invalid', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail",
    document: "87748248800",
    password: "asdQWE123"
  };

  expect(() => Account.create(input.name, input.email, input.document, input.password)).toThrow(new Error("Invalid email"));
});

test('should be not create an account if the document is invalid', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "877",
    password: "asdQWE123"
  };

  expect(() => Account.create(input.name, input.email, input.document, input.password)).toThrow(new Error("Invalid document"));
});

test('should be not create an account if the password is invalid', async () => {  
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE"
  };

  expect(() => Account.create(input.name, input.email, input.document, input.password)).toThrow(new Error("Invalid password"));
});

test("should be make a withdaw", () => {
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "97456321558",
    password: "asdQWE123"
  };
  const account = Account.create(input.name, input.email, input.document, input.password);
  account.deposit("USD", 500);
  account.withdraw("USD", 100);
  expect(account.balances[0].quantity).toBe(400);
 })

 test("should be not withdraw if not has balance enough", () => {
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "97456321558",
    password: "asdQWE123"
  };
  const account = Account.create(input.name, input.email, input.document, input.password);
  account.deposit("USD", 500);

  expect(() => account.withdraw("USD", 1000)).toThrow('Insufficient funds');
 })
import Account from "../../src/domain/Account"

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
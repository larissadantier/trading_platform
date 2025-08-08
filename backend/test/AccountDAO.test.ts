import { randomUUID } from 'node:crypto';
import { AccountDAODatabase } from '../src/AccountDAO';

test('should be persist an account', async () => {  
  const accountDAO = new AccountDAODatabase();

  const account = {
    accountId: randomUUID(),
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  await accountDAO.save(account);
  const savedAccount = await accountDAO.getById(account.accountId);

  expect(savedAccount.account_id).toBe(account.accountId);
  expect(savedAccount.name).toBe(account.name);
  expect(savedAccount.email).toBe(account.email);
  expect(savedAccount.document).toBe(account.document);
  expect(savedAccount.password).toBe(account.password);
});
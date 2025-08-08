import { randomUUID } from 'node:crypto';
import { getAccountById, saveAccount } from '../src/data';

test('should be persist an account', async () => {  
  const account = {
    accountId: randomUUID(),
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  };

  await saveAccount(account);
  const savedAccount = await getAccountById(account.accountId);

  expect(savedAccount.account_id).toBe(account.accountId);
  expect(savedAccount.name).toBe(account.name);
  expect(savedAccount.email).toBe(account.email);
  expect(savedAccount.document).toBe(account.document);
  expect(savedAccount.password).toBe(account.password);
});
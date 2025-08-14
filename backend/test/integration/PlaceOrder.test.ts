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
let placeOrder: PlaceOrder;
let getOrder: GetOrder;

beforeEach(() => { 
  connection = new PgPromiseAdapter();
  signup = new Signup();
  getAccount = new GetAccount();
  deposit = new Deposit();
  placeOrder = new PlaceOrder();
  getOrder = new GetOrder();

  Registry.getInstance().provide("databaseConnection", connection);
  Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
  Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
  Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
  // const accountDAO = new AccountDAOMemory();
})

test('should be create a place order', async () => { 
  const input = {
    name: "John Doe",
    email: "john@hotmail.com",
    document: "87748248800",
    password: "asdQWE123"
  }

  const outputSignup = await signup.execute(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "USD",
    quantity: 100000,
  }
  await deposit.execute(inputDeposit);

  const inputPlaceOrder = { 
    accountId: outputSignup.accountId,
    markerId: "BTC/USD",
    side: "buy",
    quantity: 1,
    price: 85000,
  }

  const outputPlaceOrder = await placeOrder.execute(inputPlaceOrder);
  const outputGetOrder = await getOrder.execute(outputPlaceOrder.orderId);

  expect(outputGetOrder.orderId).toBeDefined();
  expect(outputGetOrder.side).toBe(inputPlaceOrder.side);
  expect(outputGetOrder.price).toBe(inputPlaceOrder.price);
  expect(outputGetOrder.quantity).toBe(inputPlaceOrder.quantity);
  expect(outputGetOrder.markerId).toBe(inputPlaceOrder.markerId);
})

afterEach(async () => { 
  await connection.close()
})
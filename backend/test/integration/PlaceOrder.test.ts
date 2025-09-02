import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { AccountAssetDAODatabase } from "../../src/infra/dao/AccountAssetDAO";
import { AccountDAODatabase } from "../../src/infra/dao/AccountDAO";
import Registry from "../../src/infra/di/Registry";
import Signup from '../../src/application/usecase/Signup';
import Deposit from '../../src/application/usecase/Deposit';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import PlaceOrder from '../../src/application/usecase/PlaceOrder';
import GetOrder from '../../src/application/usecase/GetOrder';
import { OrderRepositoryDatabase } from '../../src/infra/repository/OrderRepository';
import GetDepth from '../../src/application/usecase/GetDepth';
import { MediatorMemory } from '../../src/infra/mediator/mediator';
import ExecuteOrder from '../../src/application/usecase/ExecuteOrder';

let connection: DatabaseConnection;
let signup: Signup;
let deposit: Deposit;
let placeOrder: PlaceOrder;
let getOrder: GetOrder;
let getDepth: GetDepth;

beforeEach(() => { 
  connection = new PgPromiseAdapter();
  signup = new Signup();
  deposit = new Deposit();
  placeOrder = new PlaceOrder();
  getOrder = new GetOrder();
  getDepth = new GetDepth();

  Registry.getInstance().provide("databaseConnection", connection);
  Registry.getInstance().provide("orderRepository", new OrderRepositoryDatabase())
  Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
  Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
  Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
  const mediator = new MediatorMemory();
  Registry.getInstance().provide("mediator", mediator);

  const executeOrder = new ExecuteOrder();

  mediator.register("orderPlaced", async (event:any) => {
  await executeOrder.execute(event.marketId);
  })
  // const accountDAO = new AccountDAOMemory();
})

test('should be create a place order', async () => { 
  const marketId = `BTC/USD${Math.random()}`;
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
    marketId,
    side: "buy",
    quantity: 1,
    price: 85000,
  }

  const outputPlaceOrder = await placeOrder.execute(inputPlaceOrder);
  const outputGetOrder = await getOrder.execute(outputPlaceOrder.orderId);
  const outputGetDepth = await getDepth.execute(marketId);

  expect(outputGetOrder.orderId).toBeDefined();
  expect(outputGetOrder.side).toBe(inputPlaceOrder.side);
  expect(outputGetOrder.price).toBe(inputPlaceOrder.price);
  expect(outputGetOrder.quantity).toBe(inputPlaceOrder.quantity);
  expect(outputGetOrder.marketId).toBe(inputPlaceOrder.marketId);
  expect(outputGetDepth.buys).toHaveLength(1);
  expect(outputGetDepth.sells).toHaveLength(0);
  expect(outputGetDepth.buys[0].quantity).toBe(1);
  expect(outputGetDepth.buys[0].price).toBe(85000);
})

test('should be create many place order with different price and verify the depth', async () => { 
  const marketId = `BTC/USD${Math.random()}`;
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
    quantity: 10000000,
  }

  await deposit.execute(inputDeposit);
  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "buy",
    quantity: 1,
    price: 85000,
  });

  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "buy",
    quantity: 1,
    price: 85000,
  });

  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "buy",
    quantity: 1,
    price: 84000,
  });

  const outputGetDepth = await getDepth.execute(marketId);

  expect(outputGetDepth.buys).toHaveLength(2);
  expect(outputGetDepth.sells).toHaveLength(0);
  expect(outputGetDepth.buys[0].quantity).toBe(1);
  expect(outputGetDepth.buys[0].price).toBe(84000);
  expect(outputGetDepth.buys[1].quantity).toBe(2);
  expect(outputGetDepth.buys[1].price).toBe(85000);
})

test('should be create a place order of buy and other of sell in same value', async () => { 
  const marketId = `BTC/USD${Math.random()}`;
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
    quantity: 10000000,
  }

  await deposit.execute(inputDeposit);
  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "buy",
    quantity: 1,
    price: 85000,
  });

  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "sell",
    quantity: 1,
    price: 85000,
  });

  const outputGetDepth = await getDepth.execute(marketId);

  expect(outputGetDepth.buys).toHaveLength(0);
  expect(outputGetDepth.sells).toHaveLength(0);
})

test('should be create two orders of buy and sell in same value and same quantity', async () => { 
  const marketId = `BTC/USD${Math.random()}`;
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
    quantity: 10000000,
  }

  await deposit.execute(inputDeposit);
  
  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "buy",
    quantity: 1,
    price: 85000,
  });

  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "buy",
    quantity: 1,
    price: 85000,
  });

  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "sell",
    quantity: 3,
    price: 85000,
  });

  const outputGetDepth = await getDepth.execute(marketId);

  expect(outputGetDepth.buys).toHaveLength(0);
  expect(outputGetDepth.sells).toHaveLength(1);
})

test.only('should be create three orders of buy and sell in different values and same quantity', async () => { 
  const marketId = `BTC/USD${Math.random()}`;
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
    quantity: 10000000,
  }

  await deposit.execute(inputDeposit);
  
  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "sell",
    quantity: 1,
    price: 82000,
  });

  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "sell",
    quantity: 1,
    price: 84000,
  });

  await placeOrder.execute({
    accountId: outputSignup.accountId,
    marketId,
    side: "buy",
    quantity: 2,
    price: 85000,
  });

  const outputGetDepth = await getDepth.execute(marketId);

  expect(outputGetDepth.buys).toHaveLength(0);
  expect(outputGetDepth.sells).toHaveLength(0);
})

afterEach(async () => { 
  await connection.close()
})
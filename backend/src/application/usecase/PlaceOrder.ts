import Order from "../../domain/Order";
import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class PlaceOrder {
  @inject('accountRepository')
  accountRepository!: AccountRepository;
  @inject('orderRepository')
  orderRepository!: OrderRepository;

  async execute(input: Input): Promise<{orderId: string}> { 
    const account = await this.accountRepository.getById(input.accountId);
    const order = Order.create(
      input.accountId, 
      input.marketId, 
      input.price, 
      input.quantity, 
      input.side
    )

    await this.orderRepository.save(order);
    
    return {
      orderId: order.orderId,
    };
  }
}

type Input = {
  accountId: string,
  marketId: string,
  side: string, 
  quantity: number,
  price: number
 };
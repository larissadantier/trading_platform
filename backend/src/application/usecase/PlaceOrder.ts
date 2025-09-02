import Order from "../../domain/Order";
import { inject } from "../../infra/di/Registry";
import Mediator from "../../infra/mediator/mediator";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class PlaceOrder {
  @inject('orderRepository')
  orderRepository!: OrderRepository;
  @inject("mediator")
  mediator!: Mediator;

  async execute(input: Input): Promise<{orderId: string}> { 
    // TODO: Implementar a verficação saldo
    const order = Order.create(input.accountId, input.marketId, input.side,input.quantity, input.price);
    await this.orderRepository.save(order);

    await this.mediator.notifyAll('orderPlaced', {
      marketId: input.marketId,
      orderId: order.orderId
    })
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
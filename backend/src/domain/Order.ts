import crypto from 'node:crypto';

export default class Order {
  constructor(
    readonly orderId: string,
    readonly accountId: string,
    readonly marketId: string,
    readonly side: string,
    readonly quantity: number,
    readonly price: number,
    public fillQuantity: number,
    public fillPrice: number,
    public status: string,
    readonly timestamp: Date
  ) {

   }

  static create(accountId: string, marketId: string, side: string, quantity: number, price: number){
    const orderId = crypto.randomUUID();
    const status = "open";
    const fillQuantity = 0;
    const fillPrice = 0;
    const timestamp = new Date();

    return new Order(orderId, accountId, marketId, side, quantity, price, fillQuantity, fillPrice, status, timestamp);
  }
 }
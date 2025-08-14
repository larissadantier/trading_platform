import crypto from 'node:crypto';

export default class Order {
  constructor(
    readonly orderId: string, 
    readonly accountId: string, 
    readonly marketId: string, 
    readonly price: number, 
    readonly quantity: number, 
    readonly side: string,
    readonly fillQuantity: number, 
    readonly fillPrice: number, 
    readonly status: string, 
    readonly timestamp: Date
  ) {

   }

  static create(accountId: string, marketId: string, price: number, quantity: number, side: string){
    const orderId = crypto.randomUUID();
    const status = "open";
    const fillQuantity = 0;
    const fillPrice = 0;
    const timestamp = new Date();
    
    const order = new Order(orderId, accountId, marketId, price, quantity, side, fillQuantity, fillPrice, status, timestamp);

    return order;
  }
 }
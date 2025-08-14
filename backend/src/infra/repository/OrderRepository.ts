import Order from "../../domain/Order";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface OrderRepository {
  save(order: Order): Promise<void>;
  getById(orderId: string): Promise<Order>;
 }

 export class OrderRepositoryDatabase implements OrderRepository {
  @inject('databaseConnection')
  connection!: DatabaseConnection;

   async save(order: Order): Promise<void> {
     await this.connection.query(`
      INSERT INTO ccca.order (order_id, account_id, market_id, side, quantity, price, fill_quantity, fill_price, status, timestamp) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [order.orderId, order.accountId, order.marketId, order.side, order.quantity, order.price]);
   }

   async getById(orderId: string): Promise<Order> {
    const [orderData] = await this.connection.query(`
      SELECT * FROM ccca.order WHERE order_id = $1`, [orderId]);

    return orderData;
   }
 };
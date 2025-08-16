import Order from "../schema/sales.shema.js";

class SalesOrderRepo {
  static getAllSalesOrder = async () => {
    return await Order.find();
  };

  static findSalesOrderById = async (_id) => {
    return await Order.findById(_id);
  };

  static async findOne(order_number) {
    return await Order.findOne({
      order_number: order_number,
    });
  }

  static async createSalseOrder(saleOrder) {
    return await Order.insertOne(saleOrder);
  }
}

export default SalesOrderRepo;

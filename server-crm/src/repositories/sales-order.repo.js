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

  static async createSaleOrder(saleOrder) {
    return await Order.insertOne(saleOrder);
  }
  static async updateSaleOrder(id, data) {
    return await Order.findByIdAndUpdate(id, data);
  }
  static async deleteSaleOrder(id) {
    return await Order.findByIdAndDelete(id);
  }

  static async countSalesOrdersByStatus() {
    return await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
  }
}

export default SalesOrderRepo;

import SalesOrderService from "../services/sales-order.service.js";

export class SalesOrderController {
  static getListSalesOrder = async (req, res, next) => {
    try {
      const responseData = await SalesOrderService.getListSalesOrder();
      res.status(200).json(responseData);
    } catch (e) {
      next(e);
    }
  };
}

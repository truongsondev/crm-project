import SalesOrderService from "../services/sales-order.service.js";
import fs from "fs";
export class SalesOrderController {
  static getListSalesOrder = async (req, res, next) => {
    try {
      const responseData = await SalesOrderService.getListSalesOrder();
      res.status(200).json({
        salesOrder: responseData,
      });
    } catch (e) {
      next(e);
    }
  };

  static createSaleOrder = async (req, res, next) => {
    try {
      const data = req.body;
      console.log(data);
      const responseData = await SalesOrderService.createSaleOrder(data);
      res.status(200).json(responseData);
    } catch (e) {
      next(e);
    }
  };

  static createSalesOrder = async (req, res, next) => {
    try {
      const data = req.body;
      console.log(data);
      const responseData = await SalesOrderService.createSalesOrder(data);
      res.status(200).json(responseData);
    } catch (e) {
      next(e);
    }
  };

  static exportToFileCSV = async (req, res, next) => {
    try {
      const { filePath, fileName } = await SalesOrderService.exportToFileCSV();

      res.download(filePath, fileName, (err) => {
        if (err) {
          next(err);
        }

        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
        });
      });
    } catch (e) {
      next(e);
    }
  };

  static updateSaleOrder = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const response = await SalesOrderService.updateSaleOrder(id, data);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };

  static deleteSaleOrder = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await SalesOrderService.deleteSaleOrder(id);
      res.status(200).json({
        data,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  static deleteSalesOrder = async (req, res, next) => {
    try {
      const listId = req.body;

      await SalesOrderService.deleteSalesOrder(listId);
      res.status(200).json({
        message: "Delete success",
      });
    } catch (e) {
      console.log(e);

      next(e);
    }
  };
}

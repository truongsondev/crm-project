import path from "path";
import { Parser } from "@json2csv/plainjs";
import { fileURLToPath } from "url";
import fs from "fs";
import { format } from "date-fns";
import { NotFoundError } from "../http/error.http.js";
import { CommonService } from "./common.service.js";
import SalesOrderRepo from "../repositories/sales-order.repo.js";
import UserRepo from "../repositories/user.repo.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SalesOrderService {
  static async getListSalesOrder() {
    const salesOrder = await SalesOrderRepo.getAllSalesOrder();
    if (!salesOrder) {
      throw new NotFoundError("No data found");
    }
    const newlists = [];
    for (const order of salesOrder) {
      let assign_to = "";
      if (order.assigned_to && order.assigned_to !== "") {
        assign_to = await UserRepo.findUserbyId(order?.assigned_to);
      }
      newlists.push({
        ...(order.toObject?.() || order),
        assigned_to: assign_to
          ? {
              _id: assign_to._id,
              name: `${assign_to.first_name} ${assign_to.last_name}`,
            }
          : null,
      });
    }
    return salesOrder;
  }

  static async createSalesOrder(data) {
    const order_number = this.generateOrderNumber;
    const newData = { ...data, order_number: order_number };
    const res = await SalesOrderRepo.createSalseOrder(newData);
    return res;
  }
  static async generateOrderNumber() {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let orderNumber;
    let isUnique = false;
    while (!isUnique) {
      const randomPart = String(Math.floor(1000 + Math.random() * 9000));
      orderNumber = `SO-${datePart}-${randomPart}`;
      const exists = await SalesOrderRepo.findOne(orderNumber);
      if (!exists) {
        isUnique = true;
      }
    }
    return orderNumber;
  }
}

export default SalesOrderService;

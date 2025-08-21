import path from "path";
import { Parser } from "@json2csv/plainjs";
import { fileURLToPath } from "url";
import fs from "fs";
import { format } from "date-fns";
import { NotFoundError } from "../http/error.http.js";
import { CommonService } from "./common.service.js";
import SalesOrderRepo from "../repositories/sales-order.repo.js";
import UserRepo from "../repositories/user.repo.js";
import { ContactRepo } from "../repositories/contact.repo.js";
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
      let contact = "";
      if (order.assigned_to && order.assigned_to !== "") {
        assign_to = await UserRepo.findUserbyId(order?.assigned_to);
        contact = await ContactRepo.findContactById(order?.contact_id);
      }
      newlists.push({
        ...(order.toObject?.() || order),
        assigned_to: assign_to
          ? {
              _id: assign_to._id,
              name: `${assign_to.first_name} ${assign_to.last_name}`,
            }
          : null,
        contact_id: contact
          ? {
              _id: contact._id,
              name: contact.contact_name,
            }
          : null,
      });
    }
    return newlists;
  }

  static async createSaleOrder(data) {
    const order_number = await this.generateOrderNumber();
    const newData = { ...data, order_number: order_number };
    console.log("newdata:::", newData);
    const res = await SalesOrderRepo.createSaleOrder(newData);
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

  static createSalesOrder = async (orders) => {
    const success = [];
    const failed = [];
    for (const order of orders) {
      try {
        const order_number = await this.generateOrderNumber();
        const newOrder = { ...order, order_number: order_number };
        console.log("newOrder:::", newOrder);
        await SalesOrderRepo.createSaleOrder(newOrder);
        success.push(newOrder);
      } catch (err) {
        console.log(err);
        if (err.code === 11000) {
          failed.push({
            ...order,
            reason: "Duplicate " + Object.keys(err.keyValue).join(", "),
          });
        } else {
          failed.push({ ...order, reason: "Unknown error" });
        }
      }
    }
    return {
      success,
      failed,
    };
  };

  static exportToFileCSV = async () => {
    const data = await this.getListSalesOrder();
    if (!data || data.length === 0) {
      throw new NotFoundError("No data found");
    }
    const formattedData = data.map((item) => {
      return {
        ...item,
        assigned_to: item.assigned_to ? item.assigned_to?.name : "",
        contact_id: item.contact_id ? item.contact_id?.name : "",
        purchase_on: item.purchase_on
          ? CommonService.formatDate(item.purchase_on)
          : "",
        updated_on: item.updated_on
          ? CommonService.formatDate(item.updated_on)
          : "",
      };
    });

    const opts = {};
    const parser = new Parser(opts);
    const csv = parser.parse(formattedData);

    const fileName = "data.csv";
    const dirPath = path.join(__dirname, "temp");
    const filePath = path.join(dirPath, fileName);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, csv, "utf8");

    return {
      filePath,
      fileName,
    };
  };

  static updateSaleOrder = async (id, data) => {
    const saleOrder = await SalesOrderRepo.updateSaleOrder(id, data);
    return {
      saleOrder,
    };
  };

  static deleteSaleOrder = async (id) => {
    const res = await SalesOrderRepo.deleteSaleOrder(id);
    console.log(res);
    return res;
  };

  static deleteSalesOrder = async (listId) => {
    if (listId) {
      for (const id of listId) {
        await SalesOrderRepo.deleteSaleOrder(id);
      }
    }
  };
}

export default SalesOrderService;

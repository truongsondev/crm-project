import express from "express";
import { ContactController } from "../controllers/contact.controller.js";
import { SalesOrderController } from "../controllers/sales-order.controller.js";
import { TokenController } from "../controllers/token.controller.js";
import UserController from "../controllers/user.controller.js";
import { checkRole } from "../middleware/user.js";
import { checkToken } from "../middleware/verify-token.js";

const router = express.Router();

router.get("/auth/sign-in", (req, res) => {
  res.send("Hello World");
});

router.get("/users", /* checkToken, checkRole,*/ UserController.getListUser);
router.post("/users", UserController.createUser);
router.post("/multiple-user", UserController.createUsers);
router.put("/users/:id", UserController.updateUser);
router.get("/users/download", UserController.exportToFileCSV);

router.post("/auth/sign-in", UserController.signIn);

router.get("/contacts", ContactController.getListContacts);
router.post("/contacts", ContactController.createContact);
router.put("/contacts/:id", ContactController.updateContact);
router.delete("/contacts/delete/:id", ContactController.deleteContact);
router.get("/contacts/download", ContactController.exportToFileCSV);
router.post("/multiple-contact", ContactController.createContacts);
router.post("/delete/multiple-contact", ContactController.deleteContacts);

router.get("/sales-order", SalesOrderController.getListSalesOrder);
router.post("/create-sales-order", SalesOrderController.createSaleOrder);
router.post("/multiple-sales-order", SalesOrderController.createSalesOrder);
router.get("/sale-order/download", SalesOrderController.exportToFileCSV);
router.put("/sale-order/:id", SalesOrderController.updateSaleOrder);
router.delete("/sale-order/delete/:id", SalesOrderController.deleteSaleOrder);
router.post(
  "/delete/multiple-sales-order",
  SalesOrderController.deleteSalesOrder
);

router.post("/reset-token", TokenController.resetToken);

export default router;

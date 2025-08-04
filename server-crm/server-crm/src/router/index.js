import express from "express";
import { ContactController } from "../controllers/contact.controller.js";
import UserController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/auth/sign-in", (req, res) => {
  res.send("Hello World");
});

router.get("/users", UserController.getListUser);
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

export default router;

import express from "express";
import { ContactController } from "../controllers/contact.controller.js";
import UserController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/auth/sign-in", (req, res) => {
  res.send("Hello World");
});

router.get("/users", UserController.getListUser);
router.post("/users", UserController.createUser);
router.post("/auth/sign-in", UserController.signIn);
router.put("/users/:id", UserController.updateUser);
router.get("/contacts", ContactController.getListContacts);
router.post("/contacts", ContactController.createContact);
router.put("/contacts/:id", ContactController.updateContact);
router.delete("/contacts/delete/:id", ContactController.deleteContact);

export default router;

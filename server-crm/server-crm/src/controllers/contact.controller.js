import { ContactService } from "../services/contact.service.js";
import fs from "fs";

export class ContactController {
  static getListContacts = async (req, res, next) => {
    try {
      const responseData = await ContactService.getListContacts();
      res.status(200).json(responseData);
    } catch (e) {
      next(e);
    }
  };

  static createContact = async (req, res, next) => {
    try {
      const contact = req.body;
      const responseData = await ContactService.createContact(contact);
      console.log(responseData);
      res.status(200).json(responseData);
    } catch (e) {
      next(e);
    }
  };

  static createContacts = async (req, res, next) => {
    try {
      const contacts = req.body;
      const contactRes = await ContactService.createContacts(contacts);
      res.status(200).json(contactRes);
    } catch (e) {
      console.log(e);

      next(e);
    }
  };

  static deleteContacts = async (req, res, next) => {
    try {
      const listId = req.body;
      await ContactService.deleteManyContacts(listId);
      res.status(200).json({
        message: "Delete success",
      });
    } catch (e) {
      console.log(e);

      next(e);
    }
  };

  static deleteContact = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await ContactService.deleteContact(id);
      res.status(200).json({
        code: 200000,
        data,
      });
    } catch (e) {
      next(e);
    }
  };
  static updateContact = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const response = await ContactService.updateContact(id, data);
      res.status(200).json({
        code: 200000,
        contact: response,
      });
    } catch (e) {
      next(e);
    }
  };

  static exportToFileCSV = async (req, res, next) => {
    try {
      const { filePath, fileName } = await ContactService.exportToFileCSV();

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
}

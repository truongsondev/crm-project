import { ContactService } from "../services/contact.service.js";

export class ContactController {
  static getListContacts = async (req, res, next) => {
    const responseData = await ContactService.getListContacts();
    res.status(200).json(responseData);
  };

  static createContact = async (req, res, next) => {
    const contact = req.body;
    const responseData = await ContactService.createContact(contact);
    console.log(responseData);
    res.status(200).json(responseData);
  };
  static deleteContact = async (req, res, next) => {
    const id = req.params.id;
    const data = await ContactService.deleteContact(id);
    res.status(200).json({
      code: 200000,
      data,
    });
  };
  static updateContact = async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const response = await ContactService.updateContact(id, data);
    res.status(200).json({
      code: 200000,
      contact: response,
    });
  };
}

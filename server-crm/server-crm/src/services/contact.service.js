import { ContactRepo } from "../repositories/contact.repo.js";
import UserRepo from "../repositories/user.repo.js";
import path from "path";
import { Parser } from "@json2csv/plainjs";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ContactService {
  static createContacts = async () => {};

  static createContact = async (contact) => {
    try {
      const res = await ContactRepo.createContact(contact);
      return {
        code: 200000,
        res,
      };
    } catch (e) {
      console.log(e);
    }
  };

  static getListContacts = async () => {
    try {
      const rawContacts = await ContactRepo.getListContacts();
      const contacts = await Promise.all(
        rawContacts.map(async (contact) => {
          const assignedToUser = await UserRepo.findUserbyId(
            contact.assigned_to
          );

          return {
            ...(contact.toObject?.() || contact),
            assigned_to: assignedToUser
              ? `${assignedToUser.first_name} ${assignedToUser.last_name}`
              : null,
          };
        })
      );

      return {
        code: 200000,
        contacts,
      };
    } catch (e) {
      next(e);
    }
  };
  static getListContact = async () => {
    try {
      const rawContacts = await ContactRepo.getListContacts();
      const contacts = await Promise.all(
        rawContacts.map(async (contact) => {
          const assignedToUser = await UserRepo.findUserbyId(
            contact.assigned_to
          );

          return {
            ...(contact.toObject?.() || contact),
            assigned_to: assignedToUser
              ? `${assignedToUser.first_name} ${assignedToUser.last_name}`
              : null,
          };
        })
      );

      return contacts;
    } catch (e) {
      next(e);
    }
  };

  static updateContact = async (id, data) => {
    try {
      const contact = await ContactRepo.updateFilterContact(id, data);
      console.log("contact in contact service:::", contact);
      return {
        code: 200000,
        contact,
      };
    } catch (e) {
      console.log(e);
    }
  };

  static deleteContact = async (_id) => {
    return await ContactRepo.deleteContact(_id);
  };
  static exportToFileCSV = async () => {
    const data = await this.getListContact();

    const opts = {};
    const parser = new Parser(opts);
    const csv = parser.parse(data);

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
}

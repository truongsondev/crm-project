import { ContactRepo } from "../repositories/contact.repo.js";
import UserRepo from "../repositories/user.repo.js";
import path from "path";
import { Parser } from "@json2csv/plainjs";
import { fileURLToPath } from "url";
import fs from "fs";
import { CommonService } from "./common.service.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ContactService {
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
  static createContacts = async (contacts) => {
    const success = [];
    const failed = [];
    for (const contact of contacts) {
      try {
        await ContactRepo.createContact(contact);
        success.push(contact);
      } catch (err) {
        if (err.code === 11000) {
          failed.push({
            ...contact,
            reason: "Duplicate " + Object.keys(err.keyValue).join(", "),
          });
        } else {
          failed.push({ ...contact, reason: "Unknown error" });
        }
      }
    }
    return {
      success,
      failed,
    };
  };

  static getListContacts = async () => {
    try {
      const rawContacts = await ContactRepo.getListContacts();
      console.log(rawContacts);
      const contacts = await Promise.all(
        rawContacts.map(async (contact) => {
          let assignedToUser = null;
          if (contact.assigned_to && contact.assigned_to !== "") {
            assignedToUser = await UserRepo.findUserbyId(contact.assigned_to);
          }
          return {
            ...(contact.toObject?.() || contact),
            assigned_to: assignedToUser
              ? {
                  _id: assignedToUser._id,
                  name: `${assignedToUser.first_name} ${assignedToUser.last_name}`,
                }
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

  static deleteManyContacts = async (listId) => {
    if (listId) {
      for (const id of listId) {
        await ContactRepo.deleteContact(id);
      }
    }
  };

  static updateContact = async (id, data) => {
    try {
      const contact = await ContactRepo.updateFilterContact(id, data);
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
    if (!data) {
      throw new NotFoundError("No data found");
    }
    const formattedData = data.map((item) => {
      const dateFields = ["created_on", "updated_on", "birthday"];
      const formattedItem = { ...item };

      dateFields.forEach((field) => {
        formattedItem[field] = CommonService.formatDate(item[field]);
      });

      return formattedItem;
    });
    console.log(formattedData);

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
}

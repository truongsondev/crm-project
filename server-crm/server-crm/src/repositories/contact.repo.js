import Contact from "../schema/contac.schema.js";

export class ContactRepo {
  static createContacts = async (contacts) => {
    return await Contact.insertMany(contacts);
  };

  static getListContacts = async () => {
    return await Contact.find();
  };

  static createContact = async (contact) => {
    return await Contact.insertOne(contact);
  };

  static createContacts = async (contact) => {
    return await Contact.insertMany(contact);
  };

  static async updateFilterContact(id, data) {
    const user = await Contact.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return user;
  }

  static async deleteContact(_id) {
    return await Contact.findByIdAndDelete(_id);
  }
}

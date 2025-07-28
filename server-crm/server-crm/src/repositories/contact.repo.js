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

  static async updateFilterContact(id, data) {
    console.log("id:::", id);
    console.log("data:::", data);
    const user = await Contact.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    console.log("contact in contact repo::::", user);

    return user;
  }

  static async deleteContact(_id) {
    return await Contact.findByIdAndDelete(_id);
  }
}

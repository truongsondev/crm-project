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
  static async findContactById(_id) {
    try {
      return await Contact.findOne({ _id });
    } catch (err) {
      console.error("Invalid ObjectId:", err.message);
      return null;
    }
  }

  static async countContactByLeadSource() {
    return await Contact.aggregate([
      {
        $group: {
          _id: "$lead_source",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          lead_source: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
  }
}

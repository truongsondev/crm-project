import { ContactRepo } from "../repositories/contact.repo.js";

const mockContacts = [
  {
    contact_name: "Jasmine Nguyen",
    salutation: "Ms.",
    phone: "+84123456789",
    email: "jasmine@example.com",
    organization: "SunTech Corp",
    birthday: new Date("1995-04-12"),
    lead_source: "Website",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a7",
    address: "123 Beachside Ave",
    description: "Potential client from chatbot interaction.",
  },
  {
    contact_name: "Peter Pan",
    salutation: "Mr.",
    phone: "+84987654321",
    email: "peter.pan@example.com",
    organization: "Neverland Ltd",
    birthday: new Date("1990-07-30"),
    lead_source: "Conference",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a7",
    address: "456 Fantasy Road",
    description: "Spoke at recent event, interested in partnership.",
  },
  {
    contact_name: "Minh Chau",
    salutation: "Dr.",
    phone: "+84888888888",
    email: "minh.chau@hospital.vn",
    organization: "National Hospital",
    birthday: new Date("1985-11-25"),
    lead_source: "Word of mouth",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a8",
    address: "99 Health Street",
    description: "Referred by another satisfied client.",
  },
  {
    contact_name: "Tommy Le",
    salutation: "Mr.",
    phone: "+84778899001",
    email: "tommy.le@example.com",
    organization: "BlueOcean Inc",
    birthday: new Date("1988-02-18"),
    lead_source: "Partner",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a7",
    address: "77 Seaside Blvd",
    description: "Looking for CRM consultation.",
  },
  {
    contact_name: "Linh Pham",
    salutation: "Mrs.",
    phone: "+84991234567",
    email: "linh.pham@example.com",
    organization: "Green Leaf",
    birthday: new Date("1993-06-10"),
    lead_source: "Existing Customer",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a8",
    address: "22 Tree Street",
    description: "Returning customer, wants upgrade.",
  },
  {
    contact_name: "Quang Do",
    salutation: "Prof.",
    phone: "+84876543210",
    email: "quang.do@university.edu.vn",
    organization: "UIT",
    birthday: new Date("1972-01-15"),
    lead_source: "Other",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a7",
    address: "11 University Ave",
    description: "Interested in student CRM use.",
  },
  {
    contact_name: "Anna Tran",
    salutation: "Ms.",
    phone: "+84999887766",
    email: "anna.tran@example.com",
    organization: "iGenTech",
    birthday: new Date("1998-09-22"),
    lead_source: "Conference",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a7",
    address: "303 Business Rd",
    description: "Connected during a panel talk.",
  },
  {
    contact_name: "Son Le",
    salutation: "Mr.",
    phone: "+84912345678",
    email: "sonle@example.com",
    organization: "TechBridge",
    birthday: new Date("1989-03-14"),
    lead_source: "Website",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a8",
    address: "198 Skyline St",
    description: "Filled form via landing page.",
  },
  {
    contact_name: "Mai Hoa",
    salutation: "Mrs.",
    phone: "+84776655443",
    email: "hoa.mai@example.com",
    organization: "VN Flowers",
    birthday: new Date("1991-12-02"),
    lead_source: "Word of mouth",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a7",
    address: "9 Blossom Lane",
    description: "Referral from an existing client.",
  },
  {
    contact_name: "David Ngo",
    salutation: "Mr.",
    phone: "+84112233445",
    email: "david.ngo@example.com",
    organization: "Nova Solutions",
    birthday: new Date("1982-10-05"),
    lead_source: "Website",
    assigned_to: "68804ad3044872fdf1ac86a8",
    creator_id: "68804ad3044872fdf1ac86a7",
    address: "400 Main Street",
    description: "Filled inquiry form on CRM page.",
  },
];

export class ContactService {
  static createContacts = async () => {
    try {
      return await ContactRepo.createContacts(mockContacts);
    } catch (e) {
      console.log(e);
    }
  };

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
      const contacts = await ContactRepo.getListContacts();
      return {
        code: 200000,
        contacts,
      };
    } catch (e) {
      console.log(e);
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
}

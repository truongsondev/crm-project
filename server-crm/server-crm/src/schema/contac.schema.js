import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    contact_name: { type: String, required: true },

    salutation: {
      type: String,
      enum: ["None", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof."],
      default: "None",
    },

    phone: { type: String },
    email: { type: String },
    organization: { type: String },
    birthday: { type: Date },

    lead_source: {
      type: String,
      enum: [
        "Existing Customer",
        "Partner",
        "Conference",
        "Website",
        "Word of mouth",
        "Other",
      ],
      default: "Other",
    },

    assigned_to: { type: String, default: "" },
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    address: { type: String },
    description: { type: String },

    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_on", updatedAt: "updated_on" },
  }
);

contactSchema.pre("save", function (next) {
  this.updated_on = new Date();
  next();
});
contactSchema.pre("findByIdAndUpdate", function (next) {
  this.set({ updated_on: new Date() });
  next();
});
const Contact = mongoose.model("Contact", contactSchema);

export default Contact;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },

    salutation: {
      type: String,
      enum: ["None", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof."],
      default: "None",
    },

    role: {
      type: String,
      enum: [
        "USER_ADMIN",
        "DIR",
        "SALES_MGR",
        "SALES_EMP",
        "CONTACT_MGR",
        "CONTACT_EMP",
        "USER_READ_ONLY",
      ],
      required: true,
    },

    job_title: { type: String },

    is_active: { type: Boolean, default: true },
    is_manager: { type: Boolean, default: false },

    manager_name: {
      type: String,
      default: "",
    },

    hired_date: { type: Date },
    terminated_date: { type: Date },

    public_key: { type: String },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_on", updatedAt: "updated_on" },
  }
);

userSchema.pre("save", function (next) {
  this.updated_on = new Date();
  next();
});

userSchema.pre("findByIdAndUpdate", function (next) {
  this.set({ updated_on: new Date() });
  next();
});
const User = mongoose.model("User", userSchema);

export default User;

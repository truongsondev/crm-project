import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order_number: { type: String, required: true, unique: true },
    subject: { type: String, required: true },

    contact_id: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Created", "Approved", "Delivered", "Canceled"],
      default: "Created",
    },

    total: { type: Number, required: true },

    assigned_to: { type: String, default: "" },

    creator_id: { type: String, default: "" },

    description: { type: String },

    purchase_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_on", updatedAt: "updated_on" },
  }
);

orderSchema.pre("save", function (next) {
  this.updated_on = new Date();
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;

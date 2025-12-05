import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    qty: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    placedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },

  email: { type: String, required: true, unique: true, lowercase: true },

  password: { type: String, required: true },

  verified: { type: Boolean, default: false },

  orderHistory: {
    type: [OrderSchema],
    validate: {
      validator: (arr) => arr.length <= 5,
      message: "Order history limited to last 5 orders",
    },
  },

  activeOrder: {
    items: [
      {
        productId: { type: String, required: true },
        qty: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    total: Number,
    eta: Date,
  },
});

export default mongoose.model("User", UserSchema);

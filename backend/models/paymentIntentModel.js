
import mongoose from "mongoose";

const paymentIntentSchema = new mongoose.Schema(
  {
    merchantTransactionId: { type: String, required: true, unique: true, index: true },
    userID: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
      required: true,
    },
  },
  { timestamps: true }
);

const paymentIntentModel =
  mongoose.models.payment_intent || mongoose.model("payment_intent", paymentIntentSchema);

export default paymentIntentModel;

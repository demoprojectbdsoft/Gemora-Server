import { Schema, model } from "mongoose";

const slideSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },

    tabTitle: { type: String, required: true },
    subtitle: { type: String, required: true },
    tagline: { type: String, required: true },

    targetDate: { type: Date }, // optional fallback, derived from product.offerEndDate

    order: { type: Number, default: 0 },        // display order in the tab bar
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Slide = model("Slide", slideSchema);
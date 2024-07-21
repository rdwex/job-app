import mongoose from "mongoose";

const { Schema, model } = mongoose;

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
    },
    industry: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    numberOfEmployees: {
      type: String,
    },
    companyEmail: {
      type: String,
      unique: true,
      required: true,
    },
    companyHR: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Company || model("Company", companySchema);

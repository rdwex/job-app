import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
    },
 
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },
    recoveryEmail: {
      type: String,
    },

    DOB: {
      type: Date,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    mobileNumber: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["User", "Company_HR"],
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || model("User", userSchema);

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hybrid"],
      required: true,
    },

    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      required: true,
    },

    seniorityLevel: {
      type: String,
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    },
    jobDescription: {
      type: String,
    },
    technicalSkills: {
      type: [String],
    },
    softSkills: {
      type: [String],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Job || model("Job", jobSchema);

import mongoose, { Schema } from "mongoose";

export interface IProgress extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export const Progress =
  (mongoose.models.Progress as mongoose.Model<IProgress>) ||
  mongoose.model<IProgress>("Progress", progressSchema);

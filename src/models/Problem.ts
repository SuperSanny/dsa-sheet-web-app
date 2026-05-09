import mongoose, { Schema } from "mongoose";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface IProblem extends mongoose.Document {
  title: string;
  topicId: mongoose.Types.ObjectId;
  difficulty: Difficulty;
  leetcodeUrl: string;
  youtubeUrl: string;
  articleUrl?: string;
  order: number;
}

const problemSchema = new Schema<IProblem>({
  title: { type: String, required: true },
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  leetcodeUrl: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  articleUrl: { type: String },
  order: { type: Number, default: 0 },
});

export const Problem =
  (mongoose.models.Problem as mongoose.Model<IProblem>) ||
  mongoose.model<IProblem>("Problem", problemSchema);

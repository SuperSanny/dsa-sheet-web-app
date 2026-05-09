import mongoose, { Schema } from "mongoose";

export interface ITopic extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

const topicSchema = new Schema<ITopic>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  order: { type: Number, default: 0 },
});

export const Topic =
  (mongoose.models.Topic as mongoose.Model<ITopic>) ||
  mongoose.model<ITopic>("Topic", topicSchema);

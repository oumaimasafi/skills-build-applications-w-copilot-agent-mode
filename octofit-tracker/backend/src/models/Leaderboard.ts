import { model, Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    period: { type: String, enum: ['weekly', 'monthly'], required: true },
    rank: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

leaderboardSchema.index({ team: 1, period: 1 }, { unique: true });

export default model('Leaderboard', leaderboardSchema);
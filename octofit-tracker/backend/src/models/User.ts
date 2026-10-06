import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    age: { type: Number, min: 13 },
    fitnessGoal: {
      type: String,
      enum: ['improve_endurance', 'build_strength', 'stay_active'],
      required: true,
    },
  },
  { timestamps: true },
);

export default model('User', userSchema);
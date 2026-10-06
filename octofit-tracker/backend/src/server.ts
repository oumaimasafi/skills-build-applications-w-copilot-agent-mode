import express from 'express';
import { connectDatabase } from './config/database.js';
import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;

export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/users/', async (_request, response) => {
  response.json(await User.find().select('-passwordHash').sort({ name: 1 }));
});

app.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().populate('members', 'name username').sort({ name: 1 }));
});

app.get('/api/activities/', async (_request, response) => {
  response.json(await Activity.find().populate('user', 'name username').sort({ occurredAt: -1 }));
});

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(await Leaderboard.find().populate('team', 'name').sort({ period: 1, rank: 1 }));
});

app.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find().sort({ name: 1 }));
});

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`OctoFit API listening at ${baseUrl}`);
  });
}

void startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API:', error);
  process.exitCode = 1;
});
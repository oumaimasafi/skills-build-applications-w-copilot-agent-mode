import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/** Seed the octofit_db database with test data. */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        name: 'Amina Benali',
        username: 'amina_runs',
        email: 'amina@example.com',
        passwordHash: 'seed-password-hash',
        age: 29,
        fitnessGoal: 'improve_endurance',
      },
      {
        name: 'Louis Martin',
        username: 'louis_lifts',
        email: 'louis@example.com',
        passwordHash: 'seed-password-hash',
        age: 34,
        fitnessGoal: 'build_strength',
      },
      {
        name: 'Samira Haddad',
        username: 'samira_moves',
        email: 'samira@example.com',
        passwordHash: 'seed-password-hash',
        age: 26,
        fitnessGoal: 'stay_active',
      },
    ]);

    const team = await Team.create({
      name: 'Morning Striders',
      description: 'A friendly team building a consistent morning routine.',
      members: users.map((user) => user._id),
      points: 420,
    });

    await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'run',
        durationMinutes: 35,
        caloriesBurned: 310,
        distanceKm: 5.2,
        occurredAt: new Date('2026-10-04T07:15:00Z'),
      },
      {
        user: users[1]._id,
        type: 'strength',
        durationMinutes: 45,
        caloriesBurned: 280,
        occurredAt: new Date('2026-10-04T17:30:00Z'),
      },
      {
        user: users[2]._id,
        type: 'cycling',
        durationMinutes: 50,
        caloriesBurned: 390,
        distanceKm: 18,
        occurredAt: new Date('2026-10-05T08:00:00Z'),
      },
    ]);

    await Leaderboard.create({
      team: team._id,
      period: 'weekly',
      rank: 1,
      points: 420,
    });

    await Workout.insertMany([
      {
        name: 'Steady Start 5K',
        description: 'An easy-paced session to build aerobic endurance.',
        difficulty: 'beginner',
        durationMinutes: 30,
        exercises: [
          { name: 'Easy run', durationMinutes: 20 },
          { name: 'Walking recovery', durationMinutes: 5 },
          { name: 'Cool-down', durationMinutes: 5 },
        ],
        tags: ['running', 'endurance'],
      },
      {
        name: 'Full Body Basics',
        description: 'A balanced strength session using simple movements.',
        difficulty: 'beginner',
        durationMinutes: 35,
        exercises: [
          { name: 'Bodyweight squats', sets: 3, reps: 12 },
          { name: 'Incline push-ups', sets: 3, reps: 10 },
          { name: 'Glute bridges', sets: 3, reps: 12 },
        ],
        tags: ['strength', 'full-body'],
      },
    ]);

    console.log('Seeded 3 users, 1 team, 3 activities, 1 leaderboard entry, and 2 workouts.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

await seedDatabase();

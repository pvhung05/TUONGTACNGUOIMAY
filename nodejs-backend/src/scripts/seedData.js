require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../logger');

// Models
const User = require('../modules/auth/User');
const Lesson = require('../modules/learn/Lesson');
const Translator = require('../modules/translator/Translator');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lesson.deleteMany({});
    await Translator.deleteMany({});

    // Cleanup legacy index from old translator schema (text unique) to prevent duplicate null errors.
    try {
      await Translator.collection.dropIndex('text_1');
      logger.info('Dropped legacy translators index: text_1');
    } catch (indexError) {
      // Ignore if index does not exist.
    }

    logger.info('Cleared existing data');

    // Seed sample users
    const users = await User.create([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: '123456',
        role: 'user',
        score: 150,
        streak: 5,
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: '123456',
        role: 'user',
        score: 200,
        streak: 8,
      },
      {
        username: 'bob_wilson',
        email: 'bob@example.com',
        password: '123456',
        role: 'user',
        score: 100,
        streak: 3,
      },
      {
        username: 'alice_johnson',
        email: 'alice@example.com',
        password: '123456',
        role: 'admin',
        score: 250,
        streak: 12,
      },
    ]);
    logger.info(`Created ${users.length} sample users`);

    // Seed sample lessons
    const lessons = await Lesson.create([
      {
        title: 'Basic Greetings',
        content: 'Learn how to greet people in sign language',
        resources: [
          { title: 'Greeting Intro Video', url: 'https://example.com/lessons/greetings-intro' },
          { title: 'Hello and Goodbye Practice', url: 'https://example.com/lessons/hello-goodbye' },
        ],
        type: 'lesson',
        scoreReward: 10,
        order: 1,
      },
      {
        title: 'Numbers 1-10',
        content: 'Practice signing numbers from 1 to 10',
        resources: [
          { title: 'Numbers 1-5', url: 'https://example.com/lessons/numbers-1-5' },
          { title: 'Numbers 6-10', url: 'https://example.com/lessons/numbers-6-10' },
        ],
        type: 'lesson',
        scoreReward: 10,
        order: 2,
      },
      {
        title: 'Vocabulary Practice 1',
        content: 'Practice common vocabulary words',
        resources: [
          { title: 'Common Daily Words', url: 'https://example.com/practice/daily-words' },
          { title: 'Quick Vocabulary Quiz', url: 'https://example.com/practice/vocabulary-quiz-1' },
        ],
        practiceQuestions: [
          {
            url: 'https://www.youtube.com/embed/aNvQjBYbA_Y',
            A: 'Hello',
            B: 'Thank you',
            C: 'Sorry',
            D: 'Goodbye',
            correct: 'A',
          },
          {
            url: 'https://www.youtube.com/embed/Dj3vaOo8ULI',
            A: 'Please',
            B: 'Help',
            C: 'Thank you',
            D: 'No',
            correct: 'C',
          },
        ],
        type: 'practice',
        scoreReward: 15,
        order: 3,
      },
      {
        title: 'Daily Phrases',
        content: 'Learn useful phrases for daily communication',
        resources: [
          { title: 'Daily Phrases - Part 1', url: 'https://example.com/lessons/daily-phrases-1' },
          { title: 'Daily Phrases - Part 2', url: 'https://example.com/lessons/daily-phrases-2' },
        ],
        type: 'lesson',
        scoreReward: 10,
        order: 4,
      },
      {
        title: 'Alphabet Practice',
        content: 'Practice signing the alphabet',
        resources: [
          { title: 'Alphabet A-M', url: 'https://example.com/practice/alphabet-a-m' },
          { title: 'Alphabet N-Z', url: 'https://example.com/practice/alphabet-n-z' },
        ],
        practiceQuestions: [
          {
            url: 'https://www.youtube.com/embed/QmaVPMcB1fk',
            A: 'A',
            B: 'B',
            C: 'C',
            D: 'D',
            correct: 'B',
          },
          {
            url: 'https://www.youtube.com/embed/lFRPODEnAyU',
            A: 'W',
            B: 'X',
            C: 'Y',
            D: 'Z',
            correct: 'D',
          },
        ],
        type: 'practice',
        scoreReward: 20,
        order: 5,
      },
      {
        title: 'Emotions & Feelings',
        content: 'Learn how to express emotions in sign language',
        resources: [
          { title: 'Basic Emotions', url: 'https://example.com/lessons/emotions-basic' },
          { title: 'Expressing Feelings in Sentences', url: 'https://example.com/lessons/feelings-sentences' },
        ],
        type: 'lesson',
        scoreReward: 10,
        order: 6,
      },
    ]);
    logger.info(`Created ${lessons.length} sample lessons`);

    // Seed sample translator words
    const translatorWords = [
      {
        title: 'hello',
        videos: [
          { title: 'Hello - main video', url: 'https://example.com/hello.mp4' },
        ],
      },
      {
        title: 'goodbye',
        videos: [
          { title: 'Goodbye - main video', url: 'https://example.com/goodbye.mp4' },
        ],
      },
      {
        title: 'thank you',
        videos: [
          { title: 'Thank you - main video', url: 'https://example.com/thank-you.mp4' },
        ],
      },
      {
        title: 'please',
        videos: [
          { title: 'Please - main video', url: 'https://example.com/please.mp4' },
        ],
      },
      {
        title: 'yes',
        videos: [
          { title: 'Yes - main video', url: 'https://example.com/yes.mp4' },
        ],
      },
      {
        title: 'no',
        videos: [
          { title: 'No - main video', url: 'https://example.com/no.mp4' },
        ],
      },
      {
        title: 'help',
        videos: [
          { title: 'Help - main video', url: 'https://example.com/help.mp4' },
        ],
      },
      {
        title: 'water',
        videos: [
          { title: 'Water - main video', url: 'https://example.com/water.mp4' },
        ],
      },
      {
        title: 'food',
        videos: [
          { title: 'Food - main video', url: 'https://example.com/food.mp4' },
        ],
      },
      {
        title: 'friend',
        videos: [
          { title: 'Friend - main video', url: 'https://example.com/friend.mp4' },
        ],
      },
    ];

    const words = await Translator.insertMany(translatorWords);
    logger.info(`Created ${words.length} sample translator words`);

    logger.info('Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Seed data error');
    if (error?.stack) {
      logger.error(error.stack);
    }
    process.exit(1);
  }
};

seedData();

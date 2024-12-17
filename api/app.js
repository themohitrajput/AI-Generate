import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import cors from 'cors';

global.fetch = fetch; // Polyfill for fetch in Node.js < 18

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI('AIzaSyCsWsmppT3zl85WNpKPX6-qAUbMycVfqCM');

// API route to generate content
app.post('/generate-content', async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const content = await model.generateContent(prompt);
    res.json({ response: content });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

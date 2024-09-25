import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI('AIzaSyBlOpa-wekM0lhQuqI4U6anUDnk1G0NPS4');

// API route to generate content with POST request
app.post('/generate-content', async (req, res) => {
  const { prompt } = req.body; // Get the prompt from the request body
  try {
    const r = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const content = await r.generateContent(prompt); // Use the prompt from the body
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

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




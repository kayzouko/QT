require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { generateStory } = require('./utils/ollamaHelper');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const story = await generateStory(prompt);
    res.json({ 
      success: true,
      data: story
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: "Story generation failed",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Ollama endpoint: http://localhost:11434`);
});
const axios = require('axios');

const OLLAMA_HOST = 'http://localhost:11434';

async function generateStory(prompt) {
  try {
    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model: "llama3", //llama3 plus lourd
      prompt: `
        Crée une histoire en 5 parties séparées par '||'. 
        Chaque partie doit contenir une émotion différente entre []. Les émotions possibles sont :
        joie, fierté, tristesse, colère, peur, surprise, indifférence, neutre. 
        Exemple: "Le lièvre sautait.[joie]||Il tomba.[triste]"
        Thème: ${prompt}
      `,
      stream: false,
      options: {
        temperature: 0.7,
        max_tokens: 500
      }
    });

    return parseOllamaResponse(response.data?.response || '');
  } catch (error) {
    throw new Error(`Ollama error: ${error.message}`);
  }
}

function parseOllamaResponse(rawText) {
  const segments = rawText.split('||').map(segment => {
    const [text, emotion] = segment.split('[');
    return {
      text: text.trim(),
      emotion: emotion ? emotion.replace(']', '').trim() : 'neutre'
    };
  });

  return { segments };
}

module.exports = { generateStory };
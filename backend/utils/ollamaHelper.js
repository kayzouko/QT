const axios = require('axios');

const OLLAMA_HOST = 'http://localhost:11434';

async function generateStory(prompt) {
  try {
    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model: "llama3", //llama3 plus lourd
      prompt: `
        Crée une histoire en 10 parties séparées par '||'. 
        Chaque partie doit contenir une émotion différente entre []. Les émotions possibles sont :
        joyeux, triste, taquin, En colère, colère, affectueux, Timide, heureux, déçu, chagriné, surpris, surprise, neutre, étonné, fâché, amusé, inquiet. 
        Exemple: "Le lièvre sautait.[joie]||Il tomba.[triste]".
        Ne dis pas "Voici l'histoire en 10 parties" juste donne l'histoire.
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
      const match = segment.match(/^(.*)\[([^\]]+)\]$/); //capture le texte et l'émotion entre crochets
      if (match) {
          return {
              text: match[1].trim(),
              emotion: match[2].trim().toLowerCase() //convertit l'émotion en minuscule
          };
      } else {
          //si aucune émotion n'est trouvée, retourne le texte avec une émotion par défaut
          return {
              text: segment.trim(),
              emotion: 'neutre'
          };
      }
  });

  return { segments };
}

module.exports = { generateStory };
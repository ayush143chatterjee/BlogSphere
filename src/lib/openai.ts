import OpenAI from 'openai';

// Only create the client if we have an API key
const createOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OpenAI API key not found. Chat will use fallback responses.');
    return null;
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const openai = createOpenAIClient();
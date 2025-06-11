import OpenAI from 'openai';

let openai;

const getOpenAIClient = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

const getFlashcardsFromAI = async (text) => {
  const prompt = `Create 8-10 flashcards with a question and answer from the following:\n\n${text.slice(0, 3000)}
  Each question should begin with 'Question:' and each answer should begin with 'Answer:'`;

  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content;
}

export default getFlashcardsFromAI;
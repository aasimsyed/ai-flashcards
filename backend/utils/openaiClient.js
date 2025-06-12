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
  // Extract random 3000-character slice for varied content on refresh
  const maxSliceLength = 3000;
  let extractedText;
  
  if (text.length <= maxSliceLength) {
    // If text is shorter than 3000 chars, use all of it
    extractedText = text;
  } else {
    // Calculate random starting position
    const maxStartPosition = text.length - maxSliceLength;
    const randomStart = Math.floor(Math.random() * maxStartPosition);
    extractedText = text.slice(randomStart, randomStart + maxSliceLength);
    
    console.log(`Using random slice: characters ${randomStart} to ${randomStart + maxSliceLength} of ${text.length} total`);
  }
  
  const prompt = `Create 8-10 flashcards with a question and answer from the following:\n\n${extractedText}
  Each question should begin with 'Question:' and each answer should begin with 'Answer:'`;

  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content;
}

export default getFlashcardsFromAI;
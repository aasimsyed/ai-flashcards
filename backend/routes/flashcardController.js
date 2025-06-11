import express from 'express';
import scrapeTextFromURL from '../utils/puppeteerScraper.js';
import getFlashcardsFromAI from '../utils/openaiClient.js';
import FlashcardCache from '../model/flashcardModel.js';

const router = express.Router();

router.post('/generate-flashcards', async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing' });
  }
  
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required in request body' });
  }
  
  try {
    // Check if refresh is requested: query parameter ?refresh=true
    const refresh = req.query.refresh === 'true';
    
    // Step 1: Check cache first (unless refresh is requested)
    if (!refresh) {
      const cachedResult = await FlashcardCache.findOne({ url });
      if (cachedResult) {
        console.log('Cache hit for URL:', url);
        return res.json({ 
          flashcards: cachedResult.flashcards,
          cached: true,
          cachedAt: cachedResult.createdAt
        });
      }
    } else {
      console.log('Cache refresh requested for URL:', url);
    }

    console.log('Processing fresh request for URL:', url);

    // Step 2a: Scrape URL using Puppeteer
    const text = await scrapeTextFromURL(url);

    // Step 2b: Process scraped data through ChatGPT for Question/Answer format
    const flashcards = await getFlashcardsFromAI(text);

    // Step 3: Cache the result (create or update)
    try {
      await FlashcardCache.findOneAndUpdate(
        { url },
        { 
          flashcards,
          createdAt: new Date()
        },
        { // Create if doesn't exist, update if it does
          upsert: true, 
          new: true 
        }
      );
      console.log(`${refresh ? 'Updated' : 'Cached'} result for URL:`, url);
    } catch (cacheError) {
      // Log but don't fail the request if caching fails
      console.error('Failed to cache result:', cacheError.message);
    }

    res.json({ 
      flashcards, 
      cached: false
    });
  } catch (err) {
    console.error('Error generating flashcards:', err);
    res.status(500).json({ error: "Failed to generate flashcards", details: err.message });
  }
});

export default router;

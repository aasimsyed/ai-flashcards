import React, { useState } from 'react';
import axios from 'axios';
import Card from './Card';

const UrlForm = () => {
  // set the URL being input
  // set the flashcards after parsing
  // set the refresh state when clicking "Refresh"
  const [url, setUrl] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);

  // on form submit do this
  const handleSubmit = async (event) => {
    // prevent page reload
    event.preventDefault();
    console.log('Input Value:', url);
    try {
      // send a POST request to the backend with optional refresh query param
      const endpoint = isRefresh
        ? '/api/generate-flashcards?refresh=true'
        : '/api/generate-flashcards';
      const response = await axios.post(endpoint, { url: url });
      console.log('Response: ', response.data);

      // if the response sends back the flashcard string in the JSON
      if (response.data.flashcards) {
        // save to variable and split on '\n\n', which is how the pairs are delimited
        const flashcardsText = response.data.flashcards;
        const cardPairs = flashcardsText.split('\n\n');

        // use map so that each pair is split into an array
        // first element is question, second element is answer
        // if any are empty, filter out and return object
        const parsedCards = cardPairs
          .map((pair, index) => {
            const lines = pair.split('\n');
            return {
              id: index,
              question: lines[0] || '',
              answer: lines[1] || '',
            };
          })
          .filter((card) => card.question && card.answer);

        // set the flashcards state
        setFlashcards(parsedCards);
      } else {
        console.log('No flashcards received');
      }
    } catch (err) {
      console.error(err);
    } finally {
      // Reset refresh state after request completes
      setIsRefresh(false);
    }
  };

  // set the url state with inputted URL
  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  // handle refresh button click
  // set refresh to true so that the query parameter will be added
  // then submit
  const handleRefresh = (event) => {
    setIsRefresh(true);
    handleSubmit(event);
  };

  const handleClear = () => {
    setUrl('');
  };

  // use map to create cards using the question/answer pairs from flashcards
  return (
    <>
      <h1>AI Flashcard Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter URL:
          <input type="text" value={url} onChange={handleChange} />
        </label>
        <button type="submit">Generate Flashcards</button>
        <button type="button" onClick={handleRefresh}>
          Refresh URL
        </button>
        <button type="button" onClick={handleClear}>
          Clear Input
        </button>
      </form>
      <span>URL entered: {url}</span>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: '20px',
        }}
      >
        {flashcards &&
          flashcards.map((card, index) => (
            <Card key={index} question={card.question} answer={card.answer} />
          ))}
      </div>
    </>
  );
};

export default UrlForm;

import React, { useState } from 'react';
import './Card.css';

const Card = ({ question, answer }) => {
  // state to see what side card is on
  const [flipped, setFlipped] = useState(true);

  // flip the cards between question answer on click
  return (
    <div className='card'
      onClick={() => setFlipped(!flipped)}
    >
      {flipped ? question : answer}
    </div>
  )
};

export default Card;
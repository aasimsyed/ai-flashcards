import React, { useState } from 'react';

const Card = ({ question, answer }) => {
  // state to see what side card is on
  const [flipped, setFlipped] = useState(true);

  // flip the cards between question answer on click
  return (
    <div 
      style={{ 
        width: '200px', 
        height: '200px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer'
      }}
      onClick={() => setFlipped(!flipped)}
    >
      {flipped ? question : answer}
    </div>
  )
};

export default Card;
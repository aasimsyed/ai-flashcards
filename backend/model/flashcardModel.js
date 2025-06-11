import mongoose from 'mongoose';

const flashcardCacheSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  flashcards: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('FlashcardCache', flashcardCacheSchema);
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.use(express.json());

app.post('/search', (req, res) => {
  try {
    const { recipe, searchWord } = req.body;

    if (!recipe || !searchWord) {
      return res.status(400).json({ error: 'Both recipe and searchWord are required in the request body.' });
    }

    // Function to find occurrences and positions of a word in a text
    const findOccurrences = (text, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = Array.from(text.matchAll(regex), match => match.index);
      return { occurrences: matches.length, positions: matches };
    };

    // Find occurrences and positions of the searchWord in the recipe
    const { occurrences, positions } = findOccurrences(recipe, searchWord);

    // Send the response with the count and positions
    res.json({ occurrences, positions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
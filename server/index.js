const express = require("express");
const { generateRavelrySearchTerms } = require("./apis/openai");
const { searchRavelry } = require("./apis/ravelry");

const dotenv = require('dotenv')
dotenv.config()


const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/search", async (req, res) => {
  const input = req.query.input;

  if (typeof input !== 'string') {
    throw new Error('Invalid user input')
  }

  const searchTerms = await generateRavelrySearchTerms(input.slice(0, 200))
  const { patterns } = await searchRavelry(searchTerms)

  res.json({ patterns });
});

const express = require("express");
const cors = require("cors");
const { generateRavelrySearchTerms } = require("./apis/openai");
const { searchRavelry } = require("./apis/ravelry");

const dotenv = require('dotenv')
dotenv.config()


const PORT = process.env.PORT || 3001;

const app = express();

const allowlist = ['http://localhost:3000', 'https://ahamburger.github.io/knit-gen-ai']
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/search", cors(corsOptionsDelegate), async (req, res) => {
  const input = req.query.input;
  if (typeof input !== 'string') {
    res.status(400).send('Invalid user input')
    return
  }

  try {
    const searchTerms = await generateRavelrySearchTerms(input.slice(0, 200))
    const result = await searchRavelry(searchTerms)

    res.json(result);
  } catch (err) {
    res.status(500).send(err.message)
  }
});

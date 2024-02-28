const express = require("express");
const cors = require("cors");
const { generateRavelrySearchTerms } = require("./apis/openai");
const { searchRavelry } = require("./apis/ravelry");

const dotenv = require('dotenv')
dotenv.config()


const PORT = process.env.PORT || 3001;

const app = express();

const allowlist = ['http://localhost:3000', 'https://ahamburger.github.io']
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
    return;
  }


  if (req.query.model && req.query.model !== 'gpt-4' && req.query.model !== 'gpt-3.5-turbo-0125') {
    res.status(400).send('Invalid model: only "gpt-4" or "gpt-3.5-turbo-0125" accepted');
    return;
  }

  const model = req.query.model || 'gpt-3.5-turbo-0125'
  console.log('Using model', model)
  try {
    const searchTerms = await generateRavelrySearchTerms(input.slice(0, 200), model)
    const { explanation, suggestion } = { ...searchTerms };
    delete searchTerms.explanation;
    delete searchTerms.suggestion;

    const result = await searchRavelry(searchTerms)

    res.json({ ...result, explanation, suggestion });
  } catch (err) {
    res.status(500).send(err.message)
  }
});

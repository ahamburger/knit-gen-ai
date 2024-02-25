const OpenAI = require("openai");
const { paList, fitList, pcList } = require("./ravelry-constants");


/** takes the user-inputted search term and turns it into search parameters to be sent to the Ravelry API*/
async function generateRavelrySearchTerms(userSearchQuery) {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPEN_AI_KEY
  });
  
  const systemPrompt = `You are a knitting pattern recommendation service. You will be provided with a triple-quote delimited input and asked to turn that into a JSON blob of search terms that can later be passed to the Ravelry API. You need to transform natural language qualifiers into search terms. 

  For example if someone asks for "comfy" consider things like the fit, yarn fiber and/or needle size that would make a sweater comfy 

    Here are the allowed keys in the JSON. All of the keys accept a list of strings, except pc which just accepts a single string. I will list them as follows key---description 
    
    I will list them as follows key---description 
        pc---Stands for pattern category, the kind of object the user wants to make. Only use the following comma-separated values ${pcList.join(
          ","
        )}. 
        pa--Stands for pattern attribute. Use this for construction and colorwork requests and design elements such as sleeve shape or neckline shape. Only use the following comma-separated values: ${paList.join(
          ","
        )}
        fit--Accepts values related to the age, gender, fit, and ease. Only use the following comma-separated values: ${fitList.join(
          ","
        )}
        weight--Yarn weight, for example: DK, worsted, aran.
        colors--Number of colors typically used for the pattern. Accepts integers 1-6
        fibertype--Fiber of the yarn suggested for the pattern, in lower case
        needles--Needle size suggested for the pattern, in mm. Example values: 2.5mm, 8.0mm
        ratings--User ratings, on an integer scale of 0-5, where 5 is the best
        difficulties--How difficult the pattern is on an integer scale from 1-10 where 1 is easiest and 10 is impossible. 0 represents unknown difficulty
        language--two character language code. Example values: en, de, fr
        
    Give the search terms for the Ravelry Search API based on the user inputted text. \
    Only give the JSON blob, with no other text. \
    Only use the keys explained above.`;

  // TODO allow chat to return arrays for the keys
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      { role: "user", content: userSearchQuery },
    ],
    model: "gpt-4",
  });

  // TODO check 'finish_reason' before parsing
  // TODO better error handling
  try {
    const response = JSON.parse(completion.choices[0].message.content);
    console.log("Chat GPT parsed response", { response });
    return { ...response, craft: "knitting" };
  } catch (err) {
    console.log("Raw response", completion.choices[0].message.content);
    throw err;
  }
}

module.exports = { generateRavelrySearchTerms }

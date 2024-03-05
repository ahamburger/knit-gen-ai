const OpenAI = require("openai");
const { paList, fitList, pcList, weightList, fiberList } = require("../ravelry-constants");

/** keys included in the prompt */
const validKeys = ['pc', 'pa','fit', 'weight', 'colors', 'fibertype', 'needles', 'ratings', 'difficulties', 'language', 'explanation', 'suggestion']

/** takes the user-inputted search term and turns it into search parameters to be sent to the Ravelry API*/
async function generateRavelrySearchTerms(userSearchQuery, model) {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPEN_AI_KEY,
  });

  const systemPrompt = `You are a knitting pattern recommendation service. You will be provided with a user input and asked to turn that into a JSON blob of search terms that can later be passed to the Ravelry API. You need to transform natural language qualifiers into search terms. 

  For example if someone asks for "comfy" consider things like the fit, yarn fiber and/or needle size that would make a sweater comfy 

    Here are the allowed keys in the JSON. All of the keys accept a list of strings. 
    
    I will list them as follows key---description 
        pc---Stands for pattern category, the kind of object the user wants to make. Do not use any values other than the following comma-separated values ${pcList.join(
          ","
        )} 
        pa--Stands for pattern attribute. Use this for construction and colorwork requests and design elements such as sleeve shape or neckline shape. Do not use any values other than the following comma-separated values: ${paList.join(
          ","
        )}
        fit--Accepts values related to the age, gender, fit, and ease. Do not use any values other than the following comma-separated values: ${fitList.join(
          ","
        )}
        weight--Yarn weight, for example: DK, worsted, aran. Do not use any values other than the following comma-separated values: ${weightList.join(
          ","
        )}
        colors--Number of colors typically used for the pattern. Accepts integers 1-6
        fibertype--Fiber of the yarn suggested for the pattern, in lower case. Do not use any values other than the following: ${fiberList.join(
          ","
        )}
        needles--Needle size suggested for the pattern, in mm. Example values: 2.5mm, 8.0mm
        ratings--User ratings, on an integer scale of 0-5, where 5 is the best
        difficulties--How difficult the pattern is on an integer scale from 1-10 where 1 is easiest and 10 is impossible. 0 represents unknown difficulty
        language--two character language code. Example values: en, de, fr
        
        Give the search terms for the Ravelry Search API based on the user inputted text.     
        Add an "explanation" key with why you returned the other values, in just one sentence
        Add a "suggestion" field with suggestions on how the user could improve their search, in one sentence. Refer to the user as You
    
        Only give the JSON blob, with no other text.
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      { role: "user", content: userSearchQuery },
    ],
    model,
  });

  if (completion.choices[0]?.finish_reason !== "stop") {
    throw new Error(`Chat completion finish_reason was ${completion.finish_reason}`)
  }

  try {
    const response = JSON.parse(completion.choices[0].message.content)
    console.log("Chat GPT parsed response", { response });
    console.log("Chat GPT fitlered response", filterInvalidValues(response));

    return filterInvalidValues(response);
  } catch (err) {
    throw new Error(`Error parsing chat completion. Raw response: ${completion.choices[0]?.message?.content}`)
  }
}

function filterInvalidValues(chatResponse) {
  const validatedResponse = {};
  for (const key in chatResponse) {
    if (!validKeys.includes(key)) {
      continue;
    }

    const chatResponseValue = chatResponse[key];

    if (Array.isArray(chatResponseValue)) {
      const validatedValues = chatResponseValue.filter((v) => valueIsValid(key, v));
      if (validatedValues.length) {
        validatedResponse[key] = validatedValues;
      }
    } else if (
      typeof chatResponseValue === "string" &&
      valueIsValid(key, chatResponseValue)
    ) {
      validatedResponse[key] = chatResponseValue;
    } else {
      validatedResponse[key] = chatResponseValue;
    }
  }

  return validatedResponse;
}

function valueIsValid(key, value) {
  switch (key) {
    case "pa":
      return paList.includes(value);
    case "pc":
      return pcList.includes(value);
    case "fit":
      return fitList.includes(value);
    case "weight":
      return weightList.includes(value);
    case "fibertype":
      return fiberList.includes(value)
    default:
      // TODO validate more of the keys
      return true;
  }
}

module.exports = { generateRavelrySearchTerms };

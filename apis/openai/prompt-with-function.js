const OpenAI = require("openai");
const {
  paList,
  fitList,
  pcList,
  weightList,
  fiberList,
} = require("../ravelry-constants");

/** keys included in the prompt */
const validKeys = [
  "pc",
  "pa",
  "fit",
  "weight",
  "colors",
  "fibertype",
  "needles",
  "ratings",
  "difficulties",
  "language",
  "explanation",
  "suggestion"
];

function getSearchTermsTool({
  pc,
  pa,
  fit,
  weight,
  colors,
  fibertype,
  needles,
  ratings,
  language,
  explanation,
  suggestion
}) {
  // TODO not sure how much validation needed here
  return {
    searchTerms: {
      pc: pc?.filter((v) => pcList.includes(v)),
      pa: pa?.filter((v) => paList.includes(v)),
      fit: fit?.filter((v) => fitList.includes(v)),
      weight: weight?.filter((v) => weightList.includes(v)),
      colors,
      fibertype: fibertype?.filter((v) => fiberList.includes(v)),
      needles,
      ratings,
      language,
    },
    explanation,
    suggestion
  };
}

/** takes the user-inputted search term and turns it into search parameters to be sent to the Ravelry API*/
async function generateRavelrySearchTermsWithFunction(userSearchQuery) {
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPEN_AI_KEY,
  });

  const tools = [
    {
      type: "function",
      function: {
        name: "get_search_terms_tool",
        description: "Get the search terms for a knitting pattern description",
        parameters: {
          type: "object",
          required: validKeys,
          properties: {
            pc: {
              type: "array",
              items: {
                type: "string",
                enum: pcList,
              },
              description:
                "Pattern category, the kind of object the user wants to make",
            },
            pa: {
              type: "array",
              items: {
                type: "string",
                enum: paList,
              },
              description:
                "Pattern attributes. Use this for construction and colorwork requests and design elements such as sleeve shape or neckline shape. ",
            },
            fit: {
              type: "array",
              items: {
                type: "string",
                enum: fitList,
              },
              description:
                "Use this to specify the age, gender, fit, and ease.",
            },
            weight: {
              type: "array",
              items: {
                type: "string",
                enum: weightList,
              },
              description: "Weight of the yarn used.",
            },
            colors: {
              type: "array",
              items: {
                type: "number",
                enum: [1, 2, 3, 4, 5, 6],
              },
              description: "Number of colors typically used for the pattern",
            },
            fibertype: {
              type: "array",
              items: {
                type: "string",
                enum: fiberList,
              },
              description:
                "Fiber of the yarn suggested for the pattern, in lower case",
            },
            needles: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "Needle size suggested for the pattern, in mm. Example values: 2.5mm, 8.0mm",
            },
            ratings: {
              type: "array",
              items: {
                type: "number",
              },
              description:
                "User ratings, where 0 is the worst and 5 is the best rating",
            },
            difficulties: {
              type: "array",
              items: {
                type: "number",
                enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
              },
              description:
                "How difficult the pattern is on an integer scale from 1-10 where 1 is easiest and 10 is impossible",
            },
            language: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "Two character language code. Example values: en, de, fr. If the user does not specify this, use the language the user uses",
            },
            explanation: {
              type: "string",
              description:
                "Why you returned the other values, in just one sentence",
            },
            suggestion: {
              type: "string",
              description:
                "How the user could improve their search, in just one sentence, written in the second person",
            },
          },
        },
      },
    },
  ];

  const systemPrompt = `You are a knitting pattern recommendation service. You will be provided with a user input and asked to turn that into a JSON blob of search terms that can later be passed to the Ravelry API. 
  You should transform natural language description into search terms. If a key does not apply, use "undefined"
  
  For example if someone asks for "comfy" consider things like the fit, yarn fiber and/or needle size that would make a sweater comfy.
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      { role: "user", content: userSearchQuery },
    ],
    tools,
    tool_choice: {
      type: "function",
      function: { name: "get_search_terms_tool" },
    },
    model: "gpt-3.5-turbo-0125",
  });

  if (completion.choices[0]?.finish_reason !== "stop") {
    throw new Error(
      `Chat completion finish_reason was ${completion.finish_reason}`
    );
  }

  const responseMessage = completion.choices[0].message;

  // check if the model wanted to call a function
  if (responseMessage.tool_calls) {
    // Call the function
    const availableFunctions = {
      get_search_terms_tool: getSearchTermsTool,
    };

    try {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];

      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = functionToCall(functionArgs);
      console.log("Chat GPT parsed response", { functionResponse });
      return functionResponse;
    } catch (err) {
      console.log(err);
      throw new Error(
        `Error parsing chat completion. Raw response: ${responseMessage?.content}`
      );
    }
  }
  return {};
}

module.exports = { generateRavelrySearchTermsWithFunction };

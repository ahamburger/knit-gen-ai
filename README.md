# Knit Pattern Search Helper

[https://ahamburger.github.io/knit-gen-ai/](https://ahamburger.github.io/knit-gen-ai/)

Input a natural language description of what kind of knitting project you'd like to make (ie: "cozy winter socks", "easy colorful mittens", "warm vest for my dog"), and a list of patterns from Ravelry will be shown.

Under the hood, the inputted description is being passed through ChatGPT to generate search terms that can be sent to the Ravelry API.


### Motivation

My goal was to create a simple "Hello, World" project with the OpenAI APIs. 

Via the UI, you can toggle between using `gpt-3.5-turbo-0125` (labeled "gpt-3.5-turbo-0125, prompt only" in the UI), `gpt-4` (labeled "gpt-4, prompt only" in the UI), or `gpt-3.5-0125` where the prompt makes use of the OpenAI [function calling feature](https://platform.openai.com/docs/guides/function-calling?lang=node.js) (labeled "gpt-3.5-turbo-0125, prompt + function" in the UI). Read more about my learnings in [tradeoffs.md](./tradeoffs.md)
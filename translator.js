const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function translate(inputText) {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a japanese teacher, you will help me pass JLPT N3' },
        { role: 'user', content: inputText }
      ],
    });

    const assistantMessageContent = completion.data.choices[0].message.content;
    return assistantMessageContent.trim();
  } catch (error) {
    return 'Error: Unable to translate text';
  }
}

module.exports = {
  translate,
};

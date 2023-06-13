import exp from 'constants';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';

const conf = new Configuration({
    apiKey: process.env.VITE_OPENAI_TOKEN,
});

const openai = new OpenAIApi(conf)

export async function getCompletion(prompt: string, model = 'gpt-3.5-turbo', temperature = 0) {
    const messages = [
        {
            role: 'user',
            content: prompt,
        },
    ] as ChatCompletionRequestMessage[];

    const completion = await openai.createChatCompletion({
        model: model,
        messages: messages,
        temperature: temperature       // The degree of randomness in the output
    });

    const result = completion.data.choices[0].message?.content;
    return result
};

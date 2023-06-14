import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain/prompts';
import {LLMChain} from 'langchain/chains';

// We can construct an LLMChain from a PromptTemplate and an LLM.

const model = new OpenAI({ temperature: 0, openAIApiKey: process.env.VITE_OPENAI_TOKEN });

const prompt = PromptTemplate.fromTemplate(
    'What is the best name to describe a company that makes {product}?',
);
const chain = new LLMChain({ llm: model, prompt });

export const llmChainTry_call = async () => {
    const resA = await chain.call({ product: 'colorful socks' });
    console.log(resA);


};

export const llmChainTry_run = async () => {
    // Since the LLMChain is a single-input, single-output chain, we can also `run` it.
    // This takes in a string and returns the `text` property.

    const resB = await chain.run('Queen Size Sheet Set');
    console.log(resB);
};


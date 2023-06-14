import { OpenAI } from "langchain/llms/openai";


const token = process.env.VITE_OPENAI_TOKEN;
const modelOpenAI = new OpenAI(
    {
        openAIApiKey: token,
        temperature:0.9
    }
)

export async function getLangChainChat(prompt: string) {
    const result = await modelOpenAI.call(prompt);
    return result;
}

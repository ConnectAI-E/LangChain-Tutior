import {BufferMemory} from 'langchain/memory';
import {ConversationChain} from 'langchain/chains';
import {modelOpenAI} from '../util/langchain';

const memory = new BufferMemory();
const chain = new ConversationChain({ llm: modelOpenAI, memory: memory });
export const bufferMemory = async () => {
    await chain.call({ input: 'Hi, my name is Andrew' });
    const res = await chain.call({ input: 'What\'s my name?' });
    console.log({ res });
    console.log(memory.chatHistory);
    console.log(await memory.loadMemoryVariables({}));
    return res;
};

export const bufferMemorySaveContext = async () => {
    await memory.clear()
    await memory.saveContext(  { input: "hi" },
        { output: "What's up" })
    await memory.saveContext(  { input: "Not much, just hanging" },
        { output: "Cool" })
    console.log(await memory.loadMemoryVariables({}))
}




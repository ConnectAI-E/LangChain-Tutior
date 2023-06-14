import {BufferMemory, BufferWindowMemory} from 'langchain/memory';
import {ConversationChain} from 'langchain/chains';
import {modelOpenAI} from '../util/langchain';

const windowsMemory = new BufferWindowMemory({k: 1});
const chain = new ConversationChain({ llm: modelOpenAI, memory: windowsMemory });
export const bufferWindowMemory = async () => {
    await chain.call({ input: 'Hi, my name is Andrew' });
    await chain.call({ input: '1+1' });
    const res = await chain.call({ input: 'What\'s my name?' });
    console.log({ res });

    console.log(windowsMemory.chatHistory);
    console.log(await windowsMemory.loadMemoryVariables({}));
    return res;
};


export const windowBufferMemorySaveContext = async () => {
    await windowsMemory.clear()
    await windowsMemory.saveContext(  { input: "hi" },
        { output: "What's up" })
    await windowsMemory.saveContext(  { input: "Not much, just hanging" },
        { output: "Cool" })
    console.log(await windowsMemory.loadMemoryVariables({}))
}





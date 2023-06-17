import {BufferMemory, BufferWindowMemory} from 'langchain/memory';
import {ConversationChain} from 'langchain/chains';
import {modelOpenAI} from '../util/langchain';

const windowsMemory = new BufferWindowMemory({k: 1});
const chain = new ConversationChain({ llm: modelOpenAI, memory: windowsMemory });
export const bufferWindowMemory = async () => {
    await chain.call({ input: '嗨，我叫安德鲁。 });
    await chain.call({ input: '1+1' });
    const res = await chain.call({ input: '我的名字是?' });
    console.log({ res });

    console.log(windowsMemory.chatHistory);
    console.log(await windowsMemory.loadMemoryVariables({}));
    return res;
};


export const windowBufferMemorySaveContext = async () => {
    await windowsMemory.clear()
    await windowsMemory.saveContext(  { input: "嗨" },
        { output: "最近怎么样？" })
    await windowsMemory.saveContext(  { input: "没什么，就是闲着呢" },
        { output: "酷" })
    console.log(await windowsMemory.loadMemoryVariables({}))
}





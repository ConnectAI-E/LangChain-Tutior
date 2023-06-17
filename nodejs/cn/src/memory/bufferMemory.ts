import {BufferMemory} from 'langchain/memory';
import {ConversationChain} from 'langchain/chains';
import {modelOpenAI} from '../util/langchain';

const memory = new BufferMemory();
const chain = new ConversationChain({ llm: modelOpenAI, memory: memory });
export const bufferMemory = async () => {
    await chain.call({ input: '你好，我叫安德鲁。' });
    const res = await chain.call({ input: '我的名字是？' });
    console.log({ res });
    console.log(memory.chatHistory);
    console.log(await memory.loadMemoryVariables({}));
    return res;
};

export const bufferMemorySaveContext = async () => {
    await memory.clear()
    await memory.saveContext(  { input: "嗨" },
        { output: "最近怎么样？" })
    await memory.saveContext(  { input: "没什么，就是闲着呢" },
        { output: "酷" })
    console.log(await memory.loadMemoryVariables({}))
}




import {ConversationSummaryMemory} from 'langchain/memory';
import {ConversationChain} from 'langchain/chains';
import {modelOpenAI} from '../util/langchain';
import {ChatOpenAI} from 'langchain/chat_models';

const summaryMemory = new ConversationSummaryMemory({
    memoryKey: 'chat_history',
    llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0,openAIApiKey:process.env.VITE_OPENAI_TOKEN, }),
});


const chain = new ConversationChain({ llm: modelOpenAI, memory: summaryMemory });
export const summaryBufferMemory = async () => {
    await summaryMemory.clear();
    await chain.call({ input: '嗨, 我叫安德鲁。' });
    const res = await chain.call({ input: '我的名字是?' });
    console.log({ res });

    console.log(summaryMemory.chatHistory);
    console.log(await summaryMemory.loadMemoryVariables({}));
    return res;
};


export const summaryMemorySaveContext = async () => {
    await summaryMemory.clear();
    await summaryMemory.saveContext({ input: '嗨' },
        { output: '最近怎么样？' });
    await summaryMemory.saveContext({ input: '没什么，就是闲着呢' },
        { output: '酷' });
    console.log(await summaryMemory.loadMemoryVariables({}));
};





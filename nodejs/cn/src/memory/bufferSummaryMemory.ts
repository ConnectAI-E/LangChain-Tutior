import {ConversationSummaryMemory} from 'langchain/memory';
import {ConversationChain, LLMChain} from 'langchain/chains';
import {modelOpenAI} from '../util/langchain';
import {PromptTemplate} from 'langchain';
import {ChatOpenAI} from 'langchain/chat_models';

const summaryMemory = new ConversationSummaryMemory({
    memoryKey: 'chat_history',
    llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0,openAIApiKey:process.env.VITE_OPENAI_TOKEN, }),
});



const chain = new ConversationChain({ llm: modelOpenAI, memory: summaryMemory });
export const summaryBufferMemory = async () => {
    await summaryMemory.clear();
    await chain.call({ input: 'Hi, my name is Andrew' });
    const res = await chain.call({ input: 'What\'s my name?' });
    console.log({ res });

    console.log(summaryMemory.chatHistory);
    console.log(await summaryMemory.loadMemoryVariables({}));
    return res;
};


export const summaryMemorySaveContext = async () => {
    await summaryMemory.clear();
    await summaryMemory.saveContext({ input: 'hi' },
        { output: 'What\'s up' });
    await summaryMemory.saveContext({ input: 'Not much, just hanging' },
        { output: 'Cool' });
    console.log(await summaryMemory.loadMemoryVariables({}));
};





import {describe, expect, it, test} from 'vitest';
import {getCompletion} from '../src/util/openai';
import { llmChainTry_call, llmChainTry_run} from '../src/chain/llmChain';
import {simpleSequentialChain} from '../src/chain/simpleSequentialChain';
import {sequentialChain} from '../src/chain/sequentialChain';


test('base OpenAI api', async () => {
    const re = await getCompletion('Hello, my name is');
    console.log(re);
    expect(re).not.toBe(null);
});


describe('llm chain', async () => {

    //An LLMChain is a simple chain that adds some functionality around language models.
    //An LLMChain consists of a PromptTemplate and a language model (either an LLM or chat model).
    it('call', async () => {
        const re = await llmChainTry_call();
    });

    it('run', async () => {
        const re = await llmChainTry_run();
    });

});

describe('sequential chain',async () => {
    it('simple', async() => {
       await simpleSequentialChain()
    })

    it('common',async () => {
        await sequentialChain()
    })

})


import {describe, expect, it, test} from 'vitest';
import {getCompletion} from '../src/util/openai';
import { llmChainTry_call, llmChainTry_run} from '../src/chain/llmChain';
import {simpleSequentialChain} from '../src/chain/simpleSequentialChain';
import {sequentialChain} from '../src/chain/sequentialChain';
import {default_try, math_try, physics_try} from '../src/chain/routerChain';
import {
    documentLoader, queryLLM,
    queryVectorStore, retrieverQA,
    showEmbedding,
} from '../src/question_and_answer/document';


test('base OpenAI api', async () => {
    const re = await getCompletion('Hello, my name is');
    console.log(re);
    expect(re).not.toBe(null);
});


describe('question and answer', async () => {

    it('show document loader', async () => {
        const re = await documentLoader();
    });

    it('show embedding ',async()=>{
        const _ = await showEmbedding();
    })

    it('Querying the Vector Store',async () => {
        const _ = await queryVectorStore();
    })

    it('Querying llm',async () => {
        const _ = await queryLLM()
    })

    it('retrieverQA',async () => {
        const _ = await retrieverQA()
    })
});



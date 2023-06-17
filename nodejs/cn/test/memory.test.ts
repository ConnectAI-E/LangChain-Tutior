import {describe, expect, it, test} from 'vitest';
import {getCompletion} from '../src/util/openai';
import {bufferMemory, bufferMemorySaveContext} from '../src/memory/bufferMemory';
import {
    bufferWindowMemory,
    windowBufferMemorySaveContext,
} from '../src/memory/bufferWindowMemory';
import {
    summaryBufferMemory,
    summaryMemorySaveContext,
} from '../src/memory/bufferSummaryMemory';


test('base OpenAI api', async () => {
    const re = await getCompletion('Hello, my name is');
    console.log(re);
    expect(re).not.toBe(null);
});


describe('Buffer memory', async () => {

    // BufferMemory is the simplest type of memory - it just remembers previous conversational back and forths directly.
    it('remember name', async () => {
        const re = await bufferMemory();
        expect(re).not.toBe(null);
    });

    it('save buffer context', async () => {
        const re = await bufferMemorySaveContext();
        expect(re).not.toBe(null);
    });

});


describe('window buffer memory', async () => {

    // BufferMemory is the simplest type of memory - it just remembers previous conversational back and forths directly.
    it('remember name', async () => {
        const re = await bufferWindowMemory();
        expect(re).not.toBe(null);
    });

    it('save  context', async () => {
        const re = await windowBufferMemorySaveContext();
        expect(re).not.toBe(null);
    });

});

describe('summary buffer memory', async () => {

    it('remember  name', async () => {
        const re = await summaryBufferMemory();
        expect(re).not.toBe(null);
    });

    it('save buffer context', async () => {
        const re = await summaryMemorySaveContext();
        expect(re).not.toBe(null);
    });
});




